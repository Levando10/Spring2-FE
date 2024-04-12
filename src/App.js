import './App.css';
import {Route, Routes} from "react-router-dom";
import Footer from "./component/Home/Footer";
import Header from "./component/Home/Header";
import CreateProduct from "./component/Product/CreateProduct";
import Home from "./component/Home/Home";
import DetailProduct from "./component/Product/DetailProduct";
import CartDetail from "./component/Cart/CartDetail";
import Login from "./component/Login/Login";
import PaymentSuccess from "./component/Cart/PaymentSuccess";
import HistoryBooking from "./component/Cart/HistoryBooking";
import {StompSessionProvider} from "react-stomp-hooks";
import ChildComponent from "./ChildComponent";
import ListProduct from "./component/Product/ListProduct";
import TestSwiper from "./component/Product/TestSwiper";
import InformationDetail from "./component/Login/InformationDetail";

function App() {
  return (
      <>
          {/*<StompSessionProvider url={'http://localhost:8080/ws-endpoint'}>*/}
          {/*    <ChildComponent />*/}
          {/*</StompSessionProvider>*/}

      {/*<AuthProvider >*/}
   <Routes>
       {/*<AppWrapper >*/}
        <Route path={"/footer"} element={<Footer />} />
        <Route path={"/header"} element={<Header />} />
        <Route path={""} element={<Home />} />
        <Route path={"/test"} element={<TestSwiper />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/detailProduct"} element={<DetailProduct />} />
        <Route path={"/listProduct"} element={<ListProduct />} />
        <Route path={"/historyBooking"} element={<HistoryBooking />} />
        <Route path={"/informationDetail"} element={<InformationDetail />} />
        <Route path={"/cartDetail"} element={<CartDetail />} />
        <Route path={"/createProduct"} element={<CreateProduct />} />
        <Route path={"/paymentOk/:id"} element={<PaymentSuccess />} />
    {/*</AppWrapper>*/}

   </Routes>
      {/*</AuthProvider>*/}
      </>
  );
}

export default App;
