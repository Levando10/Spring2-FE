import React from 'react';
import { useStompClient } from 'react-stomp-hooks';

const PublishComponent = () => {
    const stompClient = useStompClient();

    const publishMessage = () => {
        if(stompClient) {
            stompClient.publish({
                destination: '/app/user-message',
                body: 'Hello to myself'
            });
        }
    };

    return (
        <div onClick={publishMessage}>Expect reply for my action</div>
    );
};

export default PublishComponent;