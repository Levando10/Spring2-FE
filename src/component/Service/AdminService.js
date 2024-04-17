import axios from "axios";

const listProductManagement= async (pages,token) => {
        try {
            return (await axios.get(`http://localhost:8080/admin/managementProduct`, {
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

const searchProductManagement = async ( pages,nameSearch,token) => {
    try {
        return (await axios.get(`http://localhost:8080/admin/searchProduct`, {
            params: {
                page: pages,
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
export const AdminService = {
    listProductManagement,
    searchProductManagement,
}