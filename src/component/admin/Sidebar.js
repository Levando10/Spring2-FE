import "../admin/Sidebar.css";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import SweetAlert from "sweetalert";

export function Sidebar() {
    const [isLogin,setIsLogin] = useState(false);
    const navigate = useNavigate();
    const logout = async () => {
        localStorage.clear();
        setIsLogin(false)
        await SweetAlert(
            "Đăng xuất thành công",
            `Cám ơn bạn đã có những trải nghiệm với hệ thống của chúng tôi!`,
            "success"
        );
        navigate("/")
    }
    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin");
        const role = localStorage.getItem("role");
        if (isLogin !== null){
            if (role !== "ADMIN"){
                localStorage.setItem("notRole","OK");
                window.location.href = "http://localhost:3000/"
            }
        } else {
            localStorage.setItem("notLogin","OK");
            window.location.href = "http://localhost:3000/"
        }
    }, []);
    return (
        <>
            <div className="sidebar">
                <div className="logo-details">
                    <i className='bx bxl-c-plus-plus'></i>
                    <span className="logo_name"></span>
                </div>
                <ul className="nav-links">
                    <li className={window.location.pathname === "/" ? "activeCss" : ""}>
                        <Link to={"/"}>
                            <i className='bx bx-line-chart'></i>
                            <span className="link_name">Trang chủ</span>
                        </Link>
                    </li>
                    <li className={window.location.pathname === "/statisticProduct" ? "activeCss" : ""}>
                        <Link to={"/statisticProduct"}>
                            <i className='bx bx-line-chart'></i>
                            <span className="link_name">Thống kê sản phẩm </span>
                        </Link>
                    </li>
                    {/*<li>*/}
                    {/*    <Link to={"/statistic/member"}>*/}
                    {/*        <i className="bx bx-line-chart"></i>*/}
                    {/*        <span className="link_name">Thống kê thành viên</span>*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
                    <li className={window.location.pathname === "/statisticOrder" ? "activeCss" : ""}>
                        <Link to={"/statisticOrder"}>
                            <i className='bx bxs-credit-card'></i>
                            <span className="link_name">Quản lý đơn hàng</span>
                        </Link>
                    </li>
                    <li className={window.location.pathname === "/statisticAccount" ? "activeCss" : ""}>
                        <Link to={"/statisticAccount"}>
                            <i className='bx bxs-user-circle'></i>
                            <span className="link_name">Quản lý tài khoản</span>
                        </Link>
                    </li>
                    <li className={window.location.pathname === "/managementProduct" || window.location.pathname.startsWith("/editProduct/") ? "activeCss" : ""}>
                        <Link to={"/managementProduct"}>
                            <i className='bx bx-video'></i>
                            <span className="link_name">Quản lý sản phẩm</span>
                        </Link>
                    </li>
                    <li>
                        <div className="profile-details">
                            <div className="profile-content" style={{paddingLeft: "4rem"}}>
                                <img src="https://thcsgiangvo-hn.edu.vn/wp-content/uploads/2023/09/anh-mac-dinh-7.jpg"
                                     alt="profileImg"/>
                            </div>
                            <a onClick={logout} style={{paddingRight: "4rem"}}>
                                <i className="fas fa-sign-out-alt"
                                   style={{fontSize: "2rem", marginTop: "0.5rem", color: "white"}}></i>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}