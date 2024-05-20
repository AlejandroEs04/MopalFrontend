import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = createContext();

const AppProvider = ({children}) => {
    const [folio, setFolio] = useState();
    const [quantity, setQuantity] = useState(0);
    const [types, setTypes] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [products, setProducs] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [show, setShow] = useState(false)
    const [alerta, setAlerta] = useState(null)
    const [loading, setLoading] = useState(false)

    const [language, setLanguage] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleGetTypes = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/types`);
            setTypes(data.types)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetProducts = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/products`);
            setProducs(data.products)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetClassifications = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/classifications`);
            setClassifications(data.classifications)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSpecification = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/specifications`);
            setSpecifications(data.specifs)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddNewRequest = async(ProductFolio, UserID, Quantity) => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/request`, { 
                request : {
                    ProductFolio, 
                    UserID, 
                    Quantity
                }
            }, config)

            setAlerta({
                error : false, 
                msg : data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChangeQuantity = (quantity, currentStock) => {
        if(quantity > currentStock) {
            setAlerta({
                error : true, 
                msg : "La cantidad no puede superar al inventario actual", 
                msgEnglish : "The quantity cannot be greater that the current inventory"
            })

            setQuantity(currentStock)

            setTimeout(() => {
                setAlerta(null)
            }, 4000)
        } else {
            if(quantity < 0) {
                setQuantity(1)
                setAlerta({
                    error : true, 
                    msg : "La cantidad no puede ser menor a 0", 
                    msgEnglish : "The quantity cannot be less than 0"
                })
    
                setTimeout(() => {
                    setAlerta(null)
                }, 4000)
            } else {
                setAlerta(null)
                setQuantity(quantity)
            }
        }
    }

    useEffect(() => {
        handleGetTypes();
        handleGetClassifications();
        handleGetSpecification();
        handleGetProducts();
    }, [])

    return (
        <AppContext.Provider
            value={{
                types, 
                classifications, 
                products, 
                specifications, 
                handleGetProducts, 
                setProducs, 
                setLanguage, 
                language, 
                handleClose, 
                handleShow, 
                alerta, setAlerta, 
                show, 
                handleAddNewRequest, 
                setLoading, 
                loading, 
                folio, 
                setFolio, 
                quantity, 
                setQuantity, 
                handleChangeQuantity
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export {
    AppProvider
}

export default AppContext;