import {Sidebar} from "./Sidebar";
import ReactPaginate from "react-paginate";
import {useEffect, useState} from "react";
import {CartShoppingService} from "../Service/CartShoppingService";
import {format, parseISO} from "date-fns";
import MySwal from "sweetalert2";
import "./admin.css"
import {useNavigate} from "react-router-dom";

export default function AdminManagement(){
    const [listCart,setListCart] = useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const navigate = useNavigate();


    function formatLocalDateTime(localDateTimeStr) {
        const date = parseISO(localDateTimeStr);
        return format(date, 'dd-MM-yyyy HH:mm:ss');
    }

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

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
         max-width: 15vh;
         max-height: 15vh;
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

    const handlePageClick = async (event) => {
        try {
            const token = localStorage.getItem("authToken");
            const pageNumber = event.selected;
            setCurrentPage(pageNumber);
            let res = await CartShoppingService.managementHistoryCartByAdmin(token,pageNumber);
            if (nameSearch !== "" || startDate !== ""){
                res = await CartShoppingService.searchOrderCartHistory(pageNumber,startDate,nameSearch,localStorage.getItem("authToken"));
            }

            setListCart(res.content)
            setTotalPages(res.totalPages)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        document.title = 'Quản lý đơn hàng ';
        const token = localStorage.getItem("authToken");
        const idUser = localStorage.getItem("idAccount");
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
        const managementHistoryCart = async () => {
            try {

                const allOrder = await CartShoppingService.managementHistoryCartByAdmin(token,0);
                setListCart(allOrder.content)
                setTotalPages(allOrder.totalPages)
                console.log(allOrder.content)
            } catch (e){
                console.log(e)
            }
        }
        managementHistoryCart();
    }, []);
    const handleStartDate = (value) => {
        setStartDate(value);
    }
    const handleNameSearch = (value) => {
        if (value.length > 100) {
            MySwal.fire({
                text: "Không được nhập quá 100 ký tự",
                icon: "warning"
            });
            setNameSearch('');
        } else {
            setNameSearch(value);
        }
    }
    const submitSearch = async () => {
        const tenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 10));
        const currentDate = new Date();
        const startDateInput = new Date(startDate);

        if (startDateInput < tenYearsAgo) {
            MySwal.fire({
                text: "Ngày bắt đầu không được nhỏ hơn " + tenYearsAgo.toLocaleDateString(),
                icon: "warning"
            });
        } else if (startDateInput > currentDate) {
            MySwal.fire({
                text: `Ngày bắt đầu không được lớn hơn ${startDateInput.toLocaleDateString()}.`,
                icon: "warning"
            });
        } else {
            const res = await CartShoppingService.searchOrderCartHistory(0,startDate,nameSearch,localStorage.getItem("authToken"));
            console.log(res.content)
            setTotalPages(res.totalPages);
            setListCart(res.content)
            setCurrentPage(0);
        }


    }



    return(
        <>
            <Sidebar/>
            <section className="home-section">
                <div className="container body_movie">
                    <h2 style={{paddingTop: "20px"}}>Quản lý đơn hàng</h2>
                    <div className="table-wrapper_movie">
                        <div className="table-title_movie">
                            <div className="row">
                                {/* Col 9 */}
                                <div className="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9" style={{height: "5.2rem"}}>



                                    <form className="form-group my-2 my-lg-0 p-0 m-0 ">
                                        <h5 style={{color: "white", paddingLeft: "15px"}}></h5>
                                        <div className="d-flex flex-wrap">
                                            <div className="col-12 d-flex">
                                                <div className="col-8">
                                                    <div className="d-flex">
                                                        <span style={{color:"white",margin:"1vh 3vh 0 0"}}>Ngày: </span>
                                                        <input id="dateInput2"
                                                               className="form-control mr-sm-2 w-100 mb-2" type="date"
                                                               style={{marginLeft: "-1rem"}}
                                                               onChange={(event => handleStartDate(event.target.value))}
                                                               name="startDate"
                                                               min={new Date().toISOString().split("T")[0]}
                                                        />
                                                        <input className="form-control mr-sm-2 w-100 mb-2" type="search"
                                                               placeholder="Thông tin khách hàng"
                                                               name="name"
                                                               aria-label="Search"
                                                               value={nameSearch || ''}
                                                               onChange={(event => handleNameSearch(event.target.value))}
                                                               id="name"/>

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-2">
                                                    <a className={"btn-che btn btn-toggle btn-lg "}
                                                       onClick={() => submitSearch()}
                                                    >Tìm kiếm
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </form>



                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table_movie">
                                <thead>
                                <tr>
                                    <th style={{width: "5%"}}>STT</th>
                                    <th style={{width: "10%"}}>Khách hàng</th>
                                    <th style={{width: "15%"}}>Ngày đặt</th>
                                    <th style={{width: "10%"}}>Trạng thái</th>
                                    <th style={{width: "10%"}}>Tổng tiền</th>
                                    <th style={{width: "10%"}}>Chi tiết</th>

                                </tr>
                                </thead>
                                <tbody>
                                { listCart.length !== 0 ? (
                                    listCart.map((item, index) => (


                                        <tr>
                                            <td style={{width: "5%"}} key={item.idCart}>{index + 1}</td>
                                            <td style={{width: "10%"}}>{item.fullName}</td>
                                            <td style={{width: "10%"}}>{formatLocalDateTime(item.orderDay)}</td>
                                            <td style={{width: "10%"}}>{item.statusCart === "paid" ? "Thành công" : "Chưa thanh toán"}</td>
                                            <td style={{width: "10%"}}>{formatNumber(item.totalPrice)}đ</td>
                                            <td style={{width: "10%"}}>
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
                                ) : (<tr>
                                    <td colSpan="7" className="text-danger h5">Không tìm thấy dữ liệu</td>
                                </tr>)
                                }
                                </tbody>
                            </table>
                            {
                                listCart.length !== 0 ? (<div>
                                    <div style={{float: "right"}} className="page">
                                        <ReactPaginate
                                            forcePage={currentPage}
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
                                </div>):""
                            }


                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}