import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import Select from 'react-select';
import Scroll from "../components/Scroll";
import axios from "axios";
import formatearFecha from "../helpers/formatearFecha";

const CrudQuotationPage = () => {
    // Inputs
    const [folio, setFolio] = useState('');
    const [date, setDate] = useState(formatearFecha(Date.now()));
    const [userID, setUserID] = useState(null);
    const [customerID, setCustomerID] = useState(0);
    const [productID, setProductID] = useState(null);
    const [total, setTotal] = useState(0);

    const [productos, setProductos] = useState([]);

    // Select
    const [selectedOption, setSelectedOption] = useState(null)
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)
    
    // Redireccionamiento
    const navigate = useNavigate();
    const { id } = useParams();
    const { pathname } = useLocation()

    // Get info
    const { products } = useApp();
    const { users, customers, sales, handleToggleSaleStatus, alerta, setAlerta } = useAdmin();
    const { auth } = useAuth();

    // Inicializar Select
    const customersOptions = customers.map(customer => {
        const customerNew = {
            value : customer.ID, 
            label : `${customer.ID} - ${customer.BusinessName}`
        }

        return customerNew
    })

    const options = products.map(product => {
        const productNew = {
            value : product.Folio, 
            label : `${product.Folio} - ${product.Name}`
        }
    
        return productNew;
    })

    // Modificar selects 
    const handleSelectChange = (selected) => {
        setSelectedOption(selected)
        setProductID(selected.value);
    };

    const handleSelectCustomerChange = (selected) => {
        setSelectedCustomerOption(selected)
        setCustomerID(selected.value);
    }

    const formatearDinero = cantidad => {
        return cantidad.toLocaleString('en-US', {
            style: "currency",
            currency: 'USD', 
            minimumFractionDigits: 2,
        })
    }

    // Agregar productos al arreglo
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
                        Discount : 0
                    }
                ])
                setProductID(null)
                setSelectedOption(null)
            } else {
                setSelectedOption(null)
                setProductID(null)
            }
        }
    }
    
    // Cambiar infor de productos en el array
    const handleChangeQuantityProduct = (Quantity, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Quantity = +Quantity;
            }
            return producto
        })
        
        setProductos(newArray);
    }
    
    const handleChangeDiscountProduct = (Discount, productId) => {
        const newArray = productos.map(producto => {
            if(producto.Folio === productId) {
                producto.Discount = +Discount;
            }
            return producto
        })

        setProductos(newArray)
    }

    // Agregar / Generar una nueva cortizacion
    const handleGenerateSale = async() => {
        const sale = {
          SaleDate : date, 
          CustomerID : +customerID, 
          CurrencyID : 1, 
          StatusID : 1, 
          UserID : +userID,
          Amount : +total,
          Active : true, 
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
          const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales`, {"sale" : sale}, config);
          setAlerta({
            error: false, 
            msg : data.msg
          })
        } catch (error) {
          console.log(error)
        }
    }

    useEffect(() => {
        setUserID(auth.ID)
    }, [])

    useEffect(() => {
        if(id) {
            const sale = sales?.filter(sale => sale.Folio === +id)
            
            if(sale.length > 0) {
                setFolio(sale[0].Folio)
                setCustomerID(sale[0].CustomerID)
                setSelectedCustomerOption({
                    value: sale[0].CustomerID, 
                    label: `${sale[0].CustomerID} - ${sale[0].BusinessName}`
                })
                console.log(sale[0].Products)
                setProductos(sale[0].Products)
                setDate(formatearFecha(sale[0].SaleDate))
            }
        }
    }, [sales])

    useEffect(() => {
        const calculoTotal = productos.reduce((total, product) => total + ((+product.ListPrice * product.Quantity) - ((product.Discount / 100) * +product.ListPrice * product.Quantity)), 0)
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

            <div className="row mb-2">
                <div className="col-lg-7">
                    <h2>Generar Cotización</h2>
                    <p>Ingresa los datos que se solicitan para dar de alta una nueva cotización</p>
                </div>

                <div className="col-lg-5 d-flex gap-2 justify-content-lg-end">
                    <div>
                        <button
                            disabled={checkInfo()}
                            className={`btn ${checkInfo() ? 'bg-transparent text-success' : 'btn-success'} w-100`}
                            onClick={() => handleGenerateSale()}
                        >
                            {folio ? 'Editar' : 'Generar'} Cotizacion
                        </button>
                    </div>
                    
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleToggleSaleStatus(folio, 2)}
                        >
                            Finalizar Cotización
                        </button>
                    </div>

                    
                </div>
            </div>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <form className="row g-2">
                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="id">Folio</label>
                    <input 
                        type="number" 
                        id="id" 
                        placeholder="Folio de la cotizacion" 
                        className="form-control"
                        value={folio}
                        disabled
                        onChange={e => setFolio(e.target.value)}
                    />
                </div>

                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="costumer">Cliente</label>
                    <Select 
                        options={customersOptions} 
                        onChange={handleSelectCustomerChange} 
                        className="w-100"
                        value={selectedCustomerOption}
                    />
                </div>

                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="date">Fecha de la cotizacion</label>
                    <input 
                        type="date" 
                        id="date" 
                        placeholder="Fecha de la cotizacion" 
                        className="form-control"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </div>
                
                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="currency">Tipo de cambio</label>
                        <select id="currency" defaultValue={'USD'} className="form-select">
                        <option value="USD">Dolar Estadounidense</option>
                        <option value="MXN">Peso Mexicano</option>
                    </select>
                </div>
                
                <div className="col-lg-4 d-flex flex-column">
                    <label htmlFor="user">Usuario</label>
                    <select id="user" className="form-select" disabled={id} value={userID} onChange={e => setUserID(e.target.value)}>
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
                <table className="table table-dark table-hover mt-3">
                <thead>
                    <tr>
                    <th>Folio</th>
                    <th>Nombre</th>
                    <th>Precio Unitario</th>
                    <th>Stock</th>
                    <th>Cantidad</th>
                    <th>Descuento (%)</th>
                    <th>Importe</th>
                    </tr>
                </thead>

                <tbody>
                    {productos?.map(producto => (
                    <tr className="tableTr" key={producto.Folio}>
                        <td>{producto.Folio}</td>
                        <td>{producto.Name}</td>
                        <td>{producto.ListPrice}</td>
                        <td>{producto.Stock}</td>
                        <td><input type="number" value={producto.Quantity} onChange={e => handleChangeQuantityProduct(e.target.value, producto.Folio)}/></td>
                        <td><input type="number" value={producto.Discount} onChange={e => handleChangeDiscountProduct(e.target.value, producto.Folio)}/></td>
                        <td>{producto.ListPrice * producto.Quantity - ((producto.Discount / 100) * producto.ListPrice * producto.Quantity)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </Scroll>
        </div>
    )
}

export default CrudQuotationPage