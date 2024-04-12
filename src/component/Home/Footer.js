export default  function Footer() {
return(
    <>

        <div className="footer-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-box about-widget">
                            <h2 className="widget-title">Về chúng tôi</h2>
                            <p>Tại CGGLASSES, chúng tôi không chỉ bán kính mắt - chúng tôi mang đến vẻ đẹp và sự
                                thoải mái cho tầm nhìn của bạn.
                                Mỗi sản phẩm của chúng tôi đều trải qua quy trình
                                kiểm định nghiêm ngặt để đảm bảo phong cách đồng thời không làm mất đi tính thực
                                dụng và độ bền.</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-box get-in-touch">
                            <h2 className="widget-title">Liên lạc</h2>
                            <ul>
                                <li>295 Nguyễn Tất Thành, Thanh Bình, Hải Châu, Đà Nẵng.</li>
                                <li>dolevan055@gmail.com</li>
                                <li>0982009465</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-box pages">
                            <h2 className="widget-title">Trang</h2>
                            <ul>
                                <li><a href="#">Về chúng tôi</a></li>
                                <li><a href="#">Sản phẩm</a></li>
                                <li><a href="contact.html">Liên lạc</a></li>
                            </ul>
                        </div>
                    </div>


                </div>
            </div>
        </div>


        <div className="copyright">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <p>Bản quyền &copy; 2020 - <a href="#">CGGLASSES</a>, Đã đăng ký.<br/>
                            Phân phối bởi- <a href="#">DoLV</a>
                        </p>
                    </div>
                    <div className="col-lg-6 text-right col-md-12">
                        <div className="social-icons">
                            <ul>
                                <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                                <li><a href="#" target="_blank"><i className="fab fa-twitter"></i></a></li>
                                <li><a href="#" target="_blank"><i className="fab fa-instagram"></i></a></li>
                                <li><a href="#" target="_blank"><i className="fab fa-linkedin"></i></a></li>
                                <li><a href="#" target="_blank"><i className="fab fa-dribbble"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </>
)

}