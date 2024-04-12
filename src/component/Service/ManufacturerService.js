import axios from "axios";

const listManufacturer = async () => {
    const result = axios.get(`http://localhost:8080/manufacturer`);
    return(await  result).data

}
export const ManufacturerService = {
    listManufacturer,

}