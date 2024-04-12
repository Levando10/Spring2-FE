import Header from "../Home/Header";
import Footer from "../Home/Footer";
import {useEffect, useState} from "react";
import * as Yup from 'yup';
import SweetAlert from "sweetalert";
import {useLocation, useNavigate} from "react-router-dom";
import {ProductService} from "../Service/ProductService";
import {CartShoppingService} from "../Service/CartShoppingService";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {PaymentService} from "../Service/PaymentService";
import MySwal from "sweetalert2";

export default function CartDetail(){
    const navigate = useNavigate();
    const [isLogin,setIsLogin] = useState(true);
    const location = useLocation();
    const idAccount = localStorage.getItem("idAccount");
    const [listCart,setListCart] = useState([])
    const [totalPrice, setTotalPrice] = useState(0);
    const [role,setRole] = useState("USER")

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
    const handleViewHome = async () => {
        navigate("/")

    }


    const handleIncreaseQuantity = async (idProduct) => {
        const token = localStorage.getItem("authToken");
        await CartShoppingService.checkProductExistInCart(idProduct,idAccount,token);


        const req = await CartShoppingService.detailCartIndividual(idAccount,token);
        setListCart(req.dataRes)
        setTotalPrice(req.totalPrice)

    };

    const handleDecreaseQuantity = async (idProduct) => {
        const token = localStorage.getItem("authToken");
        await CartShoppingService.decreaseProductInCart(idProduct,idAccount,token);
        const req = await CartShoppingService.detailCartIndividual(idAccount,token);
        setListCart(req.dataRes)
        setTotalPrice(req.totalPrice)
    };


    const initValues = {
        fullName: "",
        email: "",
        phoneNumber: "",
        address:""
    }

    const validateObject = {
        fullName: Yup.string()
            .required("Họ Và Tên không được để rỗng")
            .min(6, "Họ và Tên từ 6 - 45 kí tự")
            .max(45, "Họ và Tên từ 6 - 45 kí tự")
            .matches(
                /^[A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:\s+[A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*\s*$/,
                "Họ Và Tên vui lòng nhập đúng định dạng"),
        phoneNumber: Yup.string().required("Số Điện Thoại không được để rỗng")
            .matches("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$",
                "Số điện thoại vui lòng nhập đúng định dạng"),
        email: Yup.string()
            .required("Email Không được để rỗng")
            .matches(/^[\w\-.]+@([\w\-]+\.)+[\w\-]{2,}$/, "Email vui lòng nhập đúng định dạng"),

        address: Yup.string().required("Địa chỉ không được để rỗng").max(100,"Địa chỉ không được quá 100 kí tự")
    }

    const paymentHandle = async (values, {setErrors}) => {
        const checkInfor = await SweetAlert({
            title: "Bạn có muốn dùng thông tin này để  thanh toán hay không?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });
        await checkInfor
        if (checkInfor){
            const token = localStorage.getItem("authToken");
            localStorage.setItem("emailPayment",values.email)
            localStorage.setItem("fullNamePayment",values.fullName)
            localStorage.setItem("totalPricePayment",totalPrice)
            localStorage.setItem("addressPay",values.address)

           try {
               const check = await  PaymentService.sendRequestPayment(values,token,idAccount,totalPrice)
               if (check.flag === "NOT"){

const listError = check.dataRes;
                   console.log(listError)
                   await MySwal.fire({
                       title: 'Số lượng kính trong cửa hàng không đủ',
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
          margin-right: 10px;
          max-width: 40px; 
          max-height: 40px;
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
      </div>
      ${listError.map((item, index) => `
        <div class="item-wrap" id="cart-page-result-${index}">
          <ul class="cart-wrap" data-line="${index}">
            <li class="item-info">
              <div>
                <img src="${item.imageProducts[0].urlImage}" alt="Product" />
              </div>
              <div class="item-title">
                ${item.quantity > 0 ? `Số lượng chỉ còn: ${item.quantity}` : "Sản phẩm đã hết!!!"}
              </div>
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


               } else {
                   window.location.href = check.dataRes;
               }

           } catch (error){
               console.log(error.data)
           }

        }

    }



 const handleDeleteProduct = async (idProduct) => {
     const willDelete = await SweetAlert({
         title: "Xóa sản phẩm không?",
         text: "Bạn có muốn xóa sản phẩm này ra khỏi giỏ hàng không?",
         icon: "warning",
         buttons: true,
         dangerMode: true,
     });
     await willDelete

     if (willDelete) {
         const token = localStorage.getItem("authToken")
        await CartShoppingService.deleteProductInCart(idAccount,idProduct,token );

         const req = await CartShoppingService.detailCartIndividual(idAccount,token);
         setListCart(req.dataRes)
         setTotalPrice(req.totalPrice)
         SweetAlert("Đã xóa!", "Sản phẩm đã được xóa khỏi giỏ hàng.", "success");
     } else {
         console.log('Hủy xóa sản phẩm');
     }

    }
    const handleViewProduct = async () => {
        navigate("/listProduct")
    }
    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin");
        if (isLogin !== null){

        } else {
            localStorage.setItem("notLogin","OK");
            navigate("/")
        }
        const token = localStorage.getItem("authToken");
        const fetchData = async (id,token) => {
            try {
                const req = await CartShoppingService.detailCartIndividual(id,token);
                setListCart(req.dataRes)
                console.log(req.dataRes)
                setTotalPrice(req.totalPrice)
            } catch (e){
                console.log(e)
            }
        };
        fetchData(idAccount,token);
        const role = localStorage.getItem("role")
        setRole(role);

        window.scrollTo(0, 0);

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
                                        <a className="nav-link" onClick={() => handleViewProduct()}>Sản phẩm</a>
                                    </li>
                                    {
                                        role === "ADMIN" ? (<li className="nav-item">
                                            <a className="nav-link">Quản lý</a>
                                        </li>) : ""
                                    }


                                </ul>

                                <div className="dropdown navbar-nav text-center ml-auto my-4">
                                    <a className="boxed-btn dropdown-toggle" type="button"
                                       data-toggle="dropdown" aria-expanded="false">
                                        {localStorage.getItem("nameAccount")}
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item">Thông tin cá nhân</a>
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
            <div className="cart-section mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <div className="cart-table-wrap">
                                <table className="cart-table">
                                    <thead className="cart-table-head">
                                    <tr className="table-head-row">
                                        <th className="product-remove"></th>
                                        <th className="product-image">Ảnh</th>
                                        <th className="product-name">Thông tin sản phẩm</th>
                                        <th className="product-price">Giá</th>
                                        <th className="product-quantity">Số lượng</th>
                                        <th className="product-total">Tổng cộng</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {listCart.length !== 0 ? listCart.map((item,index) => (
                                        <tr className="table-body-row">
                                            <td className="product-remove"><a onClick={() => handleDeleteProduct(`${item.idProduct}`)}><i className="far fa-window-close"></i></a></td>

                                            <td style={{width: "20%", height: "20%"}}><img
                                                src={item.imageMax}
                                                alt=""/></td>
                                            <td className="product-name">{item.nameProduct}</td>
                                            <td className="product-price">{formatCurrency(item.price)}</td>
                                            <td className="product-quantity">
                                                <button className={"btn-warning btn"} onClick={() => handleDecreaseQuantity(item.idProduct)}>-
                                                </button>
                                                <input type="number" value={item.quantity} placeholder="0"/>
                                                <button className={"btn btn-primary "} onClick={() => handleIncreaseQuantity(item.idProduct)}>+
                                                </button>
                                            </td>
                                            <td className="product-total">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    )) : <tr>
                                        <td colSpan={3}>
                                            <td className={"product-name"}>"Chưa có sản phẩm trong giỏ hàng"</td>
                                        </td>
                                    </tr>}

                                    </tbody>

                                </table>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="total-section">
                                <table className="total-table">
                                    <thead className="total-table-head">
                                    <tr className="table-total-row">
                                        <th colSpan={2} style={{textAlign: "center"}}>Tóm tắt đơn hàng</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="total-data">
                                        <td><strong>Tạm tính: </strong></td>
                                        <td>{formatCurrency(totalPrice)}</td>
                                    </tr>
                                    <tr className="total-data">
                                        <td><strong>Phí vận chuyển: </strong></td>
                                        <td>{totalPrice > 1000000 ? "0" : formatCurrency(45000)}</td>
                                    </tr>
                                    <tr className="total-data">
                                        <td><strong>Tổng: </strong></td>
                                        <td>{totalPrice > 1000000 ? formatCurrency(totalPrice) : formatCurrency(totalPrice + 45000)}</td>
                                    </tr>
                                    </tbody>
                                </table>

                                <Formik initialValues={initValues} validationSchema={Yup.object(validateObject)}
                                        onSubmit={(values, {setErrors}) => paymentHandle(values,{setErrors})}>

                                    {
                                        ({isSubmitting}) =>(
                                            <Form>
                                                <div className="cart-buttons">
                                                    <input type="submit" className="button" value="Thanh toán"/>
                                                </div>

                                                <div className={"row"}>
                                                    <div className="col-lg-8">
                                                        <div className="checkout-accordion-wrap">
                                                            <div className="accordion" id="accordionExample">
                                                                <div className="card single-accordion">
                                                                    <div className="card-header" id="headingOne">
                                                                        <h5 className="mb-0">
                                                                            <button className="btn btn-link"
                                                                                    type="button"
                                                                                    data-toggle="collapse"
                                                                                    data-target="#collapseOne"
                                                                                    aria-expanded="true"
                                                                                    aria-controls="collapseOne">
                                                                                Thông tin thanh toán
                                                                            </button>
                                                                        </h5>
                                                                    </div>

                                                                    <div id="collapseOne" className="collapse show"
                                                                         aria-labelledby="headingOne"
                                                                         data-parent="#accordionExample">
                                                                        <div className="card-body">
                                                                            <div className="billing-address-form">
                                                                                    <p><Field type="text" className="input input-group input-group-lg" name="fullName"
                                                                                              placeholder="Họ và tên"/>
                                                                                        <ErrorMessage name="fullName" component='span'
                                                                                                      className="form-err" style={{color: 'red'}}/>
                                                                                    </p>

                                                                                    <p> <Field id="email"  name="email" type="text" className="input input-group input-group-lg"  placeholder="Email"/>
                                                                                        <ErrorMessage name="email" component='span'
                                                                                                      className="form-err" style={{color: 'red'}}/>
                                                                                    </p>

                                                                                    <p>  <Field id="phoneNumber" name="phoneNumber"  type="text" className="input input-group"  placeholder="Số điện thoại"/>
                                                                                        <ErrorMessage name="phoneNumber" component='span'
                                                                                                      className="form-err" style={{color: 'red'}}/>
                                                                                    </p>
                                                                                    <p> <Field id="address" name="address"  type="text" className="input input-group input"  placeholder="Địa chỉ"/>
                                                                                        <ErrorMessage name="address" component='span'
                                                                                                      className="form-err" style={{color: 'red'}}/>
                                                                                    </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                            </Form>
                                        )

                                    }
                                </Formik>


                            </div>

                        </div>

                    </div>
                </div>
            </div>


            <Footer/>
        </>
    )
}