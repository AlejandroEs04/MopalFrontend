import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import Select from 'react-select';
import Scroll from "../components/Scroll";
import axios from "axios";
import formatearFecha from "../helpers/formatearFecha";
import formatearDinero from "../helpers/formatearDinero";
import findNextID from "../helpers/findNextID";
import findLastID from "../helpers/findLastID ";
import DeletePop from "../components/DeletePop";

const CrudQuotationPage = () => {
    // Inputs
    const [folio, setFolio] = useState('');
    const [date, setDate] = useState(formatearFecha(Date.now()));
    const [userID, setUserID] = useState(null);
    const [customerID, setCustomerID] = useState(0);
    const [productID, setProductID] = useState(null);
    const [total, setTotal] = useState(0);
    const [observation, setObservation] = useState("");
    const [customerUserID, setCustomerUserID] = useState(0)
    const [customerUsers, setCustomerUsers] = useState([])
    const [edit, setEdit] = useState(false);
    const [showProductAccesories, setShowProductAccesories] = useState('');
    const [show, setShow] = useState(false);
    const [productFolio, setProductFolio] = useState('');

    const [productos, setProductos] = useState([]);

    // Select
    const [selectedOption, setSelectedOption] = useState(null)
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)
    
    // Redireccionamiento
    const { id } = useParams();
    const { pathname } = useLocation()

    // Get info
    const { products } = useApp();
    const { users, customers, sales, handleToggleSaleStatus, alerta, setAlerta } = useAdmin();
    const { auth } = useAuth();

    // Inicializar Select
    const customerOptions = customers.map(customer => {
        const customerNew = {
            value : customer.ID, 
            label : `${customer.ID} - ${customer.BusinessName}`
        }

        return customerNew;
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

    const handleCustomersSelectChange = (selected) => {
        if(!id) {
            setCustomerID(selected.value);
            setSelectedCustomerOption(selected)
        }
    };

    // Agregar productos al arreglo
    const handleAddProductArray = (id, assemblyFolio = null) => {
        if(productID || id) {
            const productNew = products.filter(producto => producto.Folio === productID || producto.Folio === id)[0];

            const existArray = productos.filter(producto => (producto.Folio === productID || producto.Folio === id) && producto.Assembly === assemblyFolio)

            if(existArray.length === 0) {
                setProductos([
                    ...productos, 
                    {
                        ...productNew, 
                        Quantity : 1, 
                        Percentage : 100, 
                        PricePerUnit : productNew.ListPrice, 
                        Assembly : assemblyFolio ?? null
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

    const handleRemoveProductArray = (productoID) => {
        const newArray = productos.filter(producto => producto.Folio !== productoID)
        setProductos(newArray)
    }

    const handleChaneInfo = (e, folio, assembly) => {
        const newArray = productos.map(product => product.Folio === folio && product.Assembly === assembly ? {...product, [e.target.name] : e.target.value} : product)
        setProductos(newArray)
    }


    // Agregar / Generar una nueva cortizacion
    const handleGenerateSale = async() => {
        const sale = {
          SaleDate : date, 
          CustomerID : +customerID, 
          CustomerUserID : +customerUserID === 0 ? null : +customerUserID, 
          CurrencyID : 1, 
          StatusID : 1, 
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
          const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales`, {"sale" : sale}, config);
          setAlerta({
            error: false, 
            msg : data.msg
          })

          setTimeout(() => {
            setAlerta(null)
          }, 5000)
        } catch (error) {
          console.log(error)
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

    const handleGetQuotations = () => {
        const quotations = sales.filter(sale => sale?.StatusID === 1);
        return quotations
    }

    const handleNextQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetQuotations()
            return findNextID(quotations, id)
        }
    }
    
    const handleLastQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetQuotations()
            return findLastID(quotations, id)
        }
    }

    useEffect(() => {
        const customerItem = customers?.filter(customer => customer.ID === customerID);

        if(customerItem[0]?.Users.length > 0) {
            setCustomerUsers(customerItem[0].Users)
        } else {
            setCustomerUsers([])
        }
    }, [customerID])

    useEffect(() => {
        setUserID(auth.ID)
    }, [])

    useEffect(() => {
        if(id) {
            const sale = sales?.filter(sale => sale.Folio === +id);
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
                setCustomerUserID(sale[0].CustomerUserID)
            }
        }
    }, [sales, pathname])

    useEffect(() => {
        const calculoTotal = productos.reduce((total, product) => total + ((product.Quantity * product.PricePerUnit) * (product.Percentage / 100)), 0)
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
            <div className="d-flex justify-content-between mb-4">
                <Link to={'/admin/quotation'} className="backBtn text-decoration-none text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                    <p>Back</p>
                </Link>

                <div className="d-flex gap-3">
                    <Link to={`/admin/quotation/form/${handleLastQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <p>Anterior</p>
                    </Link>

                    <Link to={`/admin/quotation/form/${handleNextQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <p>Siguiente</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>
            

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
                    <label htmlFor="customer">Cliente</label>
                    <Select 
                        options={customerOptions} 
                        onChange={handleCustomersSelectChange} 
                        value={selectedCustomerOption}
                        className="w-100"
                    />
                </div>

                {customerUsers.length > 0 && (
                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="user">Usuario</label>
                        <select disabled={folio} id="user" className="form-select" value={customerUserID} onChange={e => setCustomerUserID(e.target.value)}>
                        <option value={0}>Sin Contacto</option>
                        {customerUsers?.map(user => (
                            <option key={user.UserID} value={user.UserID}>{`${user.UserID} - ${user.FullName}`}</option>
                        ))}
                        </select>
                    </div>
                )}

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
                <table className="table table-hover mt-3">
                <thead className="table-light">
                    <tr>
                        <th>Folio</th>
                        <th>Nombre</th>
                        <th>Precio U.</th>
                        <th>Stock</th>
                        <th>Cantidad</th>
                        <th>Porcentaje (%)</th>
                        <th>Importe</th>
                        <th>Ensamble</th>
                        {productos?.length > 1 | !id && (
                            <th>Acciones</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {productos?.map(producto => (
                        <>
                            <tr className="tableTr" key={producto.Folio}>
                                <td className="text-nowrap">{producto.Folio}</td>
                                <td className="text-nowrap">{producto.Name}</td>
                                <td className="text-nowrap"><input type="number" name="PricePerUnit" className={`text-dark tableNumber`} value={producto.PricePerUnit} onChange={e => handleChaneInfo(e, producto.Folio, producto.Assembly)}/></td>
                                <td className="text-nowrap">{producto.Stock ?? producto.StockAvaible}</td>
                                <td className="text-nowrap"><input type="number" name="Quantity" className={`${producto.Quantity > producto.StockAvaible && !id ? 'text-danger' : 'text-dark'} tableNumber`} value={producto.Quantity} onChange={e => handleChaneInfo(e, producto.Folio, producto.Assembly)}/></td>
                                <td className="text-nowrap"><input type="number" name="Percentage" className="text-dark tableNumber" value={producto.Percentage} onChange={e => handleChaneInfo(e, producto.Folio, producto.Assembly)}/></td>
                                <td className="text-nowrap">{formatearDinero((producto.Quantity * producto.PricePerUnit) * (producto.Percentage / 100))}</td>
                                <td className="text-nowrap">{producto.Assembly ?? 'Pieza'}</td>
                                {productos.length > 1 | !id && (
                                    <td>
                                        <div className="d-flex justify-content-between">
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

                                            {producto.Folio === showProductAccesories ? (
                                                <button
                                                    onClick={() => {
                                                        setShowProductAccesories('')
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-danger">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            ) : producto?.accessories?.length > 0 && (
                                                <button
                                                    onClick={() => setShowProductAccesories(producto.Folio)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-dark">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>

                            {showProductAccesories === producto.Folio && producto.accessories.map(accesory => (
                                <tr>
                                    <td>{accesory.Folio}</td>
                                    <td>{accesory.Name}</td>
                                    <td>{formatearDinero(+accesory.ListPrice)}</td>
                                    <td>{accesory.StockAvaible}</td>
                                    <td>0</td>
                                    <td>0%</td>
                                    <td>{formatearDinero(0)}</td>
                                    <td className="text-nowrap">{producto.Folio}</td>
                                    <td>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    handleAddProductArray(accesory.Folio, producto.Folio)
                                                }}
                                                className="btn btn-sm btn-primary"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </>
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

export default CrudQuotationPage