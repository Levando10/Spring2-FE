import "../Login/login.css"
import Cookies from 'js-cookie';
import Header from "../Home/Header";
import Footer from "../Home/Footer";
import * as Yup from 'yup';
import {ErrorMessage, Field, Form, Formik} from "formik";
import SweetAlert from "sweetalert";
import {useEffect, useState} from "react";
import {Register} from "../Service/Register";
import {LoginService} from "../Service/LoginService";
import {useNavigate} from "react-router-dom";
export default function Login(){
    // const [status, setStatus] = useState(true);
    // const handleGetRegister = () => {
    //     setStatus(false);
    // };
    // const handleGetLogin = () => {
    //     setStatus(true);
    // };
    const [isLogin,setIsLogin] = useState(false);
    const [paramAccount, setParamAccount] = useState("");
    const [paramPassword, setParamPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleParamAccountChange = (e) => {
      setParamAccount(e.target.value)

    };
    const handleParamPasswordChange = (e) => {
      setParamPassword(e.target.value)

    };
    const handleLogin = async () => {

    try {

        if (paramPassword === "" || paramAccount === "") {
            setError("Tên đăng nhập và mật khẩu không được để trống!");
            setParamPassword("")
            setParamAccount("")
        } else {
            let params = {
                nameAccount: paramAccount,
                password: paramPassword
            }
            const req = await LoginService.loginAccount(params)
            console.log(req)
            localStorage.setItem('authToken', req.token);
            localStorage.setItem('idAccount', req.dataRes.id);
            localStorage.setItem("isLogin",true);
            localStorage.setItem("nameAccount",req.dataRes.nameAccount);
            localStorage.setItem("role",req.dataRes.role.name)

            localStorage.setItem("fullName",req.dataRes.fullName)
            localStorage.setItem("email",req.dataRes.email)
            localStorage.setItem("phoneNumber",req.dataRes.phoneNumber)
            localStorage.setItem("address",req.dataRes.address)

            // Cookies.set('Token', req.token, { expires: 7 * 1000 * 60 ,httpOnly:true, secure: true, sameSite: 'strict' });

            SweetAlert("Đăng nhập thành công!", `Chào mừng ${localStorage.getItem("nameAccount")} đến với hệ thống!`, "success")
            navigate('/');
        }
    }   catch (err) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác!");

    }
    }

    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin");
        window.scrollTo(0, 0);
    }, []);

    const registerAccount = async (values, {setErrors}) => {
        try {
            const result = await Register.registerAccount(values);
            let params = {
                nameAccount: result.data.nameAccount,
                password: values.password
            }

            const req = await LoginService.loginAccount(params)

            localStorage.setItem('authToken', req.token);
            localStorage.setItem('idAccount', req.dataRes.id);
            localStorage.setItem("isLogin",true);
            localStorage.setItem("nameAccount",req.dataRes.nameAccount);
            localStorage.setItem("role",req.dataRes.role.name)

            await SweetAlert(
                "Đăng kí thành công!",
                `Xin mời bạn đăng nhập để vào hệ thống!`,
                "success"
            );
            navigate('/')


        } catch (err) {
            setErrors(err.data)
            await SweetAlert(
                "Đăng kí thất bại!",
                `Vui lòng nhập lại thông tin!`,
                "error"
            );
        }

    }

    const initValues = {
        nameAccount: "",
        fullName: "",
        password: "",
        email: "",
        phoneNumber: "",
        address:""
    }

    const validateObject = {
        nameAccount: Yup.string().required("Tài Khoản không được để trống").min(6, "Tài Khoản từ 6 - 20 kí tự").max(20, "Tài Khoản từ 6 - 20 kí tự").matches("^[a-z0-9_-]+$", "Tài Khoản Vui Lòng Nhập Đúng Định Dạng"),
        fullName: Yup.string()
            .required("Họ Và Tên không được để rỗng")
            .min(6, "Họ và Tên từ 6 - 45 kí tự")
            .max(45, "Họ và Tên từ 6 - 45 kí tự")
            .matches(
                /^[A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:\s+[A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*\s*$/,
                "Họ Và Tên vui lòng nhập đúng định dạng"),
        password: Yup.string().required("Mật Khẩu không được để rỗng")
            .min(6, "Mật Khẩu độ dài từ 6-20 kí tự")
            .max(20, "Mật Khẩu độ dài từ 6-20 kí tự"),
        phoneNumber: Yup.string().required("Số Điện Thoại không được để rỗng")
            .matches("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$", "Số điện thoại vui lòng nhập đúng định dạng"),
        email: Yup.string()
            .required("Email Không được để rỗng")
            .matches(/^[\w\-.]+@([\w\-]+\.)+[\w\-]{2,}$/, "Email vui lòng nhập đúng định dạng"),
        address: Yup.string().required("Địa chỉ không được để rỗng").max(100,"Địa chỉ không được quá 100 kí tự")
    }


    return(
        <>
            <Header/>
            <div style={{marginTop:"20vh"}}></div>
            <div className="login-wrap mt-5">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" checked/><label htmlFor="tab-1"
                                                                                                  className="tab">Đăng nhập
                    </label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up"/><label htmlFor="tab-2"
                                                                                          className="tab"> Đăng ký</label>
                    <div className="login-form">
                        <div className="sign-in-htm">
                            <div className="group">
                                <label htmlFor="user" className="label">Tài khoản</label>
                                <input id="user" onChange={handleParamAccountChange} type="text" className="input"/>
                            </div>
                            <div className="group">
                                <label htmlFor="pass" className="label">Mật khẩu</label>
                                <input id="pass" onChange={handleParamPasswordChange} type="password" className="input"
                                       data-type="password"/>
                            </div>


                            <div className="group">
                                <input type="submit" className="button" onClick={handleLogin} value="Đăng nhập"/>
                            </div>
                            <div className={"group"}>
                                <span style={{color: "red", fontSize: "1em"}}>{error}</span>
                            </div>
                            <div className="hr"></div>
                            <div className="foot-lnk">
                                <a href="#forgot">Quên mật khẩu?</a>
                            </div>
                        </div>

                        <Formik initialValues={initValues} validationSchema={Yup.object(validateObject)}
                                onSubmit={(values, {setErrors}) => registerAccount(values,{setErrors})}>
                            {
                                ({isSubmitting}) =>(
                                    <Form>
                                        <div className="sign-up-htm">
                                            <div className="group">
                                                <label htmlFor="nameAccount" className="label">Tài khoản</label>
                                                <Field id="nameAccount" type="text" name="nameAccount"
                                                       placeholder="Ex: example123456" className="input"/>
                                            </div>
                                            <div className={"group"}>
                                                <ErrorMessage name="nameAccount" component='span'
                                                              className="form-err" style={{color: 'red'}}/>
                                            </div>

                                            <div className="group">
                                                <label htmlFor="fullName" className="label">Họ và tên</label>
                                                <Field id="fullName" type="text" name="fullName"
                                                       placeholder="Ex: Nguyễn Văn A" className="input"/>
                                            </div>
                                            <div className={"group"}>
                                                <ErrorMessage name="fullName" component='span'
                                                              className="form-err" style={{color: 'red'}}/>
                                            </div>
                                            <div className="group">
                                                <label htmlFor="password" className="label">Mật khẩu</label>
                                                <Field id="password" type="password" className="input"
                                                       name={"password"}/>
                                            </div>
                                            <div className={"group"}>
                                                <ErrorMessage name="password" component='span'
                                                              className="form-err" style={{color: 'red'}}/>
                                            </div>

                                            <div className="group">
                                                <label htmlFor="email" className="label">Email</label>
                                                <Field id="email"  name="email" type="text" className="input"/>
                                            </div>
                                            <div className={"group"}>
                                                <ErrorMessage name="email" component='span'
                                                              className="form-err" style={{color: 'red'}}/>
                                            </div>

                                            <div className="group">
                                                <label htmlFor="phoneNumber" className="label">Số điện thoại</label>
                                                <Field id="phoneNumber" name="phoneNumber"  type="text" className="input"/>
                                            </div>
                                            <div className={"group"}>
                                                <ErrorMessage name="phoneNumber" component='span'
                                                              className="form-err" style={{color: 'red'}}/>
                                            </div>
                                            <div className="group">
                                                <label htmlFor="address" className="label">Địa chỉ</label>
                                                <Field id="address" name="address"  type="text" className="input"/>
                                            </div>
                                            <div className={"group"}>
                                                <ErrorMessage name="address" component='span'
                                                              className="form-err" style={{color: 'red'}}/>
                                            </div>

                                            <div className="group">
                                                <input type="submit" className="button" value="Đăng ký"/>
                                            </div>
                                            <div className="hr"></div>

                                        </div>

                                    </Form>
                                )
                            }

                        </Formik>
                    </div>
                </div>
            </div>

            <div style={{marginTop: "42vh"}}></div>
            <Footer/>
        </>
    )
}