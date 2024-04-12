import {useNavigate} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import SweetAlert from "sweetalert";
import {CartShoppingService} from "../Service/CartShoppingService";
import Header from "../Home/Header";
import Footer from "../Home/Footer";
import {ProductService} from "../Service/ProductService";
import {CategoryService} from "../Service/CategoryService";
import ReactPaginate from "react-paginate";
import {ManufacturerService} from "../Service/ManufacturerService";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { EffectCube, Pagination } from 'swiper/modules';




export default function ListProduct(){
    const navigate = useNavigate();
    const [isLogin,setIsLogin] = useState(false);
    const [qualityProduct,setQualityProduct] = useState(0);
    const [role,setRole] = useState("USER");
    const [listProduct,setListProduct] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [listCategory, setListCategory] = useState([])
    const [searchPage, setSearchPage] = useState(false)
    const [listManufacturer, setListManufacturer] = useState([])

    const [categoryMatClick,setCategoryMatClick] = useState(false)
    const [categoryCanClick,setCategoryCanClick] = useState(false)
    const [facGucciClick,setFacGucciClick] = useState(false)
    const [facDiorClick,setFacDiorClick] = useState(false)

    const [can,setCan] = useState("")
    const [mat,setMat] = useState("")
    const [gucci,setGucci] = useState("")
    const [dior,setDior] = useState("")
    const [searchCurrentPage, setSearchCurrentPage] = useState(0);


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


    const handleAddToCartInHome  = async  (idProduct) => {
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

                const listData = await ProductService.listProductFull(0);
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

    const handleProductDetail  = async  (idProduct) => {
        try {
            const data = await ProductService.findProductById(idProduct);
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

            const listData = await ProductService.listProductFull(0);
            setListProduct(listData.content);
            setTotalPages(listData.totalPages);
        }
    }
    const handlePageClick = async (event) => {
        const pageNumber = event.selected;
        console.log(pageNumber)
        const listData = await ProductService.listProductFull(pageNumber);

        if (searchPage){
            const listDataSearch = await ProductService.searchProductCan(pageNumber,can,mat,gucci,dior);
            setListProduct(listDataSearch.content);
            setTotalPages(listDataSearch.totalPages);
        } else {
            setListProduct(listData.content);
            setTotalPages(listData.totalPages);
        }

    }


    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("role");
        setRole(role)

        const fetchData = async (page) => {
            try {
                const listData = await ProductService.listProductFull(page);
                setListProduct(listData.content);
                console.log(listData.content)
                setTotalPages(listData.totalPages);
            } catch (e){
                console.log(e)
            }
        };
        fetchData(currentPage);
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

        const listCategoryProduct = async () => {
            try {
                const listDataCategory = await CategoryService.listCategory();
                setListCategory(listDataCategory);
            } catch (e){
                console.log(e)
            }
        };

        const listManufacturerProduct = async () => {
            try {
                const listDataManufacturer = await ManufacturerService.listManufacturer();
                setListManufacturer(listDataManufacturer);
            } catch (e){
                console.log(e)
            }
        };

        listCategoryProduct();
        listManufacturerProduct();


    }, []);

    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const handleClickCategoryCan = async () => {
        if(categoryCanClick){
            setCategoryCanClick(false)
            setCan("")
    } else {
            setCan("Cận")
           setCategoryCanClick(true);}


    }
    const handleClickCategoryMat = async () => {
      if (categoryMatClick){
            setCategoryMatClick(false)
          setMat("")

      } else {
            setCategoryMatClick(true)
          setMat("Mát")
      }


    }
    const handClickFacGuuci = async () => {
        if (facGucciClick){
                setFacGucciClick(false)
            setGucci("")
        } else {
               setFacGucciClick(true)
            setGucci("Gucci")
        }

    }
    const handClickFacDior = async () => {
        if (facDiorClick){
                setFacDiorClick(false)
            setDior("")
        } else {
               setFacDiorClick(true)
            setDior("Dior")
        }

    }
    const handleSearch = async () => {
        setSearchPage(true);
        setCurrentPage(0)
        console.log(currentPage + " hello fetch")
        const listData = await ProductService.searchProductCan(currentPage,can,mat,gucci,dior);
        setListProduct(listData.content);
        setTotalPages(listData.totalPages);

    }
    useEffect(() => {
        window.scrollTo(0, 0);
        if (can != "" || mat != "" || gucci != "" || dior != ""){
             handleSearch();
            setCurrentPage(0);
        }
        if (can == "" || mat == "" || gucci == "" || dior == ""){
            handleSearch();
            setCurrentPage(0);
        }

    }, [categoryCanClick, categoryMatClick, facGucciClick, facDiorClick]);

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
                                        <a className="nav-link" onClick={() => handleViewProduct()}>Sản phẩm</a>
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
                                        <a className="dropdown-item" onClick={informationDetail}>Thông tin cá nhân</a>
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
            <div className="product-section mt-150 mb-150">
                <div className="container">

                    <div className="row">
                        <div className="col-md-12">
                            <div className="product-filters">
                                <ul>
                                    {(categoryCanClick || categoryMatClick || facDiorClick || facGucciClick) === false ? (
                                        <li className="active">All</li>) : (<li >All</li>)}

                                    {categoryCanClick ? (<li className={"active"}><a  onClick={handleClickCategoryCan}>Kinh cận</a></li>) : (
                                        <li><a  onClick={handleClickCategoryCan}>Kinh cận</a></li>)}

                                    {categoryMatClick ? (<li className={"active"}><a onClick={handleClickCategoryMat}>Kính Mát</a></li>) : (
                                        <li><a onClick={handleClickCategoryMat}>Kính Mát</a></li>)}

                                </ul>
                                <ul className="product-filters">
                                    {facGucciClick ? (<li className={"active"}><a onClick={handClickFacGuuci}>Guuci</a></li>) : (
                                        <li><a onClick={handClickFacGuuci}>Guuci</a></li>)}

                                    {facDiorClick ? (<li className={"active"}><a onClick={handClickFacDior}>Dior</a></li>) : (
                                        <li><a onClick={handClickFacDior}>Dior</a></li>)}

                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className="row product-lists">
                        {listProduct.map((item, index) => {
                            return <div className="product-hover col-lg-4 col-md-6 text-center">
                                <div className="single-product-item">
                                    <div className="product-image rounded rounded-5">
                                        <a onClick={() => handleProductDetail(`${item.idProduct}`)}><img key={index}
                                                                                                         src={`${item.imageMax}`}
                                                                                                         alt=""/></a>
                                    </div>
                                    <h4>{item.nameProduct}</h4>
                                    <h5>{item.nameCategory}</h5>
                                    <p className="product-price">
                                        <span>Hãng: {item.nameFac}</span> {formatCurrency(item.price)}đ </p>
                                    <a onClick={() => handleAddToCartInHome(`${item.idProduct}`)}
                                       className="gioHang boxed-btn mt-1 "><i
                                        className="fas fa-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>;
                        })}
                    </div>

                    <div className={"row"}>
                        { listProduct.length !== 0 ?  <div className="clearfix">
                            <div style={{float: "right"}} className="page">
                                <ReactPaginate
                                    forcePage = {currentPage}
                                    breakLabel="..."
                                    nextLabel="Trang Sau"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={2}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPages}
                                    previousLabel="Trang Trước"
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
                                />
                            </div>
                        </div> : ""}
                    </div>


                </div>
            </div>

            <Footer/>
        </>
    )
}