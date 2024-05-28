import { useState } from 'react';
import { Link } from 'react-router-dom';
import Scroll from '../components/Scroll'
import useAdmin from '../hooks/useAdmin'

const AdminRequestsPage = () => {
    const [searchText, setSearchText] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const { request } = useAdmin();

    return (
        <div className='mt-2'>
            <h1 className='m-0 mt-2 pt-2'>Solicitudes</h1>

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

            <Scroll>
                <table className='table table-hover mt-3'>
                    <thead className="table-secondary">
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
                        {request?.map(requestInfo => (
                            <tr key={requestInfo.ID}>
                                <td>{requestInfo.ID}</td>
                                <td className="text-nowrap">{requestInfo.ProductFolio}</td>
                                <td>{requestInfo.Quantity}</td>
                                <td className="text-nowrap">{requestInfo.UserFullName}</td>
                                <td className={`${requestInfo.Status === 1 ? 'text-danger' : 'text-success'} text-nowrap`}>{request.Status === 1 ? 'En espera' : 'Aceptada'}</td>
                                <td>
                                    <div className="d-flex justify-content-start gap-2">
                                        <Link to={`${requestInfo.ID}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 iconTable text-dark">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
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

export default AdminRequestsPage