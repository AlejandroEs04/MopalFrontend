import React, { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import PaginationList from '../components/PaginationList'
import Sale from '../models/Sale'

const AdminStoragePage = () => {
    const [showSales, setShowSales] = useState(false)
    const [showRequest, setShowRequest] = useState(false)
    const [salesFiltered, setSalesFiltered] = useState([])
    const [showPurchase, setShowPurchase] = useState(false)
    const [purchaseFiltered, setPurchaseFiltered] = useState([])
    const [requestFiltered, setRequestFiltered] = useState([])
    const { purchases, sales, request } = useAdmin()

    let saleKeys = []

    for(var key in new Sale()) {
        saleKeys.push(key)
    }

    useEffect(() => {
        const salesNew = sales?.filter(sale => sale.Status === "Realizada");
        setSalesFiltered(salesNew)
        
        const purchasesNew = purchases?.filter(purchase => purchase.Status === "Generada");
        setPurchaseFiltered(purchasesNew)
        
        const requestNew = request?.filter(request => request.Status === 2);
        setRequestFiltered(requestNew)
    }, [sales, purchases])

    return (
        <div className='my-4'>
            <h1>Almacén</h1>
            <div className='d-flex flex-column gap-3'>
                <div>
                    <div className='d-flex justify-content-between align-items-centers bg-light text-dark px-4 py-3'>
                        <h3 className='m-0'>Ventas <span className='fw-normal fs-5'>(Entregas pendientes)</span></h3>
                        <div>
                            <button 
                                onClick={() => setShowSales(!showSales)}
                                className='btn btn-dark btn-sm position-relative'
                            >
                                {showSales ? "Ocultar" : "Mostrar"} Ventas
                                <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                                    {salesFiltered.length}
                                    <span className="visually-hidden">Products on list</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {showSales && (
                        <PaginationList 
                            items={salesFiltered}
                            type={1}
                        />
                    )}
                </div>
                
                <div>
                    <div className='d-flex justify-content-between align-items-centers bg-light text-dark px-4 py-3'>
                        <h3 className='m-0'>Compras <span className='fw-normal fs-5'>(Pendientes)</span></h3>
                        <div>
                            <button 
                                onClick={() => setShowPurchase(!showPurchase)}
                                className='btn btn-dark btn-sm position-relative'
                            >{
                                showPurchase ? "Ocultar" : "Mostrar"} Compras
                                <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                                    {purchaseFiltered.length}
                                    <span className="visually-hidden">Products on list</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {showPurchase && (
                        <PaginationList 
                            items={purchaseFiltered}
                            type={2}
                        />
                    )}
                </div>
                
                <div>
                    <div className='d-flex justify-content-between align-items-centers bg-light text-dark px-4 py-3'>
                        <h3 className='m-0'>Solicitudes <span className='fw-normal fs-5'>(Entregas pendientes)</span></h3>
                        <div>
                            <button 
                                onClick={() => setShowRequest(!showRequest)}
                                className='btn btn-dark btn-sm position-relative'
                            >{
                                showPurchase ? "Ocultar" : "Mostrar"} Solicitudes
                                <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                                    {requestFiltered.length}
                                    <span className="visually-hidden">Products on list</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {showRequest && (
                        <PaginationList 
                            items={requestFiltered}
                            type={3}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminStoragePage