import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios";
import useApp from "../hooks/useApp";
import formatearFecha from "../helpers/formatearFecha";
import { socket } from "../socket";
import DeletePop from "../components/DeletePop";
import Spinner from "../components/Spinner";
import useAdmin from "../hooks/useAdmin";
import formatearDinero from "../helpers/formatearDinero";
import Scroll from "../components/Scroll";
import RequestInfoTr from "../components/RequestInfoTr";

const AdminRequestPage = () => {
    const [request, setRequest] = useState();
    const [ID, setID] = useState();
    const [show, setShow] = useState(false);
    const [showAccept, setShowAccept] = useState(false);
    const { loading, setLoading } = useApp()
    const { handleChangeStatus, alerta, setAlerta } = useAdmin();
    const { id } = useParams();

    const navigate = useNavigate();

    const handleShow = () => {
        setShow(true)
    };

    const handleGetRequest = async() => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/request/${id}`, config);
            setRequest(data.request)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeteleRequest = async() => {
        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            setLoading(true)

            await axios.delete(`${import.meta.env.VITE_API_URL}/api/request/${id}`, config);
            setAlerta({
                error : true, 
                msg : "Se ha cancelado la solicitud con exito"
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)

            navigate(-1)
        } catch (error) {
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        } finally {
            setLoading(false)
        }
    }
    
    const handleAcceptRequest = async() => {
        const token = localStorage.getItem('token');
        
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        
        try {
            setLoading(true)

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/request/${id}`, { request }, config);
            setAlerta({
                error : false, 
                msg : data.msg
            })
            
            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        } catch (error) {
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 5000)
        } finally {
            setLoading(false)
        }
    }

    const subtotal = useMemo(() => request?.products?.reduce((total, product) => total + ((product.Quantity * product.ListPrice) * (product.Percentage / 100)), 0), [request])
    const iva = useMemo(() => request?.products?.reduce((total, product) => total + (product.Quantity * ((product.ListPrice * (product.Percentage / 100)) * .16)), 0), [request])
    const total = useMemo(() => subtotal + iva, [request])
    
    useEffect(() => {
        handleGetRequest()
        
        socket.on('requestUpdate', response => {
            handleGetRequest()
        })
    }, [])

    return (
        <div className="container">
            <button onClick={() => navigate(-1)} className="backBtn p-0 mt-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>
            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} fw-bold`}>{alerta.msg}</p>
            )}
            <div className="row">
                <div className="col-xl-9 col-md-8 col-sm-6">
                    <h1 className="text textPrimary">Informacion de la solicitud</h1>
                    <p className="mb-1 fw-bold fs-6">ID: <span className="fw-medium">{request?.ID}</span></p>
                    <p className="mb-1 fw-bold fs-6">Fecha: <span className="fw-medium">{formatearFecha(request?.CreationDate)}</span></p>
                    <p className="mb-1 fw-bold fs-6">
                        Estatus: 
                        <span 
                            className={`
                                fw-medium 
                                ${request?.Status === 1 && 'text-danger'}
                                ${request?.Status === 2 && 'text-primary'}
                                ${request?.Status === 3 && 'text-warning'}
                                ${request?.Status === 4 && 'text-success'}
                            `}
                        >
                            {request?.Status === 1 && ' En espera'}
                            {request?.Status === 2 && ' Aceptada'}
                            {request?.Status === 3 && ' En camino'}
                            {request?.Status === 4 && ' Entregada'}
                        </span>
                    </p>
                </div>
                
                <div className="col-xl-3 col-md-4 col-sm-6">
                    {request?.Status === 1 && (
                        <>
                            <h4>Acciones</h4>
                            <button 
                                onClick={() => {
                                    setShowAccept(true);
                                    setID(request?.ID)
                                }} 
                                className="w-100 btn btn-primary"
                            >Aceptar Solicitud</button>
                            <button 
                                onClick={() => {
                                    handleShow()
                                    setID(request?.ID)
                                }} 
                                className="w-100 btn btn-danger mt-2">Cancelar Solicitud</button>
                            {/* <button className="w-100 btn btn-dark mt-5">Contactar Solicitante</button> */}
                        </>
                    )}

                    {request?.Status === 2 && (
                        <div className="d-flex justify-content-end">
                            <button onClick={() => handleChangeStatus('request', request?.ID, (request?.Status+1))} className="btn btn-primary">En camino</button>
                        </div>
                    )}

                    {request?.Status === 3 && (
                        <div className="d-flex justify-content-end">
                            <button onClick={() => handleChangeStatus('request', request?.ID, (request?.Status+1))} className="btn btn-success">Entregado</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="my-3">
                <div>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <h2 className="text textPrimary">Informacion de los productos solicitados</h2>
                            <Scroll>
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Folio</th>
                                            <th>Nombre</th>
                                            <th>Cantidad Solicitado</th>
                                            <th>Stock Disponible</th>
                                            <th>Precio Lista</th>
                                            <th>Porcentaje (%)</th>
                                            <th>Assembly with</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {request?.products?.map(product => (product.Assembly === '' || !product.Assembly) && (
                                            <RequestInfoTr 
                                                product={product}
                                                request={request}
                                                setRequest={setRequest}
                                                key={product.ProductFolio}
                                            />
                                        ))}

                                        {request?.CustomerID && (
                                            <>    
                                                <tr>
                                                    <td colSpan={4} className="table-active"></td>
                                                    <th colSpan={2}>Subtotal</th>
                                                    <td>{formatearDinero(+subtotal)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={4} className="table-active"></td>
                                                    <th colSpan={2}>IVA (%)</th>
                                                    <td>{formatearDinero(+iva)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={4} className="table-active"></td>
                                                    <th colSpan={2}>Importe</th>
                                                    <td>{formatearDinero(+total)}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </Scroll>

                            <h2 className="text textPrimary mt-4">Informacion del solicitante</h2>
                            <p className="mb-1 fw-bold fs-6">Nombre del usuario: <span className="fw-medium">{request?.UserFullName}</span></p>
                            <p className="mb-1 fw-bold fs-6">Correo del usuario: <span className="fw-medium">{request?.Email}</span></p>
                            <p className="mb-1 fw-bold fs-6">Numero del usuario: <span className="fw-medium">{request?.Number}</span></p>
                            <p className="mb-1 fw-bold fs-6">Direccion del usuario: <span className="fw-medium">{request?.Address}</span></p>
                            {request?.SupplierID && (
                                <>
                                    <h3>Informacion del proovedor</h3>
                                    <p className="mb-1 fw-bold fs-6 mt-2">Empresa: <span className="fw-medium">{request?.SupplierName}</span></p>
                                    <p className="mb-1 fw-bold fs-6">RFC: <span className="fw-medium">{request?.SupplierRFC}</span></p>
                                    <p className="mb-1 fw-bold fs-6">Direccion: <span className="fw-medium">{request?.SupplierAddress}</span></p>
                                </>
                            )}

                            {request?.CustomerID && (
                                <>
                                    <h3 className="mt-3">Informacion del cliente</h3>
                                    <p className="mb-1 fw-bold fs-6 mt-2">Empresa: <span className="fw-medium">{request?.CustomerName}</span></p>
                                    <p className="mb-1 fw-bold fs-6">RFC: <span className="fw-medium">{request?.CustomerRFC}</span></p>
                                    <p className="mb-1 fw-bold fs-6">Direccion: <span className="fw-medium">{request?.CustomerAddress}</span></p>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <DeletePop 
                header="Cancelar Solicitud"
                text={`¿Seguro que deseas cancelar la solitud?`}
                show={show}
                setShow={setShow}
                setFolio={setID}
                handleFunction={handleDeteleRequest}
                btnText="Cancelar"
            />
            
            <DeletePop 
                header="Aceptar Solicitud"
                text={`¿Desea aceptar la solicitud?`}
                show={showAccept}
                setShow={setShowAccept}
                setFolio={setID}
                handleFunction={handleAcceptRequest}
                btnGreen 
                btnText="Aceptar"
            />
        </div>
    )
}

export default AdminRequestPage