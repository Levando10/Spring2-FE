import React, { useEffect, useState } from "react";
import { Sidebar } from "../Sidebar";
import { AdminService } from "../../Service/AdminService";
import { ChatService } from "../../Service/ChatService";
import { FaUser } from "react-icons/fa";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function ManagementMessage() {
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [userData, setUserData] = useState({
        idSender: localStorage.getItem("idAccount"),
        receiver: "ADMIN",
        content: "",
        username: localStorage.getItem("nameAccount"),
        idReceiver: ""
    });

    useEffect(() => {
        document.title = 'Quản lý tin nhắn';
        const token = localStorage.getItem("authToken");

        const connectWebSocket = () => {
            const socket = new SockJS('http://localhost:8080/ws');
            const stomp = Stomp.over(socket);
            stomp.connect({}, () => {
                console.log('Connected to WebSocket');
                setStompClient(stomp);
            });
        };

        connectWebSocket();
        fetchData(token);

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (stompClient && selectedUser) {
            const subscription = stompClient.subscribe(`/user/${selectedUser.id}/private`, onPrivateMessage);
            return () => subscription.unsubscribe();
        }
    }, [stompClient, selectedUser]);

    const fetchData = async (token) => {
        try {
            const response = await AdminService.listAccount(token);
            setUserList(response);
            if (!selectedUser && response.length > 0) {
                handleUserClick(response[0]);
            }
        } catch (error) {
            console.error("Error fetching user list:", error);
        }
    };

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        const token = localStorage.getItem("authToken");
        try {
            const response = await ChatService.listMessagesWithUser(user.id, token);
            setMessages(response);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const onPrivateMessage = (message) => {
        const newMessage = JSON.parse(message.body);

        if (newMessage.sender.id === selectedUser.id) {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        }
    };

    const sendMessageToUser = async () => {
        if (stompClient && message.trim() !== '') {
            stompClient.send("/app/admin-chat", {}, JSON.stringify(userData));
            setUserData({...userData,"content": ""});
            setMessage("")

            const token = localStorage.getItem("authToken");
            const response = await ChatService.listMessagesWithUser(selectedUser.id, token);
            try {
                const response = await ChatService.listMessagesWithUser(selectedUser.id, token);
                setMessages(response);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }

        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
        const { value } = event.target;
        setUserData({ ...userData, "content": value, "idReceiver": selectedUser.id });
    };

    return (
        <>
            <Sidebar />
            <section className="home-section">
                <div className="container body_movie">
                    <h2 style={{ paddingTop: "20px" }}>Danh sách tin nhắn</h2>
                    <div className="sidebarAdmin">
                        <ul>
                            {userList.map((user) => (
                                <li key={user.id} onClick={() => handleUserClick(user)}>
                                    <FaUser /> {user.nameAccount}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="chat">
                        {selectedUser && (
                            <div className="chat-header">
                                <h2>Chat với {selectedUser.nameAccount}</h2>
                            </div>
                        )}
                        <div className="chat-messages">
                            {messages.map((message, index) => (
                                <div className="message" key={index}>
                                    <p>{message.content}</p>
                                </div>
                            ))}
                        </div>
                        <div className="chat-form">
                            <input onChange={handleMessageChange} value={message} type="text" placeholder="Nhập tin nhắn..." />
                            <button onClick={sendMessageToUser} type="submit">Gửi</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
