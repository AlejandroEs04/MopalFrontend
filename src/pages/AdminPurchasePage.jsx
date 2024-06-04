import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import PaginationList from "../components/PaginationList";

const AdminPurchasePage = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [active, setActive] = useState(1)
    const [status, setStatus] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [purchaseFiltered, setPurchaseFiltered] = useState([])

    const { pathname } = useLocation();
    const { purchases, alerta } = useAdmin()

    useEffect(() => {
        if(searchText !== "") {
            const filtered = purchases?.filter(purchase => {
                const folioMatch = purchase?.Folio?. toString().toLowerCase().includes(searchText?.toLowerCase());
                const supplierMatch = purchase?.BusinessName?.toLowerCase().includes(searchText?.toLowerCase());
                const userMatch = purchase?.User?.toLowerCase().includes(searchText?.toLowerCase());

                return supplierMatch || userMatch || folioMatch
            });

            setPurchaseFiltered(filtered)
        } else {
            setPurchaseFiltered(purchases)
        }
    }, [searchText])

    
    useEffect(() => {
        if(+active === 2) {
            setPurchaseFiltered(purchases)
        } else {
            const filtered = purchases?.filter(purchase => purchase.Active === +active)
            setPurchaseFiltered(filtered)
        }
    }, [active])
    
    useEffect(() => {
        if(+status === 0) {
            setPurchaseFiltered(purchases)
        } else {
            const filtered = purchases?.filter(purchase => purchase.StatusID === +status)
            setPurchaseFiltered(filtered)
        }
    }, [status])
    
    useEffect(() => {
        const filtered = purchases?.filter(purchase => purchase.Active === 1)
        setPurchaseFiltered(filtered)
    }, [purchases])

    return (
        <div className="mt-2">
            <h1 className='m-0'>Compras</h1>
            {pathname && (
                <Link to={`form`} className='btnAgregar fs-5'>+ Generar nueva compra</Link>
            )}
            
            <div className="mb-3 mt-2">
                <div className="d-flex gap-2">
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

                {showFilters && (
                    <div className="row mt-2">
                        <div className="col-md-3 col-sm-3 col-xl-2">
                            <label htmlFor="status">Estatus</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="form-select form-select-sm" id="status">
                                <option value="0">Todos</option>
                                <option value="1">Generada</option>
                                <option value="2">Recibida</option>
                            </select>
                        </div>

                        <div className="col-md-3 col-sm-3 col-xl-2">
                            <label htmlFor="estado">Activo</label>
                            <select value={active} onChange={e => setActive(e.target.value)} className="form-select form-select-sm" id="estado">
                                <option value="2">Todos</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {alerta && (
                <p className={`alert mt-3 ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <PaginationList 
                items={purchaseFiltered}
                type={2}
                limit={15}
                actionStorage={false}
            />
        </div>
    )
}

export default AdminPurchasePage