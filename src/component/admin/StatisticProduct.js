import {Sidebar} from "./Sidebar";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function StatisticProduct(){
    const navigate = useNavigate();

    const [isLogin,setIsLogin] = useState(false);

    useEffect(() => {
        document.title = 'Thống kê sản phẩm';
        const token = localStorage.getItem("authToken");
        const isLogin = localStorage.getItem("isLogin");
        const role = localStorage.getItem("role");
        if (isLogin !== null){
            if (role !== "ADMIN"){
                localStorage.setItem("notRole","OK");
                navigate("/")
            }

        } else {
            localStorage.setItem("notLogin","OK");
            navigate("/")
        }
    }, []);
    return(
        <>
        <Sidebar />

        </>
    )
}