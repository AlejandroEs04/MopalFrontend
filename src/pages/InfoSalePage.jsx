import { useParams, useNavigate, Link } from "react-router-dom"
import useAdmin from "../hooks/useAdmin";
import { useEffect, useState } from "react";
import formatearFecha from "../helpers/formatearFecha";
import Spinner from "../components/Spinner";
import findLastID from "../helpers/findLastID ";
import findNextID from "../helpers/findNextID";

const InfoSalePage = () => {
    const [sale, setSale] = useState({});

    const { id } = useParams();
    const { sales, handleChangeStatus, alerta, loading } = useAdmin();

    const formatearDinero = cantidad => {
        return cantidad.toLocaleString('en-US', {
            style: "currency",
            currency: 'USD', 
            minimumFractionDigits: 2,
        })
    }

    const handleGetTypes = () => {
        let array = []

        if(+sale?.StatusID === 1) {
            array = sales.filter(sale => sale?.StatusID === 1);
        } else {
            array = sales.filter(sale => sale?.StatusID > 1);
        }
        return array
    }

    const handleNextQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetTypes()
            return findNextID(quotations, id)
        }
    }
    
    const handleLastQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetTypes()
            return findLastID(quotations, id)
        }
    }
    

    const handleGetSale = () => {
        const saleId = sales?.filter(sale => +sale?.Folio === +id)
        setSale(saleId[0]);
    }
   
    const handleGetImporte = (price, quantity, discount) => {
        const importe = (price * quantity) * (1 - (discount / 100))
        return importe.toFixed(2)
    }

    useEffect(() => {
        handleGetSale();
    }, [sales, id])

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between mb-4">
                <Link to={-1} className="backBtn text-decoration-none text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                    <p>Back</p>
                </Link>

                <div className="d-flex gap-3">
                    <Link to={`/info/sales/${handleLastQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <p>Anterior</p>
                    </Link>

                    <Link to={`/info/sales/${handleNextQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <p>Siguiente</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
                <h1>Informacion de la {+sale?.StatusID === 1 ? 'Cotizacion' : 'Venta'}</h1>
                <div>
                    {+sale?.StatusID < 4 && sale?.Active === 1 && (
                        <button
                            className={`
                                btn
                                ${+sale?.StatusID === 2 && 'btn-warning fw-bold'}
                                ${+sale?.StatusID === 3 && 'btn-success fw-bold'}
                            `}
                            onClick={() => handleChangeStatus('sales', sale?.Folio, (sale?.StatusID + 1))}
                        >
                            {+sale?.StatusID === 2 && 'En reparto'}
                            {+sale?.StatusID === 3 && 'Entregado'}
                        </button>
                    )}
                </div>
            </div>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <div className="pb-4">
                    <p className="mb-1 fw-bold">Folio: <span className="fw-normal">{sale?.Folio}</span></p>
                    <p className="mb-1 fw-bold">Fecha de la venta: <span className="fw-normal">{formatearFecha(sale?.SaleDate)}</span></p>
                    <p className="mb-1 fw-bold">
                        Estado: <span className={`${+sale?.StatusID === 1 && 'text-success'} ${+sale?.StatusID === 2 && 'text-danger'} ${+sale?.StatusID === 3 && 'text-warning'} ${+sale?.StatusID === 4 && 'text-success'} fw-normal`}>{sale?.Status}</span>
                    </p>
                    <p className="mb-1 fw-bold">Activo: <span className={`fw-normal ${sale?.Active === 1 ? 'text-success' : 'text-danger'}`}>{sale?.Active === 1 ? 'Activo' : 'Inactivo'}</span></p>
                    <p className="mb-1 fw-bold">Observaciones: <span className="fw-normal">{sale?.Observation}</span></p>

                    <h3 className="mt-4">Informacion del cliente</h3>
                    <p className="mb-1 fw-bold">Direccion de entrega: <span className="fw-normal">{sale?.Address}</span></p>
                    <p className="mb-1 fw-bold">Razon social: <span className="fw-normal">{sale?.BusinessName}</span></p>
                    <p className="mb-1 fw-bold">RFC: <span className="fw-normal">{sale?.RFC}</span></p>

                    {sale?.CustomerUserID && (
                        <>
                            <h4 className="mt-3">Información del usuario</h4>
                            <p className="mb-1 fw-bold">ID del usuario: <span className="fw-normal">{sale?.CustomerUserID}</span></p>
                            <p className="mb-1 fw-bold">Nombre del usuario: <span className="fw-normal">{sale?.CustomerUserName}</span></p>
                            <p className="mb-1 fw-bold">Email del usuario: <span className="fw-normal">{sale?.CustomerUserEmail}</span></p>
                            <p className="mb-1 fw-bold">Dirección del usuario: <span className="fw-normal">{sale?.CustomerUserAddress}</span></p>
                        </>
                    )}


                    <h3 className="mt-4">Informacion de los productos</h3>
                    <table className="table table-hover">
                        <thead className="table-secondary">
                            <tr>
                                <th>Folio</th>
                                <th>Precio</th>
                                <th>Descuento</th>
                                <th>Cantidad</th>
                                <th>Importe</th>
                                <th>Total (IVA %)</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sale?.Products?.map(product => (
                                <tr>
                                    <td>{product.Folio}</td>
                                    <td>{formatearDinero(+product.ListPrice)}</td>
                                    <td>{product.Discount}</td>
                                    <td>{product.Quantity}</td>
                                    <td>{formatearDinero(+handleGetImporte(product.ListPrice, product.Quantity, product.Discount)) + " " + sale?.Acronym}</td>
                                    <td>{formatearDinero(+handleGetImporte(product.ListPrice, product.Quantity, product.Discount) + (+handleGetImporte(product.ListPrice, product.Quantity, product.Discount) * .16)) + " " + sale?.Acronym}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="mt-5">Informacion del vendedor</h3>
                    <p className="mb-1 fw-bold">Usuario responsable: <span className="fw-normal">{sale?.User}</span></p>
                </div>
            )}
            
        </div>
    )
}

export default InfoSalePage