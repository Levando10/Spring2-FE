import {useNavigate, useParams} from "react-router-dom";
import {Sidebar} from "../Sidebar";

export default function EditProduct(){
    const param = useParams();
    const navigate = useNavigate();
    const { id } = param;
    return(
        <>
            <Sidebar />
            {alert(id)}
        </>
    )
}