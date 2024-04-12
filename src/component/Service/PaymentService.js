import axios from "axios";

const sendRequestPayment = async (values,token,idAccount,totalPrice) => {


    try {

        return (await axios.post(`http://localhost:8080/payment/createPay`, {
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            address: localStorage.getItem("addressPay"),
            idAccount: idAccount,
            totalPayment:totalPrice
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })).data;
    } catch (error){
        throw error.response
    }
}
export const PaymentService = {
    sendRequestPayment,
}