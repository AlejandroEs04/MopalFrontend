import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import DeletePop from "../components/DeletePop";
import Scroll from "../components/Scroll";
import axios from "axios";
import PaginationList from "../components/PaginationList";

const AdminSalePage = () => {
    const [showPop, setShowPop] = useState(false);
    const [showFilters, setShowFilters] = useState(false)
    const [active, setActive] = useState(1)
    const [status, setStatus] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [folio, setFolio] = useState(null)
    const [saleFiltered, setSaleFiltered] = useState([])
    const { pathname } = useLocation();
    const { sales, alerta, handleDeleteSale } = useAdmin()

    useEffect(() => {
        setSaleFiltered(sales)
    }, [sales])

    useEffect(() => {
        if(searchText !== "") {
            const filtered = sales?.filter(sale => {
                const folioMatch = sale?.Folio?. toString().toLowerCase().includes(searchText?.toLowerCase());
                const supplierMatch = sale?.BusinessName?.toLowerCase().includes(searchText?.toLowerCase());
                const userMatch = sale?.User?.toLowerCase().includes(searchText?.toLowerCase());

                return supplierMatch || userMatch || folioMatch
            });

            setSaleFiltered(filtered)
        } else {
            setSaleFiltered(sales)
        }
    }, [searchText])

    useEffect(() => {
        if(+active === 2) {
            const filtered = sales?.filter(sale => +sale.StatusID > 1)
            setSaleFiltered(filtered)
        } else {
            const filtered = sales?.filter(sale => +sale.Active === +active && +sale.StatusID > 1)
            setSaleFiltered(filtered)
        }
    }, [active])

    useEffect(() => {
        if(+status === 0) {
            const filtered = sales?.filter(sale => sale.StatusID > 1)
            setSaleFiltered(filtered)
        } else {
            const filtered = sales?.filter(sale => sale.StatusID === +status)
            setSaleFiltered(filtered)
        }
    }, [status])

    useEffect(() => {
        const filtered = sales?.filter(sale => sale.StatusID > 1 && sale.Active === 1)
        setSaleFiltered(filtered)
    }, [sales])

    const handleBtnDelete = () => {
        handleDeleteSale(folio)
        setFolio(null)
    };

    return (
        <div className="mt-2">
            <h1 className='m-0'>Ventas</h1>
            {pathname && (
                <Link to={`${pathname}/form`} className='btnAgregar fs-5'>+ Generar nueva venta</Link>
            )}
            
            <div className="mt-2 mb-3">
                <div className="d-flex gap-2">
                    <input 
                        type="search" 
                        id="searchBar" 
                        className="form-control form-control-sm" 
                        placeholder="Busque una venta" 
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
                                <option value="2">Realizada</option>
                                <option value="3">En camino</option>
                                <option value="4">Entregada</option>
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
                <p className={`alert mt-3 ${alerta.error ? 'alert-warning' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <PaginationList 
                items={saleFiltered}
                type={1}
                limit={15}
                actionStorage={false}
            />
        </div>
    )
}

export default AdminSalePage