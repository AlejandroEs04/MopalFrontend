import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Scroll from '../components/Scroll'
import useAdmin from '../hooks/useAdmin'

const AdminRequestsPage = () => {
    const [requestFiltered, setRequestFiltered] = useState([])
    const [showPendingRequest, setShowPendingRequest] = useState(true)
    const [pendingRequest, setPendingRequest] = useState([])
    const [searchText, setSearchText] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const { request, alerta } = useAdmin();

    useEffect(() => {
        const requestFilter = request?.filter(request => request.Status !== 1);
        const pendingRequest = request?.filter(request => request.Status === 1);
        setPendingRequest(pendingRequest)
        setRequestFiltered(requestFilter);
    }, [request, ])

    return (
        <div className='mt-2'>
            <h1 className='m-0 mt-2 pt-2'>Solicitudes</h1>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'} fw-bold`}>{alerta.msg}</p>
            )}

            <div className="d-flex gap-2 mt-2">
                <input 
                    type="search" 
                    id="searchBar" 
                    className="form-control form-control-sm" 
                    placeholder="Busque una compra" 
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />

                <button
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable w-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                </button>
            </div>

            {pendingRequest.length > 0 && (
                <>
                    <div className='d-flex align-items-center justify-content-between mt-4 mb-2'>
                        <h2 className='m-0'>Pendientes</h2>
                        <div>
                            <button className='btn btn-secondary' onClick={() => setShowPendingRequest(!showPendingRequest)} >{showPendingRequest ? 'Ocultar' : 'Mostrar'}</button>
                        </div>
                    </div>

                    {showPendingRequest && (
                        <Scroll>
                            <table className='table table-hover'>
                                <thead className="table-secondary">
                                    <tr>
                                        <th>ID</th>
                                        <th>Empresa</th>
                                        <th>Usuario</th>
                                        <th>Contacto</th>
                                        <th>Status</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {request?.map(requestInfo => requestInfo.Status === 1 && (
                                        <tr key={requestInfo.ID}>
                                            <td>{requestInfo.ID}</td>
                                            <td>{requestInfo?.CustomerName ?? requestInfo?.SupplierName ?? 'Interno'}</td>
                                            <td className="text-nowrap">{requestInfo.UserFullName}</td>
                                            <td className="text-nowrap">{requestInfo.Email}</td>
                                            <td className={`text-danger text-nowrap`}>En espera</td>
                                            <td>
                                                <div className="d-flex justify-content-start gap-2">
                                                    <Link to={`${requestInfo.ID}`} className='btn btn-primary btn-sm'>
                                                        Ver informacion
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Scroll>
                    )}
                    
                </>
            )}


            <Scroll>
                <table className='table table-hover mt-3'>
                    <thead className="table-secondary">
                        <tr>
                            <th>ID</th>
                            <th>Empresa</th>
                            <th>Usuario</th>
                            <th>Contacto</th>
                            <th>Status</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requestFiltered?.map(requestInfo => (
                            <tr key={requestInfo.ID}>
                                <td>{requestInfo.ID}</td>
                                <td>{requestInfo?.CustomerName ?? requestInfo?.SupplierName ?? 'Interno'}</td>
                                <td className="text-nowrap">{requestInfo.UserFullName}</td>
                                <td className="text-nowrap">{requestInfo.Email}</td>
                                <td
                                    className={`
                                        ${requestInfo.Status === 2 && 'text-danger'} 
                                        ${requestInfo.Status === 3 && 'text-primary'} 
                                        ${requestInfo.Status === 4 && 'text-success'} 
                                        text-nowrap
                                    `}
                                >
                                    {requestInfo.Status === 1 && 'En espera'}
                                    {requestInfo.Status === 2 && 'Aceptada'}
                                    {requestInfo.Status === 3 && 'En camino'}
                                    {requestInfo.Status === 4 && 'Entregado'}
                                </td>
                                <td>
                                    <div className="d-flex justify-content-start gap-2">
                                        <Link to={`${requestInfo.ID}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 iconTable text-dark">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                            </svg>
                                        </Link>
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

export default AdminRequestsPage