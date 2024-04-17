import {useEffect, useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import {Link, useNavigate} from "react-router-dom";
import {ProductService} from "../Service/ProductService";
import ReactPaginate from "react-paginate";
import SweetAlert from "sweetalert";
import MySwal from "sweetalert2";
import {CartShoppingService} from "../Service/CartShoppingService";
import Cookies from "js-cookie";
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import '../Product/swiper.css';


import { EffectCube, Pagination } from 'swiper/modules';


export default  function Home(){
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [listProduct,setListProduct] = useState([]);
    const navigate = useNavigate();
    const [isLogin,setIsLogin] = useState(false);
    const [qualityProduct,setQualityProduct] = useState(0);
    const [role,setRole] = useState("USER")



    const handleViewCart = async () => {
        const idAccount = localStorage.getItem("idAccount")

        navigate("/cartDetail",{state:{
            idAccount:idAccount
            }})

    }
    const handleViewHome = async () => {
        navigate("/")
    }
    const handleViewProduct = async () => {
        navigate("/listProduct")
    }
    const handleAdminManagement = async () => {
        navigate("/statisticOrder")
    }

    const handlePageClick = async (event) => {
        const pageNumber = event.selected;
        const listData = await ProductService.listProduct(pageNumber);
        setListProduct(listData.content);
        setTotalPages(listData.totalPages);
    }

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

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
const historyBooking = async () => {
    navigate("/historyBooking")
}
const informationDetail = async () => {
    navigate("/informationDetail")
}

    const handleProductDetail  = async  (idProduct) => {

        try {
            const data = await ProductService.findProductById(idProduct);
            console.log("da co data")
            console.log(data)
            navigate("/detailProduct",{state:{
                    productDetail:data
                }
            })
        } catch (err){
            if (err.data === "BAD_REQUEST"){
                await SweetAlert(
                    "Sản phẩm đã hết",
                    `Vui lòng chọn sản phẩm khác!`,
                    "error"
                );
            }
            const listData = await ProductService.listProduct(0);
            setListProduct(listData.content);
            setTotalPages(listData.totalPages);
        }


    }
    const handleAddToCartInHome  = async  (idProduct) => {
        console.log(idProduct)
        if (isLogin){
            try {

                try {
                    const token = localStorage.getItem("authToken");
                    const idUser = localStorage.getItem("idAccount");
                    await CartShoppingService.checkProductExistInCart(idProduct,idUser,token);
                    await SweetAlert(
                        "Sản phẩm đã được thêm thành công",
                        ``,
                        "success"
                    );

                    const qualityProductCart = await CartShoppingService.qualityProductInCart(idUser,token);
                    setQualityProduct(qualityProductCart)

                } catch (e) {
                    console.log(e)
                }


            } catch (err){
                if (err.data === "BAD_REQUEST"){
                    await SweetAlert(
                        "Sản phẩm đã hết",
                        `Vui lòng chọn sản phẩm khác!`,
                        "error"
                    );
                }

                const listData = await ProductService.listProduct(0);
                setListProduct(listData.content);
                setTotalPages(listData.totalPages);
            }
        } else {
            await SweetAlert(
                "Vui lòng đăng nhập",
                `Trước khi thêm sản phẩm`,
                "error"
            );
            navigate("/login")
        }


    }

    useEffect(() => {
        document.title = 'Trang chủ';
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("role")
        setRole(role);
        const fetchData = async (page) => {
            try {
                const listData = await ProductService.listProduct(page);
                setListProduct(listData.content);
                setTotalPages(listData.totalPages);

            } catch (e){
                console.log(e)
            }
        };
        fetchData(currentPage);
        window.scrollTo(0, 0);

        const qualityCart = async () => {
            try {
                const idUser = localStorage.getItem("idAccount");
                const qualityProductCart = await CartShoppingService.qualityProductInCart(idUser,token);
                setQualityProduct(qualityProductCart)
            } catch (e){
                console.log(e)
            }
        }

        const isLogin = localStorage.getItem("isLogin");

        if (isLogin){
            setIsLogin(true)
            qualityCart();
        }



        const paymentOke = async  () => {
               await SweetAlert(
                    "Sản phẩm đã được thanh toán thành công",
                    ``,
                    "success"
                );
        }

        const notLoginAccount = async  () => {
            await SweetAlert(
                "Yêu cầu đăng nhập!!!",
                ``,
                "warning"
            );
        }
        const notRoleAccount = async  () => {
            await SweetAlert(
                "Bạn không có quyền truy cập!!!",
                ``,
                "warning"
            );
        }
        const notLogin = localStorage.getItem("notLogin")
        const notRole = localStorage.getItem("notRole")
        if (notLogin === "OK"){
            localStorage.setItem("notLogin","NO");
            notLoginAccount();
        }

        if (notRole === "OK"){
            localStorage.setItem("notRole","NO");
            notRoleAccount();
        }



        const paymentSuccess = localStorage.getItem("paymentSuccess");
        if ( paymentSuccess === "OK") {
            localStorage.setItem("paymentSuccess","NO");
            paymentOke();
            // window.location.reload();
        }


    }, []);

    return(
        <>
            {/*<div className="loader">*/}
            {/*    <div className="loader-inner">*/}
            {/*        <div className="circle"></div>*/}
            {/*    </div>*/}
            {/*</div>*/}


            {isLogin ? (<div>
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
                                    {
                                        role === "ADMIN" ? (<li className="nav-item">
                                            <a className="nav-link" onClick={() => handleAdminManagement()}>Quản lý</a>
                                        </li>) : ""
                                    }


                                    <li>
                                        <div className="header-icons">
                                            <a className="shopping-cart" onClick={() => handleViewCart()}><i
                                                className="fas fa-shopping-cart"></i>{qualityProduct == 0 ? "" : <sub
                                                style={{
                                                    padding: "2px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "red"
                                                }}>{qualityProduct}
                                            </sub>}
                                            </a>
                                        </div>
                                    </li>

                                </ul>

                                <div className="dropdown navbar-nav text-center ml-auto my-4">
                                    <a className="boxed-btn dropdown-toggle" type="button"
                                            data-toggle="dropdown" aria-expanded="false">
                                        {localStorage.getItem("nameAccount")}
                                    </a>
                                    <div className="dropdown-menu" >
                                        <a className="dropdown-item" onClick={informationDetail}>Thông tin cá nhân</a>
                                        <a className="dropdown-item"  onClick={historyBooking}>Lịch sử mua hàng</a>
                                        <a onClick={logout} className="dropdown-item" style={{
                                            marginTop: "0.5rem",
                                            cursor: 'pointer'
                                        }}>Đăng xuất</a>
                                    </div>
                                </div>


                            </div>
                        </nav>
                    </div>
                </div>
            </div>) : <Header/>}


            <div className={"py-4"}>
            <div className="hide-menubar" id="hide-navbar">
                </div>
            </div>
            <div className="background-container">
            </div>


            <div className="search-area">
            <div className="container">
                    <div className="row">
                    <div className="col-lg-12">
                            <span className="close-btn"><i className="fas fa-window-close"></i></span>
                            <div className="search-bar">
                                <div className="search-bar-tablecell">
                                    <h3>Search For:</h3>
                                    <input type="text" placeholder="Keywords"/>
                                    <button type="submit">Search <i className="fas fa-search"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="list-section pt-80 pb-80">
                <div className="container">

                    <div className="row">
                        <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                            <div className="list-box d-flex align-items-center">
                                <div className="list-icon">
                                    <i className="fas fa-shipping-fast"></i>
                                </div>
                                <div className="content">
                                    <h3>Miễn phí ship</h3>
                                    <p>Khi thanh toán trên 1 triệu đồng</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                            <div className="list-box d-flex align-items-center">
                                <div className="list-icon">
                                    <i className="fas fa-phone-volume"></i>
                                </div>
                                <div className="content">
                                    <h3>Hổ trợ 24/7</h3>
                                    <p>Hổ trợ mỗi ngày</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="list-box d-flex justify-content-start align-items-center">
                                <div className="list-icon">
                                    <i className="fas fa-sync"></i>
                                </div>
                                <div className="content">
                                    <h3>Hoàn trả</h3>
                                    <p>Hoàn trả trong 3 ngày!</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>


            <div className="product-section mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 text-center">
                            <div className="section-title">
                                <h3><span className="orange-text">Sản phẩm</span> của chúng tôi</h3>
                                <p>Chúng tôi mang đến những sản phẩm chất lượng và có độ bền cao.</p>
                            </div>
                        </div>
                    </div>


                    <div className="row product-lists">
                        {listProduct.map((item, index) => {
                            return <div className="product-hover col-lg-4 col-md-6 text-center">
                                <div className="single-product-item">
                                    <div className="product-image rounded rounded-5">
                                        <a onClick={() => handleProductDetail(item.id)}><img key={index}
                                                                                             src={item.imageProducts[0].urlImage}


                                            alt="product"/></a>
                                    </div>
                                    <h3>{item.name}</h3>
                                    <h5>{item.category.name}</h5>
                                    <p className="product-price">
                                        <span>Hãng: {item.manufacturer.name}</span> {formatNumber(item.price)}đ </p>
                                    <a onClick={() => handleAddToCartInHome(`${item.id}`)}
                                       className="gioHang boxed-btn mt-1 "><i
                                        className="fas fa-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>;
                        })}
                    </div>

                    <div className={"row"}>
                        {listProduct.length !== 0 ? <div className="clearfix">
                            <div style={{float: "right"}} className="page">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel="Trang sau"
                                    onPageChange={handlePageClick}

                                    pageRangeDisplayed={2}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPages}
                                    previousLabel="Trang trước"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    initialPage={currentPage}
                                />
                            </div>
                        </div> : ""}
                    </div>

                </div>
            </div>


            <div className="abt-section mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="abt-bg">
                                <a href="https://www.youtube.com/watch?v=aWTOxz501CM"
                                   target={"_blank"} className="video-play-btn popup-youtube"><i
                                    className="fas fa-play"></i></a>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="abt-text">
                                <p className="top-sub">Từ Năm 2020</p>
                                <h3>Chúng tôi là <span className="orange-text">CGGLASSES</span></h3>
                                <p>Từ khi thành lập vào năm 1999, CGGLASSES đã không ngừng phát triển và sáng tạo để trở
                                    thành đối
                                    tác đáng tin cậy trong lĩnh vực cung cấp kính mắt. Với sự hướng dẫn tỉ mỉ và tâm
                                    huyết, chúng tôi
                                    đã tập trung vào chất lượng và dịch vụ, mang đến cho quý khách những sản phẩm kính
                                    độc đáo và phong cách.
                                    Chúng tôi tự hào với đội ngũ chuyên gia giàu kinh nghiệm,
                                    luôn sẵn sàng cung cấp giải pháp tối ưu cho đôi mắt của bạn</p>
                                <p>Tại CGGLASSES, chúng tôi không chỉ bán kính mắt - chúng tôi mang đến vẻ đẹp và sự
                                    thoải mái cho tầm nhìn của bạn.
                                    Mỗi sản phẩm của chúng tôi đều trải qua quy trình
                                    kiểm định nghiêm ngặt để đảm bảo phong cách đồng thời không làm mất đi tính thực
                                    dụng và độ bền</p>
                                <a href="about.html" className="boxed-btn mt-4">know more</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </>

    )

}