import "./infor.css"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {CartShoppingService} from "../Service/CartShoppingService";
import SweetAlert from "sweetalert";
import Footer from "../Home/Footer";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {LoginService} from "../Service/LoginService";
export default function InformationDetail(){
    const navigate = useNavigate();
    const [role,setRole] = useState("USER")
    const [error, setError] = useState("");


    const [isLogin,setIsLogin] = useState(false);

    const [qualityProduct,setQualityProduct] = useState(0);
    const handleViewCart = async () => {
        const idAccount = localStorage.getItem("idAccount")

        navigate("/cartDetail",{state:{
                idAccount:idAccount
            }})

    }
    const informationDetail = async () => {
        navigate("/informationDetail")
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
    const handleViewProduct = async () => {
        navigate("/listProduct")
    }

    useEffect(() => {
        document.title = 'Thông tin chi tiết';
        const isLogin = localStorage.getItem("isLogin");
        const role = localStorage.getItem("role")
        setRole(role);


        if (isLogin !== null){
            const token = localStorage.getItem("authToken");
            const idUser = localStorage.getItem("idAccount");
            const getUser = async () => {
               try {
                   const  dataUser =  await LoginService.informationUser(idUser,token);
                   localStorage.setItem("fullName",dataUser.fullName)
                   localStorage.setItem("email",dataUser.email)
                   localStorage.setItem("phoneNumber",dataUser.phoneNumber)
                   localStorage.setItem("address",dataUser.address)
                   console.log(dataUser)
               } catch (e){
                   console.log(e)
               }

            }
            getUser();

            const qualityCart = async () => {
                try {

                    const qualityProductCart = await CartShoppingService.qualityProductInCart(idUser,token);
                    setQualityProduct(qualityProductCart)
                } catch (e){
                    console.log(e)
                }
            }
            qualityCart();


        } else {
            localStorage.setItem("notLogin","OK");
            navigate("/")
        }
    }, []);



    const initValues = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    const validateObject = {
        currentPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại').min(6,"Nhập nhiều hơn 6 kí tự"),
        newPassword: Yup.string().required('Vui lòng nhập mật khẩu mới').min(6,"Nhập nhiều hơn 6 kí tự"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp')
            .required('Vui lòng nhập lại mật khẩu').min(6,"Nhập nhiều hơn 6 kí tự")
    };
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const changPasswordAccount = async (values, {setErrors }) => {
       let value ={
           ...values,
           idAccount:localStorage.getItem("idAccount")
       }

    try {
        const req = await LoginService.changePassword(value,localStorage.getItem("authToken"));



        localStorage.setItem('authToken', req.data.token);
        localStorage.setItem('idAccount', req.data.dataRes.id);
        localStorage.setItem("isLogin",true);
        localStorage.setItem("nameAccount",req.data.dataRes.nameAccount);
        localStorage.setItem("role",req.data.dataRes.role.name)

        await SweetAlert(
            "Đổi mật khẩu thành công!",
            ``,
            "success"
        );

    } catch (err){
        console.log("alo loi r")
        setErrors(err.data)
        await SweetAlert(
            "Đổi mật khẩu thất bại!",
            `Vui lòng nhập lại thông tin!`,
            "error"
        );
    }

    }
    return(
        <>
            <div style={{marginTop:"8em"}}>
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

            <div className="container light-style flex-grow-1 container-p-y">

                <h4 className="font-weight-bold py-3 mb-4">
                    Cài đặt tài khoản
                </h4>

                <div className="card overflow-hidden">
                    <div className="row no-gutters row-bordered row-border-light">
                        <div className="col-md-3 pt-0">
                            <div className="list-group list-group-flush account-settings-links">
                                <a className="list-group-item list-group-item-action active" data-toggle="list"
                                   href="#account-general">Thông tin cá nhân</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account-change-password">Mật khẩu</a>

                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="account-general">


                                    <hr className="border-light m-0"/>

                                    <div className="card-body">
                                        <div className="form-group">
                                            <label className="form-label">Tài khoản</label>
                                            <input disabled={true}  type="text" className="form-control mb-1" value={localStorage.getItem("nameAccount")}/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Họ và tên</label>
                                            <input disabled={true}  type="text" className="form-control" value={localStorage.getItem("fullName")}/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input disabled={true}  type="text" className="form-control" value={localStorage.getItem("email")}/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Số điện thoại</label>
                                            <input  disabled={true}  type="text" className="form-control" value={localStorage.getItem("phoneNumber")}/>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Địa chỉ</label>
                                            <input disabled={true} type="text" className="form-control" value={localStorage.getItem("address")}/>
                                        </div>
                                    </div>

                                </div>
                                <div className="tab-pane fade" id="account-change-password">
                                    <div className="card-body pb-2">

                                        <Formik initialValues={initValues} validationSchema={Yup.object(validateObject)}
                                                onSubmit={(values, {setErrors})  => changPasswordAccount(values,{setErrors})} >
                                            {
                                                ({isSubmitting}) =>(
                                                    <Form>

                                                        <div className="form-group">
                                                            <label className="form-label">Mật khẩu hiện tại</label>
                                                            <Field type={showPassword ? "text" : "password"}
                                                                   name="currentPassword" className="form-control"/>
                                                        </div>
                                                        <div className={"group"}>
                                                            <ErrorMessage name="currentPassword" component='span'
                                                                          className="form-err" style={{color: 'red'}}/>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Mật khẩu mới</label>
                                                            <Field type={showPassword ? "text" : "password"}
                                                                   name="newPassword"
                                                                   className="form-control"/>
                                                        </div>
                                                        <div className={"group"}>
                                                            <ErrorMessage name="newPassword" component='span'
                                                                          className="form-err" style={{color: 'red'}}/>
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Nhập lại mật khẩu</label>
                                                            <Field type={showPassword ? "text" : "password"}
                                                                   name="confirmPassword" className="form-control"/>
                                                        </div>
                                                        <div className={"group"}>
                                                            <ErrorMessage name="confirmPassword" component='span'
                                                                          className="form-err" style={{color: 'red'}}/>
                                                        </div>
                                                        <div className={"group"}>
                                                            <span style={{color: "red", fontSize: "1em"}}>{error}</span>
                                                        </div>
                                                        <div className={"group"}>
                                                            <a className={"boxed-btn btn"} type="button"
                                                               onClick={togglePasswordVisibility}>
                                                                {showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                                                            </a>
                                                        </div>
                                                        <div className="group">
                                                            <input type="submit" className="boxed-btn "
                                                                   value="Thay đổi"/>
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
                </div>


            </div>
            <div style={{marginTop:"4em"}}></div>
            < Footer />

        </>
    )
}