import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import formatearFecha from "../helpers/formatearFecha";
import axios from "axios";
import Select from 'react-select';
import Scroll from "../components/Scroll";
import Spinner from 'react-bootstrap/Spinner';
import formatearDinero from "../helpers/formatearDinero";
import DeletePop from "../components/DeletePop";

const CrudSalePage = () => {
    // Inicializar alerta
    const [alerta, setAlerta] = useState(null)
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);

    // Inputs
    const [folio, setFolio] = useState('');
    const [productFolio, setProductFolio] = useState('');
    const [date, setDate] = useState(formatearFecha(Date.now()));
    const [userID, setUserID] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productID, setProductID] = useState(null);
    const [customerID, setCustomerID] = useState(0)
    const [total, setTotal] = useState(0);
    const [observation, setObservation] = useState("");

    const [sale, setSale] = useState({})
    
    // Select
    const [selectedOption, setSelectedOption] = useState(null)
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)

    const { products } = useApp();
    const { users, customers, sales, loading, setLoading } = useAdmin();
    const { auth } = useAuth();

    // Redireccionamiento
    const navigate = useNavigate();
    const { id } = useParams()

    // Inicializar Select
    const options = products.map(product => {
        const productNew = {
            value : product.Folio, 
            label : `${product.Folio} - ${product.Name}`
        }

        return productNew;
    })

    const customerOptions = customers.map(customer => {
        const customerNew = {
            value : customer.ID, 
            label : `${customer.ID} - ${customer.BusinessName}`
        }

        return customerNew;
    })

    const handleSelectChange = (selected) => {
        setSelectedOption(selected)
        setProductID(selected.value);
    };
    
    const handleCustomersSelectChange = (selected) => {
        if(!id) {
            setCustomerID(selected.value);
            setSelectedCustomerOption(selected)
        }
    };

    // Elementos del arreglo de productos
    const handleAddProductArray = () => {
        if(productID) {
            const productNew = products.filter(producto => producto.Folio === productID);

            const existArray = productos.filter(producto => producto.Folio === productID)

            if(existArray.length === 0) {
                setProductos([
                    ...productos, 
                    {
                        ...productNew[0], 
                        Quantity : 1, 
                        Discount : null
                    }
                ])
                
                setProductID(null)
                setSelectedOption(null)
            } else {
                setSelectedOption(null)
                setProductID(null)
            }
        }

        if(id) {
            setEdit(true)
        }
    }

    const handleRemoveProductArray = (productoID) => {
        const newArray = productos.filter(producto => producto.Folio !== productoID)
        setProductos(newArray)
    }

    const handleChangeQuantityProduct = (Quantity, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Quantity = +Quantity;
            }

            return producto
        })
        
        setProductos(newArray);

        if(id) {
            setEdit(true)
        }
    }

    const handleChangeDiscountProduct = (Discount, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Discount = +Discount;
            }

            return producto
        })

        setProductos(newArray)

        if(id) {
            setEdit(true)
        }
    }

    const handleDeleteSaleProduct = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/sales/${id}/${productFolio}`, config);
            
            setAlerta({
                error: false, 
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

    const handleSaveSale = async() => {
        const sale = {
            SaleDate : date, 
            CustomerID : +customerID, 
            CurrencyID : 1, 
            StatusID : 2, 
            UserID : +userID,
            Amount : +total,
            Active : true, 
            Observation : observation,
            products : productos
        }

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            let response

            if(id) {
                sale.Folio = id

                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/sales`, { sale : sale }, config);
                response = data
            } else {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales`, { sale : sale }, config);
                response = data
            }
            
            setAlerta({
                error: false, 
                msg : response.msg
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

    useEffect(() => {
        setUserID(auth.ID)
    }, [])

    useEffect(() => {
        if(id) {
            const sale = sales?.filter(sale => sale.Folio === +id);
            setSale(sale[0])
            if(sale.length > 0) {
                setFolio(sale[0].Folio)
                setCustomerID(sale[0].CustomerID)
                setSelectedCustomerOption({
                    value: sale[0].CustomerID, 
                    label: `${sale[0].CustomerID} - ${sale[0].BusinessName}`
                })
                setProductos(sale[0].Products)
                setDate(formatearFecha(sale[0].SaleDate))
                setObservation(sale[0].Observation)
            }
        }
    }, [sales])
    
    useEffect(() => {
        const calculoTotal = productos?.reduce((total, product) => total + ((+product.ListPrice * product.Quantity) - ((product.Discount / 100) * +product.ListPrice * product.Quantity)), 0)
        setTotal(calculoTotal)
    }, [productos])

    const checkInfo = useCallback(() => {
        return userID === 0 ||
            customerID === 0 ||
            productos.length === 0
    }, [userID, customerID, productos])
    
    useEffect(() => {
        checkInfo()
    }, [userID, customerID, productos])

    return (
        <div className="container mt-4">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <div className="row">
                <div className="col-lg-8">
                    <h2>{id ? 'Editar' : 'Generar'} Venta</h2>
                    <p>Ingresa los datos que se solicitan para dar de alta una nueva venta</p>
                </div>

                <div className="col-lg-4 d-flex gap-2 justify-content-lg-end">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            {edit && id ? (
                                <div>
                                    <button 
                                        onClick={() => handleSaveSale()}
                                        className="btn btn-secondary"
                                    >
                                        Editar Venta
                                    </button>
                                </div>
                            ) : id && (
                                <div>
                                    <button className="btn btn-primary">
                                        Descargar PDF
                                    </button>
                                </div>
                            )}

                            <div>
                                <button
                                    disabled={checkInfo() || folio}
                                    className={`btn ${checkInfo() || folio ? 'bg-transparent text-success' : 'btn-success'} w-100`}
                                    onClick={() => handleSaveSale()}
                                >Generar Venta</button>
                            </div>
                        </>
                    )}
                    
                </div>
            </div>
            

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} mt-2`}>{alerta.msg}</p>
            )}

            <form className="row g-2">
                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="id">Folio</label>
                    <input 
                        type="number" 
                        id="id" 
                        placeholder="Folio de la venta" 
                        className="form-control"
                        disabled
                        value={folio}
                    />
                </div>

                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="customer">Cliente</label>
                    <Select 
                        options={customerOptions} 
                        onChange={handleCustomersSelectChange} 
                        value={selectedCustomerOption}
                        className="w-100"
                    />
                </div>

                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="date">Fecha de la venta</label>
                    <input 
                        type="date" 
                        id="date" 
                        placeholder="Fecha de la venta" 
                        className="form-control"
                        value={date}
                        disabled={folio}
                        onChange={e => setDate(e.target.value)}
                    />
                </div>
                
                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="currency">Tipo de cambio</label>
                    <select id="currency" disabled={id} defaultValue={'USD'} className="form-select">
                        <option value="USD">Dolar Estadounidense</option>
                        <option value="MXN">Peso Mexicano</option>
                    </select>
                </div>
                
                <div className="col-lg-4 d-flex flex-column">
                    <label htmlFor="user">Usuario</label>
                    <select disabled={folio} id="user" className="form-select" value={userID} onChange={e => setUserID(e.target.value)}>
                    <option value="0">Seleccione el usuario</option>
                    {users?.map(user => (
                        <option key={user.ID} value={user.ID}>{`${user.ID} - ${user.FullName}`}</option>
                    ))}
                    </select>
                </div>
                
                <div className="col-lg-4 d-flex flex-column">
                    <label htmlFor="total">Total</label>
                    <input 
                        type="text" 
                        id="total" 
                        disabled 
                        value={`${formatearDinero(total)} USD`} 
                        className="form-control" 
                    />
                </div>

                <div className="col-12 d-flex flex-column mb-2">
                    <label htmlFor="observaciones">Observaciones</label>
                    <textarea id="observaciones" rows={5} className="form-control" value={observation} onChange={e => { setObservation(e.target.value), setEdit(true) }}></textarea>
                </div>

                <div className="col-lg-10 col-md-8">
                    <Select 
                        options={options} 
                        onChange={handleSelectChange} 
                        className="w-100"
                        value={selectedOption}
                    />
                </div>
                
                <div className="col-lg-2 col-md-4">
                    <button onClick={handleAddProductArray} type="button" className="btn bgPrimary w-100">+ Agregar Producto</button>
                </div>
            </form>

            <Scroll>
                <table className="table table-dark table-hover mt-3 mb-5">
                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Nombre</th>
                            <th>Precio U.</th>
                            <th>Stock Disp.</th>
                            <th>Cantidad</th>
                            <th>Descuento (%)</th>
                            <th>Importe</th>
                            {productos?.length > 1 | !id && (
                                <th>Acciones</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {productos?.map(producto => (
                            <tr className="tableTr" key={producto.Folio}>
                                <td className="text-nowrap">{producto.Folio}</td>
                                <td className="text-nowrap">{producto.Name}</td>
                                <td className="text-nowrap">{formatearDinero(producto.ListPrice)}</td>
                                <td className="text-nowrap">{producto.Stock ?? producto.StockAvaible}</td>
                                <td className="text-nowrap"><input type="number" className={`${producto.Quantity > producto.Stock && !id && 'text-warning'} tableNumber`} value={producto.Quantity} onChange={e => handleChangeQuantityProduct(e.target.value, producto.Folio)}/></td>
                                <td className="text-nowrap"><input type="number" className="tableNumber" value={producto.Discount} onChange={e => handleChangeDiscountProduct(e.target.value, producto.Folio)}/></td>
                                <td className="text-nowrap">{formatearDinero(producto.ListPrice * producto.Quantity - ((producto.Discount / 100) * producto.ListPrice * producto.Quantity))}</td>
                                {productos.length > 1 | !id && (
                                    <td>
                                        <div>
                                            <button 
                                                onClick={() => {
                                                    if(id) {
                                                        setProductFolio(producto.Folio)
                                                        setShow(true)
                                                    } else {
                                                        handleRemoveProductArray(producto.Folio)
                                                    }
                                                }}
                                                className="text-danger p-0 w-100 text-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Scroll>

            <DeletePop 
                setShow={setShow}
                show={show}
                setFolio={setProductFolio}
                text={`¿Quieres eliminar el producto ${productFolio}?`}
                header="Eliminar Producto"
                handleFunction={handleDeleteSaleProduct}
            />
        </div>
    )
}

export default CrudSalePage