import {useSubscription} from "react-stomp-hooks";
import {useState} from "react";

const ChildComponent = () => {
    const id = localStorage.getItem("idAccount")
    const [message, setMessage] = useState("");
    // Subscribe to the custom queue
    useSubscription('/queue/reply-' + {id}, (message) => {setMessage(message.body)});
    return (
        <div> The message from some other user is {message}</div>
    )
}
export default ChildComponent;
