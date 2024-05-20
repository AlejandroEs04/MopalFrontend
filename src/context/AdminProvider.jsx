import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const AdminContext = createContext();

const AdminProvider = ({children}) => {
    const [alerta, setAlerta] = useState(null)
    const [loading, setLoading] = useState(false)

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [request, setRequest] = useState([]);
    const [requestNew, setRequestNew] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [sales, setSales] = useState([]);

    const handleGetUsers = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/users`, config);
            setUsers(data.users)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetRequest = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/request`, config);
            setRequest(data.request)
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

    const handleGetRoles = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/roles`, config);
            setRoles(data.roles)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetPurchase = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/purchases`, config);
            setPurchases(data.purchases.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSales = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/sales`, config);
            setSales(data.sales)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetCustomers = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/customers`, config);
            setCustomers(data.customers)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSuppliers = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/suppliers`, config);
            setSuppliers(data.suppliers)
        } catch (error) {
            console.log(error)
        }
    }

    const handleBuildBuyEmail = async(buy) => {

    }

    const savePurchase = async(purchase) => {
        setLoading(true)
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        if(purchase.Folio === "") {
            try {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase : purchase }, config);
                setAlerta({
                  error: false, 
                  msg : data.msg
                })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase : purchase }, config);
                setAlerta({
                  error: false, 
                  msg : data.msg
                })
            } catch (error) {
                setAlerta({
                    error: true, 
                    msg: error.response.data.msg
                })
            } finally {
                setLoading(false)
            }
        } 
    }

    const handleToggleSaleStatus = async(folio, status, pathname = null) => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales/${folio}`, { status }, config);

            setAlerta({
                error: false, 
                msg : data.msg
            })
        } catch (error) {
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })
        }
    }

    const saveProduct = async() => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }
    }

    const handleChangeQuantityProduct = (productos, Quantity, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Quantity = +Quantity;
            }
    
            return producto
        })
        return newArray
    }
    
    const handleChangeDiscountProduct = (productos, Discount, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Discount = +Discount;
            }
    
            return producto
        })
        return newArray
    }

    const handleAddProductArray = (products, productsArray, productID) => {
        if(productID) {
          const productNew = products.filter(producto => producto.Folio === productID);
    
          const existArray = productsArray.filter(producto => producto.Folio === productID)
    
          if(existArray.length === 0) {
            return [
                ...productsArray, 
                {
                    ...productNew[0], 
                    Quantity : 1, 
                    Discount : null
                }
            ]
          }
        }
    }

    useEffect(() => {
        handleGetUsers();
        handleGetSuppliers();
        handleGetPurchase();
        handleGetCustomers();
        handleGetSales();
        handleGetRoles();
        handleGetSpecification();
        handleBuildBuyEmail();
        handleGetRequest();

        socket.on('purchaseCreated', response => {
            if(response.update) {
                handleGetPurchase()
            }
        })

        socket.on('requestCreated', response => {
            setRequestNew(response.request)
        })

        socket.on('requestAccepted', response => {
            handleGetRequest()
        })

        socket.on('requestDeleted', response => {
            handleGetRequest()
        })

        socket.on('userUpdate', response => {
            handleGetUsers();
        })
    }, [])

    useEffect(() => {
        setRequest([
            ...request, 
            requestNew
        ])
    }, [requestNew])

    return (
        <AdminContext.Provider
            value={{
                users, 
                suppliers, 
                purchases, 
                request,
                handleGetPurchase,
                customers, 
                sales, 
                handleGetSales,
                roles, 
                specifications, 
                alerta, 
                setAlerta,
                savePurchase, 
                handleChangeQuantityProduct, 
                handleChangeDiscountProduct, 
                handleAddProductArray, 
                handleToggleSaleStatus, 
                loading
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export {
    AdminProvider
}

export default AdminContext;