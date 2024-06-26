
import {storage} from "../FireBase/firebaseConfig";
import { useState, useEffect } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { v4 } from "uuid";

export default  function CreateProduct(){
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    const imagesListRef = ref(storage, "images/");
    const uploadFile = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        });
    };

    useEffect(() => {
        const fetchImages = async () => {
            const response = await listAll(imagesListRef);
            const urls = await Promise.all(response.items.map((item) => getDownloadURL(item)));
            setImageUrls(urls);
        };

        fetchImages();
    }, []);

    return (
        <>
            <div className="App">
                <input
                    type="file"
                    onChange={(event) => {
                        setImageUpload(event.target.files[0]);
                    }}
                />
                <button onClick={uploadFile}> Upload Image</button>
                {imageUrls.map((url, index) => {
                    {
                        console.log(url)}
                    return <img key={index} src={url}/>;
                })}
            </div>

        </>
    )

}