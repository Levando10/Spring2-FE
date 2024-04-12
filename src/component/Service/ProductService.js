import axios from "axios";

const listProduct= async (page) => {

    const result = axios.get(`http://localhost:8080/product?page=${page}`);
    return(await  result).data
}

const listProductFull= async (page) => {

    const result = axios.get(`http://localhost:8080/product/listFull?page=${page}`);
    return(await  result).data
}

const detailProduct= async (idProduct) => {

    const result = axios.get(`http://localhost:8080/product`,{params:{
        idProduct:idProduct
        }});
    return(await  result).data
}
const searchProductCan= async (currentPage,searchCan,searchMat,searchGucci,searchDior) => {
    // console.log(searchCan)
    // console.log(searchMat)
    // console.log(searchGucci)
    // console.log(searchDior)


    const result = axios.get(`http://localhost:8080/product/search`,{params:{
            page: currentPage,
            canSearch: searchCan,
            searchMat:searchMat,
            searchGucci:searchGucci,
            searchDior:searchDior
        }
        });
    return(await  result).data
}

const findProductById = async (idProduct) => {
    try {
       return (await axios.get(`http://localhost:8080/product/`, {
           params: {
               idProduct: idProduct
           }
       })).data;
    } catch (error){
        throw error.response
    }
}


export const ProductService = {
    listProduct,
    findProductById,
    searchProductCan,
    listProductFull,

}