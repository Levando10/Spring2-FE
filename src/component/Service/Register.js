import axios from "axios";

const registerAccount = async (value) => {
    try {
        return await axios.post(`http://localhost:8080/account/register`,value);
    }
    catch (error){
    throw error.response
    }
}
export  const Register = {
    registerAccount
}