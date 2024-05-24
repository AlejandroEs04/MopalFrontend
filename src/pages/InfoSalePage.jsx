import { useParams, useNavigate } from "react-router-dom"
import useAdmin from "../hooks/useAdmin";
import { useEffect, useState } from "react";
import formatearFecha from "../helpers/formatearFecha";
import Spinner from "../components/Spinner";

const InfoSalePage = () => {
    const [sale, setSale] = useState({});

    const { id } = useParams();
    const { sales, handleChangeStatus, alerta, loading } = useAdmin();

    const navigate = useNavigate();

    const formatearDinero = cantidad => {
        return cantidad.toLocaleString('en-US', {
            style: "currency",
            currency: 'USD', 
            minimumFractionDigits: 2,
        })
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
    }, [sales])

    return (
        <div className="container my-4">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <div className="d-flex justify-content-between align-items-center">
                <h1>Informacion de la venta</h1>
                <div>
                    {+sale?.StatusID < 4 && (
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
                <div>
                    <p className="mb-1 fw-bold">Folio: <span className="fw-normal">{sale?.Folio}</span></p>
                    <p className="mb-1 fw-bold">Fecha de la venta: <span className="fw-normal">{formatearFecha(sale?.SaleDate)}</span></p>
                    <p className="mb-1 fw-bold">
                        Estado: <span className={`${+sale?.StatusID === 2 && 'text-danger'} ${+sale?.StatusID === 3 && 'text-warning'} ${+sale?.StatusID === 4 && 'text-success'} fw-normal`}>{sale?.Status}</span>
                    </p>

                    <h4 className="mt-4">Informacion del cliente</h4>
                    <p className="mb-1 fw-bold">Direccion de entrega: <span className="fw-normal">{sale?.Address}</span></p>
                    <p className="mb-1 fw-bold">Razon social: <span className="fw-normal">{sale?.BusinessName}</span></p>
                    <p className="mb-1 fw-bold">RFC: <span className="fw-normal">{sale?.RFC}</span></p>

                    <h4 className="mt-4">Informacion del vendedor</h4>
                    <p className="mb-1 fw-bold">Usuario responsable: <span className="fw-normal">{sale?.User}</span></p>

                    <h4 className="mt-4">Informacion de los productos</h4>
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
                </div>
            )}
            
        </div>
    )
}

export default InfoSalePage