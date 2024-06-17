import { useParams, useNavigate } from "react-router-dom"
import useAdmin from "../hooks/useAdmin";
import { useEffect, useMemo, useState } from "react";
import formatearDinero from "../helpers/formatearDinero";
import Spinner from "../components/Spinner";
import formatearFecha from "../helpers/formatearFecha";
import PurchasePdf from "../pdf/PurchasePdf";

const InfoPurchasePage = () => {
    const [purchase, setPurchase] = useState({});

    const { id } = useParams();
    const { purchases, handleChangeStatus, alerta, loading } = useAdmin();

    const navigate = useNavigate();

    const handleGetPurchase = () => {
        const purchaseNew = purchases?.filter(purchase => +purchase?.Folio === +id)
        setPurchase(purchaseNew[0]);
    }
   
    const handleGetImporte = (price, quantity, discount) => {
        const importe = (price * quantity) * (1 - (discount / 100))
        return importe.toFixed(2)
    }

    const subtotal = useMemo(() => purchase?.Products?.reduce((total, product) => total + (product.Quantity * product.ListPrice), 0), [purchase])
    const iva = useMemo(() => purchase?.Products?.reduce((total, product) => total + (product.Quantity * (product.ListPrice * .16)), 0), [purchase])
    const total = useMemo(() => subtotal + iva, [purchase])

    useEffect(() => {
        handleGetPurchase();
    }, [purchases])

    return (
        <div className="container my-4">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <div className="d-flex justify-content-between align-items-center">
                <h1>Informacion de la compra</h1>
                <div className="d-flex gap-2">
                    <PurchasePdf 
                        ordenCompra={purchase}
                        subtotal={subtotal}
                        iva={iva}
                        total={total}
                    />

                    <button
                        className={`
                            btn
                            btn-success fw-bold
                        `}
                        disabled={+purchase?.StatusID === 2}
                        onClick={() => handleChangeStatus('purchases', purchase?.Folio, (purchase?.StatusID + 1))}
                    >
                        Recibida
                    </button>
                </div>
            </div>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <div>
                    <p className="mb-1 fw-bold">Folio: <span className="fw-normal">{purchase?.Folio}</span></p>
                    <p className="mb-1 fw-bold">Fecha de la venta: <span className="fw-normal">{formatearFecha(purchase?.PurchaseDate)}</span></p>
                    <p className="mb-1 fw-bold">
                        Estado: <span className={`${+purchase?.StatusID === 1 && 'text-danger'} ${+purchase?.StatusID === 2 && 'text-success'} fw-normal`}>{purchase?.Status}</span>
                    </p>

                    <h4 className="mt-4">Informacion del proveedor</h4>
                    <p className="mb-1 fw-bold">Direccion de entrega: <span className="fw-normal">{purchase?.Address}</span></p>
                    <p className="mb-1 fw-bold">Razon social: <span className="fw-normal">{purchase?.BusinessName}</span></p>
                    <p className="mb-1 fw-bold">RFC: <span className="fw-normal">{purchase?.RFC}</span></p>

                    {purchase?.SupplierUserID && (
                        <>
                            <h4 className="mt-3">Información del usuario</h4>
                            <p className="mb-1 fw-bold">ID del usuario: <span className="fw-normal">{purchase?.SupplierUserID}</span></p>
                            <p className="mb-1 fw-bold">Nombre del usuario: <span className="fw-normal">{purchase?.SupplierUserName}</span></p>
                            <p className="mb-1 fw-bold">Email del usuario: <span className="fw-normal">{purchase?.SupplierUserEmail}</span></p>
                            <p className="mb-1 fw-bold">Dirección del usuario: <span className="fw-normal">{purchase?.SupplierUserAddress}</span></p>
                        </>
                    )}


                    <h4 className="mt-4">Informacion de los productos</h4>
                    <table className="table table-hover">
                        <thead className="table-secondary">
                            <tr>
                                <th>Folio</th>
                                <th>Costo</th>
                                <th>Descuento</th>
                                <th>Cantidad</th>
                                <th>Importe</th>
                                <th>Total (IVA %)</th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchase?.Products?.map(product => (
                                <tr key={product.Folio}>
                                    <td>{product.Folio}</td>
                                    <td>{formatearDinero(+product.ListPrice)}</td>
                                    <td>{product.Discount}</td>
                                    <td>{product.Quantity}</td>
                                    <td>{formatearDinero(+handleGetImporte(product.ListPrice, product.Quantity, product.Discount)) + " " + purchase?.Acronym}</td>
                                    <td>{formatearDinero(+handleGetImporte(product.ListPrice, product.Quantity, product.Discount) + (+handleGetImporte(product.ListPrice, product.Quantity, product.Discount) * .16)) + " " + purchase?.Acronym}</td>
                                </tr>
                            ))}

                            <tr>
                                <td colSpan={4} className="table-active"></td>
                                <th>Subtotal: </th>
                                <td>{formatearDinero(subtotal ?? 0)}</td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="table-active"></td>
                                <th>IVA: </th>
                                <td>{formatearDinero(iva ?? 0)}</td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="table-active"></td>
                                <th>Importe total: </th>
                                <td>{formatearDinero(total ?? 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className="mt-4">Informacion del comprador</h4>
                    <p className="mb-1 fw-bold">Usuario responsable: <span className="fw-normal">{purchase?.User}</span></p>
                </div>
            )}
            
        </div>
    )
}

export default InfoPurchasePage