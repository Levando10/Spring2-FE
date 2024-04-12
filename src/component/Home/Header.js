import "./main.css"
import "./Header.css"
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProductService} from "../Service/ProductService";
import {CartShoppingService} from "../Service/CartShoppingService";

export default function Header(){
    const [status,setStatus] = useState(false)
    const navigate = useNavigate();
    const [roleUser, setRoleUser] = useState("");
    const [userName, setUserName] = useState("");
    const [isLogin, setIsLogin] = useState(false)

    const handleViewCart = async () => {
        navigate("/cartDetail")

    }
    const handleViewHome = async () => {
        navigate("/")

    }
    const handleViewLogin = async () => {
        navigate("/login")

    }
    const handleViewProduct = async () => {
        navigate("/listProduct")

    }

    // const addToCartInHeader = async () => {
    //     const idUser = 1;
    //     const qualityProductCart = await CartShoppingService.qualityProductInCart(idUser);
    //     setQualityProduct(qualityProductCart)
    // };





    return(
        <>


            <div>
                <div className="hide-menubar" id="hide-navbar">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-dark px-0 navbar-onscroll-by-user">
                            <a className="navbar-brand"></a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#hideNavbar" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"/>
                            </button>

                            <div className="collapse navbar-collapse" id="hideNavbar">
                                <ul className="navbar-nav text-center ml-auto">
                                    <li className="nav-item">
                                        <a onClick={() => handleViewHome()} className="nav-link">Trang chủ</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="">Hỗ trợ</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="">Liên hệ</a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" onClick={() => handleViewProduct()}>Sản phẩm</a>
                                    </li>

                                </ul>
                                <ul className="navbar-nav text-center ml-auto my-4">

                                    <li className="nav-item">
                                    <a onClick={() => handleViewLogin()} className="boxed-btn btn" href=""
                                           style={{textDecoration: "none"}}>Đăng nhập</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>


        </>
    )

}