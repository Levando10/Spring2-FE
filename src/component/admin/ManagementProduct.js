import {Sidebar} from "./Sidebar";
import ReactPaginate from "react-paginate";
import {useEffect, useState} from "react";
import MySwal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {ProductService} from "../Service/ProductService";
import {AdminService} from "../Service/AdminService";
import SweetAlert from "sweetalert";
import {CartShoppingService} from "../Service/CartShoppingService";

export default function ManagementProduct(){
    const [nameSearch, setNameSearch] = useState('');
    const [listProduct,setListProduct] = useState([])
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
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
            const res = await AdminService.searchProductManagement(0,nameSearch,localStorage.getItem("authToken"));
            console.log(res.content)
            setTotalPages(res.totalPages);
            setListProduct(res.content)
            setCurrentPage(0);
    }

    const handlePageClick = async (event) => {
        try {
            const token = localStorage.getItem("authToken");
            const pageNumber = event.selected;
            setCurrentPage(pageNumber);
            let res = await AdminService.listProductManagement(pageNumber,token);
            if (nameSearch !== ""){
                res = await AdminService.searchProductManagement(pageNumber,nameSearch,token);
            }

            setListProduct(res.content)
            setTotalPages(res.totalPages)
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
            document.title = 'Quản lý sản phẩm';
            const token = localStorage.getItem("authToken");
        const fetchData = async () => {
            try {
                const listData = await AdminService.listProductManagement(0,token);
                console.log(listData.content)
                setListProduct(listData.content);
                setTotalPages(listData.totalPages);
            } catch (e){
                console.log(e)
            }
        };
        fetchData();


    }, []);
    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const handleEditProduct = async (idProduct) => {
        try {
            const data = await ProductService.findProductById(idProduct);
            console.log(data)
            navigate(`/editProduct/${idProduct}`)
        } catch (err){
            if (err.data === "BAD_REQUEST"){
                await SweetAlert(
                    "Sản phẩm không tồn tại",
                    `Vui lòng chọn sản phẩm khác!`,
                    "error"
                );
            }
            const listData = await ProductService.listProduct(0);
            setListProduct(listData.content);
            setTotalPages(listData.totalPages);
        }
    }
    const handleDeleteProduct = async (idProduct) => {
     alert(idProduct)
    }

    return(
        <>
            <Sidebar/>
            <section className="home-section">
                <div className="container body_movie">
                    <h2 style={{paddingTop: "20px"}}>Danh sách sản phẩm</h2>
                    <div className="table-wrapper_movie">
                        <div className="table-title_movie">
                            <div className="row">
                                {/* Col 9 */}
                                <div className="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9" style={{height: "5.2rem"}}>


                                    <div className="form-group my-2 my-lg-0 p-0 m-0 ">
                                        <h5 style={{color: "white", paddingLeft: "15px"}}></h5>
                                        <div className="d-flex flex-wrap">
                                            <div className="col-12 d-flex">
                                                <div className="col-5">
                                                    <div className="d-flex">
                                                        <input className="form-control mr-sm-2 w-100 mb-2" type="search"
                                                               placeholder="Thông tin sản phẩm"
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
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table_movie">
                                <thead>
                                <tr>
                                    <th style={{width: "8%"}}>STT</th>
                                    <th style={{width: "8%"}}></th>
                                    <th style={{width: "17%"}}>Mã sản phẩm</th>
                                    <th style={{width: "15%"}}>Hãng</th>
                                    <th style={{width: "13%"}}>Số lượng</th>
                                    <th style={{width: "15%"}}>Giá</th>
                                    <th colSpan={2} style={{width: "2%"}}>Chức năng</th>


                                </tr>
                                </thead>
                                <tbody>
                                {listProduct.length !== 0 ? (
                                    listProduct.map((item, index) => (
                                        <tr>
                                            <td style={{width: "5%"}} key={item.idProduct}>{index + 1}</td>
                                            <td style={{width: "10%", height: "10%"}}><img
                                                src={item.imageMax}
                                                alt=""/></td>
                                            <td style={{width: "10%"}}>{item.nameProduct}</td>
                                            <td style={{width: "5%"}}>{item.nameFac}</td>
                                            <td style={{width: "5%"}}>{item.quantity}</td>
                                            <td style={{width: "7%"}}>{formatCurrency(item.price)} đ</td>
                                            <td style={{width: "2%"}}> <a className={"boxed-btn"}
                                                onClick={() => handleEditProduct(`${item.idProduct}`)}>

                                                Sửa </a></td>
                                            <td ><a className={"boxed-btn"}
                                                onClick={() => handleDeleteProduct(`${item.idProduct}`)}>

                                                Xóa</a></td>


                                        </tr>
                                    ))
                                ) : (<tr>
                                <td colSpan="7" className="text-danger h5">Không tìm thấy dữ liệu</td>
                                </tr>)
                                }
                                </tbody>
                            </table>
                            {
                                listProduct.length !== 0 ? (<div>
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
                                </div>) : ""
                            }


                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}