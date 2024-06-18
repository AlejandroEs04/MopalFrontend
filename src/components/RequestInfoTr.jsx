import { useEffect, useState } from "react"
import formatearDinero from "../helpers/formatearDinero"

const RequestInfoTr = ({ product, request, setRequest, setEdited }) => {
    const [percentage, setPercentage] = useState(product.Percentage)

    const handleChange = (folio, e) => {
        const products = request.products.map(product => product.ProductFolio === folio ? {
            ...product, 
            [e.target.name] : e.target.value 
        } : product )

        request.products = products

        setRequest(request)
        setPercentage(e.target.value)
        setEdited(true)
    }

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
                        name="Percentage" 
                        id="percentageProduct" 
                        disabled={request?.Status !== 1}
                        value={percentage} 
                        className="form-control form-control-sm" 
                        onChange={e => handleChange(product.ProductFolio, e)}
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