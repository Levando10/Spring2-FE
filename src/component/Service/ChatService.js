import SockJS from 'sockjs-client';
import axios from "axios";

let stompClient = null;

// const connect = (onMessageReceived) => {
//     const socket = new SockJS('http://localhost:8080/ws');
//     stompClient = Stomp.over(socket);
//     stompClient.connect({}, (frame) => {
//         stompClient.subscribe('/topic/public', (message) => {
//             onMessageReceived(JSON.parse(message.body));
//         });
//     });
// };

const sendMessage = (msg) => {
    stompClient.send("/app/chat.send", {}, JSON.stringify(msg));
};

const disconnect = () => {
    if (stompClient) {
        stompClient.disconnect();
    }
};

const listMessage = async (idAccount,token) => {
    try {
        return (await axios.get(`http://localhost:8080/message/`, {
            params: {
                idAccount: idAccount
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        })).data;
    } catch (error){
        throw error.response
    }
};
const listMessagesWithUser = async (idAccount,token) => {
    try {
        return (await axios.get(`http://localhost:8080/message/`, {
            params: {
                idAccount: idAccount
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        })).data;
    } catch (error){
        throw error.response
    }
};

export const ChatService = {
    // connect,
    sendMessage,
    disconnect,
    listMessage,
    listMessagesWithUser
};
