import { useEffect, useState } from "react"
import formatearDinero from "../helpers/formatearDinero"

const RequestInfoTr = ({ product, request, setRequest }) => {
    const [percentage, setPercentage] = useState(product.Percentage)

    useEffect(() => {

    }, [])

    return (
        <>
            <tr key={product.ProductFolio}>
                <td className="text-nowrap">{product.ProductFolio}</td>
                <td className="text-nowrap">{product.ProductName}</td>
                <td>{product.Quantity}</td>
                <td>{product.StockAvaible}</td>
                <td>{formatearDinero(+product.ListPrice)}</td>
                <td>
                    <input 
                        type="number" 
                        name="percentage" 
                        id="percentageProduct" 
                        value={percentage} 
                        className="form-control form-control-sm" 
                    />
                </td>
                <td className="text-nowrap">{product.Assembly ?? 'Pieza'} {product.Assembly === '' && 'Pieza'}</td>
            </tr>

            {request?.products?.map(assembly => assembly.Assembly === product.ProductFolio && (
                <tr key={assembly.ProductFolio}>
                    <td className="text-nowrap">{assembly.ProductFolio}</td>
                    <td className="text-nowrap">{assembly.ProductName}</td>
                    <td>{assembly.Quantity}</td>
                    <td>{assembly.StockAvaible}</td>
                    <td>{formatearDinero(+assembly.ListPrice)}</td>
                    <td>{assembly?.Percentage}</td>
                    <td className="text-nowrap">{assembly.Assembly}</td>
                </tr>
            ))}
        </>
    )
}

export default RequestInfoTr