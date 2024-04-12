import axios from "axios";

const loginAccount = async (value) => {
    try {
        return (await axios.post(`http://localhost:8080/account/login`, value)).data;
    }
    catch (error){
        throw error.response
    }
}
const informationUser = async (value,token) => {

       try {
           return (await axios.get(`http://localhost:8080/account/information/${value}`, {
               headers: {
                   Authorization: `Bearer ${token}`
               }
           })).data;
       } catch (e){
           console.log(e)

       }


}
const changePassword = async (value,token) => {
    try {
        return await axios.post(`http://localhost:8080/account/changPassword`, value,{ headers: {
                Authorization: `Bearer ${token}`
            }});
    }
    catch (error){
        console.log("loi ser")
        throw error.response
    }
}
export  const LoginService = {
    loginAccount,
    changePassword,
    informationUser,
}