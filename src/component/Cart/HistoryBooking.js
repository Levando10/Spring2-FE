import "./history.css"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import SweetAlert from "sweetalert";
import Footer from "../Home/Footer";
import { parseISO, format } from 'date-fns';
import {CartShoppingService} from "../Service/CartShoppingService";
import MySwal from "sweetalert2";
import {ProductService} from "../Service/ProductService";
import ReactPaginate from "react-paginate";

export default  function HistoryBooking(){
    const navigate = useNavigate();
    const [isLogin,setIsLogin] = useState(false);
    const [listCart,setListCart] = useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const handleViewHome = async () => {
        navigate("/")
    }
    const handleViewCart = async () => {
        const idAccount = localStorage.getItem("idAccount")

        navigate("/cartDetail",{state:{
                idAccount:idAccount
            }})

    }
    const handlePageClick = async (event) => {
        const token = localStorage.getItem("authToken");
        const idUser = localStorage.getItem("idAccount");
        const pageNumber = event.selected;
        const historyList = await CartShoppingService.historyCartDetail(idUser,token,pageNumber);
        setListCart(historyList.content)
        setTotalPages(historyList.totalPages)
    }

    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin");
        if (isLogin !== null){

        } else {
            localStorage.setItem("notLogin","OK");
            navigate("/")
        }

        const token = localStorage.getItem("authToken");
        const idUser = localStorage.getItem("idAccount");
        const qualityCart = async () => {
            try {

                const qualityProductCart = await CartShoppingService.qualityProductInCart(idUser,token);
                setQualityProduct(qualityProductCart)
            } catch (e){
                console.log(e)
            }
        }
        qualityCart();

        const listHistoryCart = async () => {
            try {

                const historyList = await CartShoppingService.historyCartDetail(idUser,token,0);
                setListCart(historyList.content)
                setTotalPages(historyList.totalPages)
                console.log(historyList.content)
            } catch (e){
                console.log(e)
            }
        }
        listHistoryCart();

    }, []);
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

    function formatLocalDateTime(localDateTimeStr) {
        const date = parseISO(localDateTimeStr);
        return format(date, 'dd-MM-yyyy HH:mm:ss');
    }

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const handleViewProduct = async () => {
        navigate("/listProduct")
    }



    const [qualityProduct,setQualityProduct] = useState(0);
    const [role,setRole] = useState("USER")

    const showDetailBooking = async (idCart) => {
        const token = localStorage.getItem("authToken");
        const detailBooking = await CartShoppingService.detailBooking(idCart, token);



        await MySwal.fire({
            title: 'Chi tiết đơn hàng',
            html: `
      <style>
      .swal2-container {
    overflow-y: auto !important;
}

  
  
        .item-wrap {
          border-bottom: 1px solid #eee;
          padding: 10px 0;
          margin-bottom: 10px;
        }
        .cart-wrap {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
        }
        .item-info {
          display: flex;
          align-items: center;
        }
        .item-info img {
          margin-right: 13px;
          max-width: 50px; 
          max-height: 50px;
        }
        .item-title h5 {
          margin: 0;
          font-size: 1em;
        }
        .item-price {
          flex: 1;
          text-align: right;
        }
        .full-price span {
          font-weight: bold;
        }
       
      </style>
      <div style="text-align: left">
        <p style="font-weight: bold;">Địa chỉ nhận hàng: ${detailBooking[0].address}</p>
      </div>
      ${detailBooking.map((item, index) => `
        <div class="item-wrap" id="cart-page-result-${index}">
          <ul class="cart-wrap" data-line="${index}">
            <li class="item-info">
              <div>
                <img src="${item.imageMax}" alt="Product" />
              </div>
              <div class="item-title">
                <h5>Số lượng: ${item.quantity}</h5>
              </div>
            </li>
            <li class="item-price">
              <span class="amount full-price">
                <span>${formatNumber(item.priceUnit)}đ</span>
              </span>
            </li>
          </ul>
        </div>
      `).join('')}
    `,
            customClass: {
                container: 'swal2-container',
                popup: 'popup-class',
                title: 'title-class',
                closeButton: 'close-button-class',
                icon: 'icon-class',
                image: 'image-class',
                content: 'content-class',
                input: 'input-class',
                actions: 'actions-class',
                confirmButton: 'confirm-button-class',
                cancelButton: 'cancel-button-class',
                footer: 'footer-class'
            },
        });
    };


    return (
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
                                        <a onClick={() => handleViewProduct()} className="nav-link">Sản Phẩm</a>

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
            </div>


            <div style={{marginTop: "20vh", marginBottom: "20vh"}} className="container">
                <table className="table table-responsive table-hover">
                    <tr>
                        <th style={{width: "10%"}}>STT</th>
                        <th style={{width: "10%"}}>Ngày đặt</th>
                        <th style={{width: "10%"}}>Trạng thái</th>
                        <th style={{width: "10%"}}>Tổng tiền</th>
                        <th style={{width: "15%"}}>Chi tiết</th>
                    </tr>
                    {listCart.map((item, index) => (


                        <tr>
                            <td key={item.idCart}>{index + 1}</td>
                            <td>{formatLocalDateTime(item.orderDay)}</td>
                            <td>{item.statusCart === "paid" ? "đã thanh toán" : "chưa thanh toán"}</td>
                            <td>{formatNumber(item.totalPrice)}đ</td>
                            <td>
                                <a className="boxed-btn"
                                   type="submit"
                                   onClick={() => {
                                       showDetailBooking(item.idCart)
                                   }}
                                   data-address-default="ThemeSyntaxError">Chi
                                    tiết
                                </a>


                            </td>


                        </tr>
                    ))
                    }

                </table>
                <div className={"row"}>
                    {listCart.length !== 0 ? <div className="clearfix">
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


            <Footer/>

        </>
    )
}