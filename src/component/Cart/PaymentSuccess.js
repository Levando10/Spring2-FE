import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import SweetAlert from "sweetalert";
import MySwal from "sweetalert2";
export default function PaymentSuccess(){
    const navigate = useNavigate();
    const {id} = useParams();
    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin");
        if (isLogin !== null){

        } else {
            localStorage.setItem("notLogin","OK");
            navigate("/")
        }

        const token = localStorage.getItem("authToken");


        const setPaymentOk = async () => {
            const emailPayment = localStorage.getItem("emailPayment");
            const fullNamePayment = localStorage.getItem("fullNamePayment");
            const totalPricePayment = localStorage.getItem("totalPricePayment");
            const idAccount = localStorage.getItem("idAccount");

           try {
               const searchParams = new URLSearchParams(window.location.search);
               const status = searchParams.get('vnp_TransactionStatus');
               const data = (await axios.get(`http://localhost:8080/payment/payment_infor`, {
                   params: {
                       status: status,
                       idAccount: idAccount,
                       email: emailPayment,
                       fullName: fullNamePayment,
                       totalPrice: totalPricePayment,
                       address: localStorage.getItem("addressPay"),
                   },
                   headers: {
                       Authorization: `Bearer ${token}`
                   }
               })).data;

               if (data.flag === "NOT"){

                   const listError = data.dataRes;
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
                   window.location.href = "http://localhost:3000/cartDetail"

               } else if (data === "OK"){
                   console.log("zo day ne okok")
                   localStorage.setItem("paymentSuccess","OK")
                   window.location.href = "http://localhost:3000/"
               }

               console.log(data)
               if (data === "NO"){
                   await SweetAlert(
                       "Sản phẩm  thanh toán thất bại",
                       ``,
                       "warning"
                   );
                   window.location.href = "http://localhost:3000/cartDetail"

               }

           } catch (error){
               console.log(error)
           }

        }

        setPaymentOk();



    }, []);

}