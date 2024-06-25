import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import Select from 'react-select';
import formatearFecha from "../helpers/formatearFecha";
import findNextID from "../helpers/findNextID";
import findLastID from "../helpers/findLastID ";
import DeletePop from "../components/DeletePop";
import ProductTableForm from "../components/ProductTableForm";
import InputContainer from "../components/InputContainer";
import { Spinner } from "react-bootstrap";

const initialState = {
    Folio : '',
    SaleDate : formatearFecha(Date.now()), 
    CustomerID : 0, 
    CustomerUserID : 0, 
    CurrencyID : 1, 
    StatusID : 1, 
    UserID : 0, 
    Amount : 0, 
    Active : true, 
    Observation : '', 
    Products : []
}

const CrudSalePage = () => {
    const [sale, setSale] = useState(initialState)

    const handleChangeInfo = (e) => {
        const { name, value } = e.target;
        const isNumber = name.includes['CustomerID', 'CustomerUserID', 'CurrencyID', 'StatusID', 'UserID', 'Amount']

        setSale({
            ...sale, 
            [name] : isNumber ? +value : value
        })
    }

    const [customerUsers, setCustomerUsers] = useState([])
    const [show, setShow] = useState(false);
    const [productFolio, setProductFolio] = useState('');
    
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)
    
    const { id } = useParams();
    const { pathname } = useLocation()

    const { users, customers, sales, alerta, handleGenerateSale, handleUpdateSale, handleDeleteSaleProduct, loading } = useAdmin();

    // Inicializar Select
    const customerOptions = customers.map(customer => {
        const customerNew = {
            value : customer.ID, 
            label : `${customer.ID} - ${customer.BusinessName}`
        }

        return customerNew;
    })

    const handleCustomersSelectChange = (selected) => {
        if(!id) {
            setSale({
                ...sale, 
                CustomerID : selected.value
            });
            setSelectedCustomerOption(selected)
        }
    };

    const handleDeleteProduct = () => {
        handleDeleteSaleProduct(id, productFolio)
    }

    const handleGetSales = () => {
        const salesArray = sales.filter(sale => sale?.StatusID > 1);
        return salesArray
    }

    const handleNextSale = () => {
        if(sales.length > 0) {
            const salesArray = handleGetSales()
            return findNextID(salesArray, id)
        }
    }
    
    const handleLastSale = () => {
        if(sales.length > 0) {
            const salesArray = handleGetSales()
            return findLastID(salesArray, id)
        }
    }

    useEffect(() => {
        const customerItem = customers?.filter(customer => customer.ID === sale.CustomerID);

        if(customerItem[0]?.Users.length > 0) {
            setCustomerUsers(customerItem[0].Users)
        } else {
            setCustomerUsers([])
        }
    }, [sale.CustomerID])

    useEffect(() => {
        const calculoTotal = sale?.Products?.reduce((total, product) => total + ((product.Quantity * product.PricePerUnit) * (product.Percentage / 100)), 0)
        setSale({
            ...sale, 
            Amount : +calculoTotal
        })
    }, [sale.Products])
    
    useEffect(() => {
        if(id && sales.length) {
            let saleDB = sales?.filter(sale => sale.Folio === +id)[0];
                
            setSelectedCustomerOption({
                value : saleDB?.CustomerID, 
                label : `${saleDB?.CustomerID} - ${saleDB?.BusinessName}`
            })
            
            setSale({
                ...saleDB,
                SaleDate: formatearFecha(new Date(saleDB?.SaleDate))
            })
        } else {
            setSale(initialState)
        }
    }, [sales, pathname])
    
    const checkInfo = useCallback(() => {
        return sale?.UserID === 0 ||
          sale?.CustomerID === 0 ||
          sale?.Products?.length === 0
    }, [sale])
    
    useEffect(() => {
      checkInfo()
    }, [sale])

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-4">
                <Link to={'/admin/sales'} className="backBtn text-decoration-none text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                    <p>Back</p>
                </Link>

                <div className="d-flex gap-3">
                    <Link to={`/admin/sales/form/${handleLastSale()}`} className="backBtn text-decoration-none text-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <p>Anterior</p>
                    </Link>

                    <Link to={`/admin/sales/form/${handleNextSale()}`} className="backBtn text-decoration-none text-dark">
                        <p>Siguiente</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>

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
                            <div>
                                <button
                                    disabled={checkInfo()}
                                    className={`btn ${checkInfo() ? 'bg-transparent text-success' : 'btn-success'} w-100`}
                                    onClick={() => id ? handleUpdateSale(sale) : handleGenerateSale(sale)}
                                >{id ? 'Editar' : 'Generar'} Venta</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} mt-2`}>{alerta.msg}</p>
            )}

            <form className="row g-2 mb-3">
                <InputContainer 
                    label="Folio"
                    name="Folio"
                    id="folio"
                    type="text"
                    placeholder="Folio de la venta"
                    value={sale.Folio}
                    disable
                />

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
                        <select disabled={sale.Folio} id="user" name="CustomerUserID" className="form-select" value={sale.CustomerUserID} onChange={e => handleChangeInfo(e)}>
                        <option value={0}>Sin Contacto</option>
                        {customerUsers?.map(user => (
                            <option key={user.UserID} value={user.UserID}>{`${user.UserID} - ${user.FullName}`}</option>
                        ))}
                        </select>
                    </div>
                )}


                <InputContainer 
                    label="Fecha de la cotizacion"
                    name="SaleDate"
                    type="date"
                    placeholder="Fecha de la cotizacion"
                    value={sale.SaleDate}
                    handleAction={handleChangeInfo}
                />

                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="currency">Tipo de cambio</label>
                    <select id="currency" disabled={id} defaultValue={'USD'} className="form-select">
                        <option value="USD">Dolar Estadounidense</option>
                        <option value="MXN">Peso Mexicano</option>
                    </select>
                </div>
                
                <div className="col-lg-4 d-flex flex-column">
                    <label htmlFor="user">Usuario</label>
                    <select id="user" name="UserID" className="form-select" disabled={id} value={sale.UserID} onChange={e => handleChangeInfo(e)}>
                    <option value="0">Seleccione el usuario</option>
                    {users?.map(user => (
                        <option key={user.ID} value={user.ID}>{`${user.ID} - ${user.FullName}`}</option>
                    ))}
                    </select>
                </div>

                <InputContainer 
                    label="Total"
                    type="text"
                    value={sale.Amount}
                    isMoney
                    disable
                />

                <div className="col-12 d-flex flex-column mb-2">
                    <label htmlFor="observaciones">Observaciones</label>
                    <textarea 
                        name="Observation"
                        id="observaciones" 
                        rows={5} 
                        className="form-control" 
                        value={sale.Observation} 
                        onChange={e => { handleChangeInfo(e)}}>    
                    </textarea>
                </div>
            </form>

            <ProductTableForm 
                productsArray={sale.Products}
                setProductsArray={setSale}
                sale={sale}
                setShow={setShow}
                setProductFolio={setProductFolio}
                productFolio={productFolio}
            />

            <DeletePop 
                setShow={setShow}
                show={show}
                setFolio={setProductFolio}
                text={`¿Quieres eliminar el producto ${productFolio}?`}
                header="Eliminar Producto"
                handleFunction={handleDeleteProduct}
            />
        </div>
    )
}

export default CrudSalePage