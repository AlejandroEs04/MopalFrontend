import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios";
import useApp from "../hooks/useApp";
import formatearFecha from "../helpers/formatearFecha";
import { socket } from "../socket";
import DeletePop from "../components/DeletePop";
import Spinner from "../components/Spinner";

const AdminRequestPage = () => {
    const [request, setRequest] = useState();
    const [ID, setID] = useState();
    const [show, setShow] = useState(false);
    const [showAccept, setShowAccept] = useState(false);
    const { alerta, setAlerta, loading, setLoading } = useApp()
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
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })
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
            <p className="mb-1 fw-bold fs-6">Estatus: <span className={`fw-medium ${request?.Status === 1 ? 'text-danger' : 'text-success'}`}>{request?.Status === 1 ? 'En espera' : 'Aceptada'}</span></p>

            <div className="my-3 row">
                <div className="col-xl-9 col-md-8 col-sm-6">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <h2 className="text textPrimary">Informacion del producto solicitado</h2>
                            <p className="mb-1 fw-bold fs-6">Folio: <span className="fw-medium">{request?.ProductFolio}</span></p>
                            <p className="mb-1 fw-bold fs-6">Cantidad solicitada: <span className="fw-medium">{request?.Quantity}</span></p>
                            <p className="mb-1 fw-bold fs-6">Stock disponible: <span className="fw-medium">{request?.Stock}</span></p>

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