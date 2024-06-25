import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import formatearFecha from "../helpers/formatearFecha";
import axios from "axios";
import Select from 'react-select';
import PurchasePdf from "../pdf/PurchasePdf";
import Spinner from 'react-bootstrap/Spinner';
import DeletePop from "../components/DeletePop";
import ProductTableForm from "../components/ProductTableForm";
import formatearDinero from "../helpers/formatearDinero";
import InputContainer from "../components/InputContainer";

const initialState = {
    Folio : '',
    PurchaseDate : formatearFecha(Date.now()), 
    SupplierID : 0, 
    SupplierUserID : 0, 
    CurrencyID : 1, 
    StatusID : 1, 
    UserID : 0, 
    Amount : 0, 
    Active : true, 
    Observation : '', 
    Products : []
}

const CrudPurchasePage = () => {
    const [purchase, setPurchase] = useState(initialState)

    const handleChangeInfo = (e) => {
        const { name, value } = e.target;
        const isNumber = name.includes['SupplierID', 'SupplierUserID', 'CurrencyID', 'StatusID', 'UserID', 'Amount']

        setPurchase({
            ...purchase, 
            [name] : isNumber ? +value : value
        })
    }

    const [supplierUsers, setSupplierUsers] = useState([])
    const [show, setShow] = useState(false);
    const [productFolio, setProductFolio] = useState('');

    const [selectedSupplierOption, setSelectedSupplierOption] = useState(null)

    const { id } = useParams()

    const { users, suppliers, purchases, loading, setLoading, alerta, setAlerta } = useAdmin();

    const [edit, setEdit] = useState(false);

    const [supplierID, setSupplierID] = useState(0);

    // Redireccionamiento
    const navigate = useNavigate();

    const supplierOptions = suppliers.map(supplier => {
        const supplierNew = {
            value : supplier.ID, 
            label : `${supplier.ID} - ${supplier.BusinessName}`
        }

        return supplierNew;
    })
    
    const handleSupplierSelectChange = (selected) => {
        if(!id) {
            setPurchase({
                ...purchase, 
                SupplierID : selected.value
            });
            setSelectedSupplierOption(selected)
        }
    };

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

            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/purchases/${id}/${productFolio}`, config);
            
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

    const handleSavePurchase = async() => {
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
                purchase.Folio = id

                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase }, config);
                response = data
            } else {

                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/purchases`, { purchase }, config);
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
        const supplierItem = suppliers?.filter(supplier => supplier.ID === purchase.SupplierID);

        if(supplierItem[0]?.Users.length > 0) {
            setSupplierUsers(supplierItem[0].Users)
        } else {
            setSupplierUsers([])
        }
    }, [purchase.SupplierID])
    
    useEffect(() => {
        const calculoTotal = purchase?.Products?.reduce((total, product) => total + ((product.Quantity * product.PricePerUnit) * (product.Percentage / 100)), 0)
        setPurchase({
            ...purchase, 
            Amount : +calculoTotal
        })
    }, [purchase.Products])

    useEffect(() => {
        if(id && purchases.length) {
            let purchaseDB = purchases?.filter(purchase => purchase.Folio === +id)[0];
                
            setSelectedSupplierOption({
                value : purchaseDB?.SupplierID, 
                label : `${purchaseDB?.SupplierID} - ${purchaseDB?.BusinessName}`
            })
            
            setPurchase({
                ...purchaseDB,
                PurchaseDate: formatearFecha(new Date(purchaseDB?.PurchaseDate))
            })
        } else {
            setPurchase(initialState)
        }
    }, [purchases])

    useEffect(() => {
        const supplierItem = suppliers?.filter(supplier => supplier.ID === supplierID);

        if(supplierItem[0]?.Users.length > 0) {
            setSupplierUsers(supplierItem[0].Users)
        } else {
            setSupplierUsers([])
        }
    }, [supplierID])

    const checkInfo = useCallback(() => {
        return +purchase.UserID === 0 ||
            +purchase.SupplierID === 0 ||
            +purchase.Products.length === 0
    }, [purchase])
    
    useEffect(() => {
        checkInfo()
    }, [purchase])

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
                    <h2>{id ? 'Editar' : 'Generar'} Compra</h2>
                    <p>Ingresa los datos que se solicitan para dar de alta una nueva compra</p>
                </div>

                <div className="col-lg-4 d-flex  justify-content-lg-end gap-2">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            {edit && id ? (
                                <div>
                                    <button 
                                        onClick={() => handleSavePurchase()}
                                        className="btn btn-secondary"
                                    >
                                        Editar Compra
                                    </button>
                                </div>
                            ) : id && (
                                <div>
                                    <PurchasePdf 
                                        ordenCompra={purchase}
                                    />
                                </div>
                            )}

                            <div>
                                <button
                                    disabled={checkInfo() || purchase.Folio}
                                    className={`btn ${checkInfo() || purchase.Folio ? 'bg-transparent text-success' : 'btn-success'} w-100`}
                                    onClick={() => handleSavePurchase()}
                                >Generar Compra</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} mt-2`}>{alerta.msg}</p>
            )}

            <form className="row g-2">
                <InputContainer 
                    label="Folio"
                    name="Folio"
                    id="folio"
                    type="text"
                    disable
                    value={purchase.Folio}
                    placeholder="Folio de la compra"
                />

                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="supplier">Proveedor</label>
                    <Select 
                        options={supplierOptions} 
                        onChange={handleSupplierSelectChange} 
                        value={selectedSupplierOption}
                        className="w-100"
                    />
                </div>

                {supplierUsers.length > 0 && (
                    <div className="col-lg-4 d-flex flex-column">
                        <label htmlFor="user">Usuario</label>
                        <select 
                            disabled={purchase.Folio} 
                            id="user" 
                            name="SupplierUserID"
                            className="form-select" 
                            value={purchase.SupplierUserID} 
                            onChange={e => handleChangeInfo(e)}
                        >
                            <option value={0}>Sin Contacto</option>
                            {supplierUsers?.map(user => (
                                <option key={user.UserID} value={user.UserID}>{`${user.UserID} - ${user.FullName}`}</option>
                            ))}
                        </select>
                    </div>
                )}

                <InputContainer 
                    label="Fecha de la compra"
                    name="PurchaseDate"
                    type="date"
                    placeholder="Fecha de la compra"
                    value={purchase.PurchaseDate}
                    handleAction={handleChangeInfo}
                />
                
                <div className="col-lg-4 col-md-6 d-flex flex-column">
                    <label htmlFor="currency">Tipo de cambio</label>
                    <select id="currency" defaultValue={'USD'} className="form-select">
                        <option value="USD">Dolar Estadounidense</option>
                        <option value="MXN">Peso Mexicano</option>
                    </select>
                </div>
                
                <div className="col-lg-4 d-flex flex-column">
                    <label htmlFor="user">Usuario</label>
                    <select 
                        disabled={purchase.Folio} 
                        id="user"
                        name="UserID" 
                        className="form-select" 
                        value={purchase.UserID} 
                        onChange={e => handleChangeInfo(e)}
                    >
                        <option value="0">Seleccione el usuario</option>
                        {users?.map(user => (
                            <option key={user.ID} value={user.ID}>{`${user.ID} - ${user.FullName}`}</option>
                        ))}
                    </select>
                </div>
                
                <InputContainer 
                    label="Total"
                    type="text"
                    value={purchase.Amount}
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
                        value={purchase.Observation} 
                        onChange={e => handleChangeInfo(e)}
                    ></textarea>
                </div>
            </form>

            <ProductTableForm 
                productsArray={purchase.Products}
                setProductsArray={setPurchase}
                setShow={setShow}
                setProductFolio={setProductFolio}
                productFolio={productFolio}
                sale={purchase}
            />

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

export default CrudPurchasePage