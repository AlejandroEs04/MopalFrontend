import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const AppContext = createContext();

const AppProvider = ({children}) => {
    const [folio, setFolio] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [requestProducts, setRequestProducts] = useState([]);
    const [types, setTypes] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [show, setShow] = useState(false)
    const [showCanva, setShowCanva] = useState(false)
    const [alerta, setAlerta] = useState(null)
    const [loading, setLoading] = useState(false)

    const [assemblyCount, setAssemblyCount] = useState(0)

    const [language, setLanguage] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseCanva = () => setShowCanva(false)
    const handleShowCanva = () => setShowCanva(true)

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
            setProducts(data.products)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetProductsList = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/productsList`);
            setProductsList(data.productLists)
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

    const handleAddNewRequest = async(UserID, products) => {
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
                    UserID, 
                    products
                }
            }, config)

            setAlerta({
                error : false, 
                msg : data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)

            setRequestProducts([])
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
                msg : "La cantidad es mayor al stock actual, esto puede causar tiempos de entrega elevados", 
                msgEnglish : "The quantity is greater than the current stock, this may cause long delivery times"
            })

            setQuantity(quantity)

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

    const handleAddProduct = (array, folio, quantity = 1, assembly = '', assemblyGroup = null) => {
        // Copiar arreglo
        let productsArray = array

        // Obtener el producto
        const product = products.filter(product => product.Folio === folio)[0]

        // Identificar si se crea un grupo
        let AssemblyGroup = assemblyGroup

        if(assembly) {
            if(!assemblyGroup) {
                AssemblyGroup = +assemblyCount + 1

                const productsNew = productsArray.map(product => {
                    if(product.ProductFolio === assembly && !product.AssemblyGroup) {
                        product.AssemblyGroup = AssemblyGroup
                    }
                    return product
                })
                
                setAssemblyCount(AssemblyGroup)

                productsArray = productsNew;
            }
        }

        // Crear producto
        const newProduct = {
            ProductFolio : folio, 
            Folio : folio, 
            Name : product.Name, 
            PricePerUnit : +product.ListPrice,
            Percentage : 100,
            Quantity : +quantity, 
            Stock : +product.StockAvaible,
            Accesories : product.accessories, 
            Assembly : assembly, 
            AssemblyGroup, 
            Observations : ''
        }

        const existArray = productsArray.filter(product => product.ProductFolio === folio && product.AssemblyGroup === assemblyGroup)
        

        if(existArray.length === 0) {
            return [
                ...productsArray, 
                newProduct
            ]
        } else {
            const newArray = productsArray.map(product => product.ProductFolio === folio ? newProduct : product)
            return newArray
        }
    }

    useEffect(() => {
        handleGetTypes();
        handleGetClassifications();
        handleGetSpecification();
        handleGetProducts();
        handleGetProductsList();

        socket.on('saleUpdate', response => {
            handleGetProducts()
        })

        socket.on('productsUpdate', response => {
            handleGetProducts()
        })

        socket.on('purchaseUpdate', response => {
            handleGetProducts()
        })

        socket.on('requestUpdate', response => {
            handleGetProducts()
        })
    }, [])

    return (
        <AppContext.Provider
            value={{
                types, 
                classifications, 
                products, 
                productsList,
                specifications, 
                handleGetProducts, 
                setProducts, 
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
                handleChangeQuantity, 
                handleCloseCanva, 
                handleShowCanva, 
                showCanva, 
                requestProducts, 
                setRequestProducts, 
                handleAddProduct
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