import { Link, useLocation } from "react-router-dom"
import Scroll from "../components/Scroll"
import useAdmin from "../hooks/useAdmin"
import { useEffect, useState } from "react"

const AdminQuotationPage = () => {
    const [showRequest, setShowRequest] = useState(false)
    const [pendingRequest, setPendingRequest] = useState([])
    const { pathname } = useLocation();
    const { sales, request } = useAdmin();

    useEffect(() => {
        const requestArray = request?.filter(requestNew => requestNew.Status === 1);
        setPendingRequest(requestArray);
    }, [request])

    return (
        <div className="mt-2">
            {pendingRequest?.length > 0 && (
                <>
                    <div className="d-flex gap-4 align-items-end">
                        <h1 className="m-0">Solicitudes</h1>
                        <button onClick={() => setShowRequest(!showRequest)} className="btn btn-sm btn-dark">Ver pedidos</button>
                    </div>

                    {showRequest && (
                        <>
                            {pendingRequest?.length > 0 && (
                                <table className="table table-dark table-hover mt-3">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Folio del producto</th>
                                            <th>Cantidad</th>
                                            <th>Usuario</th>
                                            <th>Status</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                
                                    <tbody>
                                    {request?.map(request => request.Status === 1 && (
                                        <tr key={request.ID}>
                                            <td>{request.ID}</td>
                                            <td>{request.ProductFolio}</td>
                                            <td>{request.Quantity}</td>
                                            <td>{request.UserFullName}</td>
                                            <td className={`${request.Status === 1 ? 'text-warning' : 'text-success'}`}>{request.Status === 1 ? 'En espera' : 'Aceptada'}</td>
                                            <td className="d-flex justify-content-start gap-2">
                                                <Link to={pathname.includes('admin') ? `/admin/request/${request.ID}` : `/purchase/request/${request.ID}`} className="btn btn-sm btn-primary">Ver informacion</Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </>
            )}


            <h1 className={`m-0 mt-2 pt-2 ${pendingRequest.length > 0 && 'border-top border-dark'} `}>Cotizaciones</h1>
            {pathname && (
                <Link to={`${pathname}/form`} className='btnAgregar fs-5'>+ Generar nueva cotizacion</Link>
            )}
            
            <Scroll>
                <table className="table table-dark table-hover mt-3">
                    <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Cliente</th>
                        <th>Usuario</th>
                        <th>Status</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>

                    <tbody>
                    {sales?.map(sale => sale.Status === "Cotización" && (
                        <tr key={sale.Folio}>
                        <td>{sale.Folio}</td>
                        <td>{sale.BusinessName}</td>
                        <td>{sale.User}</td>
                        <td className={`${sale.Status === 'Generada' ? 'text-warning' : 'text-success'}`}>{sale.Status}</td>
                        <td className={`${sale.Active === 1 ? 'text-success' : 'text-danger'}`}>{sale.Active === 1 ? 'Activo' : 'Inactivo'}</td>
                        <td>
                            <div className="d-flex justify-content-start gap-2">
                                <Link to={`${pathname}/form/${sale.Folio}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable editar">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </Link>

                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                            
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Scroll>
        </div>
    )
}

export default AdminQuotationPage