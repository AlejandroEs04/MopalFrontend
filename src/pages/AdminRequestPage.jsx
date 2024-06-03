import { useEffect, useState } from "react";
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

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/request/${id}`, {}, config);
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
    
    useEffect(() => {
        handleGetRequest()
        
        socket.on('requestUpdate', response => {
            handleGetRequest()
        })
    }, [])

    return (
        <div className="container my-5">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>
            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} fw-bold`}>{alerta.msg}</p>
            )}
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

            <div className="my-3 row">
                <div className="col-xl-9 col-md-8 col-sm-6">
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
                                            {request?.CustomerID && ( <th>Precio Lista</th> )}
                                            {request?.SupplierID && ( <th>Costo</th> )}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {request?.products?.map(product => (
                                            <tr key={product.ProductFolio}>
                                                <td className="text-nowrap">{product.ProductFolio}</td>
                                                <td className="text-nowrap">{product.ProductName}</td>
                                                <td>{product.Quantity}</td>
                                                <td>{product.StockAvaible}</td>
                                                {request?.CustomerID && ( <td>{formatearDinero(+product.ListPrice)}</td> )}
                                                {request?.SupplierID && ( <td>{formatearDinero(+product.Cost)}</td> )}
                                            </tr>
                                        ))}

                                        {request?.CustomerID && (
                                            <>    
                                                <tr>
                                                    <th>Subtotal</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>IVA (%)</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Importe</th>
                                                    <td></td>
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
                                    <p className="mb-1 fw-bold fs-6 mt-3">Empresa: <span className="fw-medium">{request?.SupplierName}</span></p>
                                    <p className="mb-1 fw-bold fs-6">RFC: <span className="fw-medium">{request?.SupplierRFC}</span></p>
                                    <p className="mb-1 fw-bold fs-6">Direccion: <span className="fw-medium">{request?.SupplierAddress}</span></p>
                                </>
                            )}
                        </>
                    )}
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
                            <button className="w-100 btn btn-dark mt-5">Contactar Solicitante</button>
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