import { useState } from "react"
import { useParams } from "react-router-dom"
import formatearDinero from "../helpers/formatearDinero"
import Scroll from "./Scroll"

const ProductFormTr = ({ product, sale, handleChangeInfo, handleAddProductArray, handleRemoveProductArray, setShow }) => {
    const [productFolioObservation, setProductFolioObservation] = useState('')
    const [showProductAccesories, setShowProductAccesories] = useState(false)

    const { id } = useParams();
    
    return (
        <>
            <tr className="tableTr">
                <td className="text-nowrap">{product.Folio}</td>
                <td className="text-nowrap">{product.Name}</td>
                <td className="text-nowrap"><input type="number" name="PricePerUnit" className={`text-dark tableNumber`} value={product.PricePerUnit} onChange={e => handleChangeInfo(e, product.Folio, product.Assembly)}/></td>
                <td className="text-nowrap">{product.Stock ?? product.StockAvaible}</td>
                <td className="text-nowrap"><input type="number" name="Quantity" className={`${product.Quantity > product.StockAvaible && !id ? 'text-danger' : 'text-dark'} tableNumber`} value={product.Quantity} onChange={e => handleChangeInfo(e, product.Folio, product.Assembly)}/></td>
                <td className="text-nowrap"><input type="number" name="Percentage" className="text-dark tableNumber" value={product.Percentage} onChange={e => handleChangeInfo(e, product.Folio, product.Assembly)}/></td>
                <td className="text-nowrap">{formatearDinero((product.Quantity * product.PricePerUnit) * (product.Percentage / 100))}</td>
                <td className="text-nowrap">{product.Assembly ?? 'Pieza'}</td>
                <td className="text-nowrap observationsInputForm">
                    <Scroll>    
                        <div>
                            {productFolioObservation === product.Folio ? (
                                <textarea 
                                    rows={1} 
                                    name="Observations" 
                                    id="observations" 
                                    className="form-control w-100"
                                    defaultValue={product.Observations}
                                    onChange={e => handleChangeInfo(e, product.Folio)}
                                ></textarea>
                            ) : product.Observations}
                        </div>
                    </Scroll>
                </td>

                <td>
                    <div>
                        <button
                            onClick={() => productFolioObservation === '' ? setProductFolioObservation(product.Folio) : setProductFolioObservation('')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                    </div>
                </td>
                                    
                {(sale.Products.length > 1 || !id) && (
                    <td>
                        <div className="d-flex justify-content-between">
                            <button 
                                onClick={() => {
                                    if(id) {
                                        setProductFolio(product.Folio)
                                        setShow(true)
                                    } else {
                                        handleRemoveProductArray(product.Folio)
                                    }
                                }}
                                className="text-danger p-0 w-100 text-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>

                            {product.Folio === showProductAccesories ? (
                                <button
                                    onClick={() => {
                                        setShowProductAccesories('')
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-danger">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            ) : product?.accessories?.length > 0 && (
                                <button
                                    onClick={() => setShowProductAccesories(product.Folio)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-dark">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </td>
                )}
            </tr>

            {showProductAccesories === product.Folio && product.accessories.map(accesory => (
                <tr key={accesory.Folio + '-accessory'}>
                    <td>{accesory.Folio}</td>
                    <td>{accesory.Name}</td>
                    <td>{formatearDinero(+accesory.ListPrice)}</td>
                    <td>{accesory.StockAvaible}</td>
                    <td>0</td>
                    <td>0%</td>
                    <td>{formatearDinero(0)}</td>
                    <td className="text-nowrap" colSpan={2}>{product.Folio}</td>
                    <td colSpan={2}>
                        <div>
                            <button
                                onClick={() => {
                                    handleAddProductArray(accesory.Folio, product.Folio)
                                }}
                                className="btn btn-sm btn-primary w-100"
                            >
                                Agregar
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}

export default ProductFormTr