import axios from "axios";

const checkProductExistInCart = async (idProduct, idUser, token) => {
    let dataDTO = {
        idAccount:idUser,
        idProduct:idProduct,
        token: token
    }
    try {
        return (await axios.post(`http://localhost:8080/cart/addToCartHome`, dataDTO, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }))
    } catch (error) {
        console.log(error)
        throw error.response
    }
}
const decreaseProductInCart = async (idProduct, idUser, token) => {
    let dataDTO = {
        idAccount:idUser,
        idProduct:idProduct,
        token: token
    }
    try {
        return (await axios.post(`http://localhost:8080/cart/decreaseProductInCart`, dataDTO, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }))
    } catch (error) {
        console.log(error)
        throw error.response
    }
}
const deleteProductInCart = async (idUser,idProduct, token) => {

    try {
        return (await axios.delete(`http://localhost:8080/cart/`, {
            params: {
                idUser: idUser,
                idProduct:idProduct
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })).data
    } catch (error) {
        console.log(error)
        throw error.response
    }
}

const detailCartIndividual = async (idUser, token) => {

    try {
        return (await axios.get(`http://localhost:8080/cart/`, {
            params: {
                idUser: idUser
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })).data
    } catch (error) {
        console.log(error)
        throw error.response
    }
}

const qualityProductInCart = async (idUser, token) => {
    try {
        return (await axios.get(`http://localhost:8080/cart/qualityProductInCart`, {
            params: {
                idUser: idUser
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        })).data
    } catch (error) {

        throw error.response
    }
}
const historyCartDetail = async (idUser, token,pages) => {
    try {
        return (await axios.get(`http://localhost:8080/cart/historyCart`, {
            params: {
                idUser: idUser,
                page: pages

            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        })).data
    } catch (error) {

        throw error.response
    }
}
const managementHistoryCartByAdmin = async ( token,pages) => {
    try {
        return (await axios.get(`http://localhost:8080/admin/cart`, {
            params: {
                page: pages

            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        })).data
    } catch (error) {

        throw error.response
    }
}
const searchOrderCartHistory = async ( pages,startDate,nameSearch,token) => {
    try {
        return (await axios.get(`http://localhost:8080/admin/searchCart`, {
            params: {
                page: pages,
                searchDate:startDate,
                searchName:nameSearch,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        })).data
    } catch (error) {

        throw error.response
    }
}
const detailBooking = async (idCart,token) => {
    try {
        return (await axios.get(`http://localhost:8080/cart/detailCartItem`, {
            params: {
                idCart: idCart
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        })).data
    } catch (error) {

        throw error.response
    }
}


export const CartShoppingService = {
    checkProductExistInCart,
    qualityProductInCart,
    detailCartIndividual,
    deleteProductInCart,
    decreaseProductInCart,
    historyCartDetail,
    detailBooking,
    managementHistoryCartByAdmin,
    searchOrderCartHistory
}