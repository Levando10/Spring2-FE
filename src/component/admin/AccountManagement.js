import {Sidebar} from "./Sidebar";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function AccountManagement(){
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Quản lý tài khoản';


    }, []);
    return(
        <>
            <Sidebar />
        </>
    )
}