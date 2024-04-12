import Header from "../Home/Header";
import Footer from "../Home/Footer";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import SweetAlert from "sweetalert";
import {CartShoppingService} from "../Service/CartShoppingService";
import {ProductService} from "../Service/ProductService";
import {Swiper, SwiperSlide} from "swiper/react";
import {EffectCube, Pagination} from "swiper/modules";

export default  function DetailProduct(){
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state.productDetail;
    const [isLogin,setIsLogin] = useState(false);
    const [qualityProduct,setQualityProduct] = useState(0);
    const [role,setRole] = useState("USER")


    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const handleViewCart = async () => {
        const idAccount = localStorage.getItem("idAccount")

        navigate("/cartDetail",{state:{
                idAccount:idAccount
            }})

    }
    const handleViewHome = async () => {
        navigate("/")

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

    const handleAddToCartInDetail = async  (idProduct) => {
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
        window.scrollTo(0, 0);
        const role = localStorage.getItem("role")
        setRole(role);
        const qualityCart = async () => {
            try {
                const token = localStorage.getItem("authToken");
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


    }, []);
    return(
        <>

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
                                        <a className="nav-link" href="">Sản phẩm</a>
                                    </li>
                                    {
                                        role === "ADMIN" ? (<li className="nav-item">
                                            <a className="nav-link">Quản lý</a>
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
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#" onClick={informationDetail}>Thông tin cá nhân</a>
                                        <a className="dropdown-item" onClick={historyBooking}>Lịch sử mua hàng</a>
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

            <div className="single-product mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5 ">
                            <div className="single-product-img rounded rounded-5">
                                <Swiper
                                    effect={'cube'}
                                    grabCursor={true}
                                    cubeEffect={{
                                        shadow: true,
                                        slideShadows: true,
                                        shadowOffset: 20,
                                        shadowScale: 0.94,
                                    }}
                                    pagination={true}
                                    modules={[EffectCube, Pagination]}
                                    className="mySwiper"
                                >
                                    {data.imageProducts.map((item) => (
                                        <SwiperSlide>
                                            <img src={item.urlImage
                                            } />
                                        </SwiperSlide>
                                    )) }
                                </Swiper>


                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="single-product-content">
                                <h3>{data.name}</h3>
                                <p className="single-product-pricing">
                                    <span>Loại: {data.category.name}</span> {formatCurrency(data.price)}</p>
                                <p>{data.description}. 🕶️✨.</p>
                                <div className="mt-2 single-product-form">

                                <a onClick={() => handleAddToCartInDetail(`${data.id}`)}
                                       className="boxed-btn mt-1 "><i
                                        className="fas fa-shopping-cart"></i> Thêm giỏ hàng
                                    </a>
                                    <p><strong>Hãng : </strong>{data.manufacturer.name}</p>
                                </div>
                                <h4>Share:</h4>
                                <ul className="product-share">
                                <li><a href=""><i className="fab fa-facebook-f"></i></a></li>
                                    <li><a href=""><i className="fab fa-twitter"></i></a></li>
                                    <li><a href=""><i className="fab fa-google-plus-g"></i></a></li>
                                    <li><a href=""><i className="fab fa-linkedin"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <Footer/>
        </>
    )

}