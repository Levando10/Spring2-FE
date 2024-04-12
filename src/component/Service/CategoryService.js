import axios from "axios";

const listCategory = async () => {
       const result = axios.get(`http://localhost:8080/category`);
    return(await  result).data

}
export const CategoryService = {
    listCategory,

}