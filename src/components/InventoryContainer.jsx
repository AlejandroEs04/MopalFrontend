import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import useApp from "../hooks/useApp"
import useAuth from "../hooks/useAuth"
import styles from '../styles/Inventory.module.css'
import Spinner from "./Spinner"

const InventoryContainer = ({ fullPage = false, setRequestProducts, requestProducts }) => {
    const [msg, setMsg] = useState('Favor de seleccionar un producto')
    const [productsFiltered, setProductsFiltered] = useState([])
    const { products, language, alerta, loading, folio, setFolio, quantity, setQuantity, handleChangeQuantity } = useApp();
    const { auth } = useAuth();

    const handleSetProducto = () => {
        const filtered = products?.filter(product => {
            if(folio !== "") {
                const folioMatch = product.Folio.includes(folio);
                // const folioMatch = product.Folio === folio;
                const isAcive = product.Active === 1;
                const stock = product.StockAvaible > 0;
                return folioMatch && isAcive && stock;
            } else {
                setMsg('Debe elegir algun producto')
            }
        });

        if(filtered.length === 0 && folio !== "") {
            setMsg("El producto no existe o no esta disponible")
        }
        
        setProductsFiltered(filtered)
    }

    const handleAddProduct = (folio, quantity) => {
        const product = products.filter(product => product.Folio === folio)

        const newProduct = {
            ProductFolio : folio, 
            Name : product[0].Name, 
            Discount : 0,
            Quantity : quantity
        }

        const existArray = requestProducts.filter(product => product.ProductFolio === folio)
        
        if(existArray.length === 0) {
            setRequestProducts([
                ...requestProducts, 
                newProduct
            ])
        } else {
            const newArray = requestProducts.map(product => product.ProductFolio === folio ? newProduct : product)
            setRequestProducts(newArray)
        }

        setFolio('')
        setQuantity(0)
        setProductsFiltered([])
    }

    return (
        <div className="my-2">
            <h1>{language ? 'Inventory' : 'Inventario'}</h1>
            <p>{language ? 'Search on the input any interest product for your for check your available' : 'Busque en la barra el producto de su interes para comprobar el inventario actual'}</p>

            <div>
                <label htmlFor="search">{language ? 'Enter the product' : 'Ingrese el producto'}</label>
                <div className="d-flex gap-2">
                    <input type="search" id="search" value={folio} onChange={e => setFolio(e.target.value)} className='form-control' placeholder='Ej. 300300-11010169' />
                    <button 
                        onClick={() => handleSetProducto()}
                        className='btn d-flex align-items-center gap-1 btn-secondary'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <p className='m-0'>Buscar</p>
                    </button>
                </div>
            </div>

            {alerta && (
                <p className={`alert my-3 ${alerta.error ? 'alert-warning' : 'alert-success'}`}>{language ? alerta.msgEnglish : alerta.msg}</p>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <table className='table table-striped mt-3 table-bordered'>
                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>{language ? 'Name' : 'Nombre'}</th>
                            <th>{language ? 'Current Inventory' : 'Inventario Actual'}</th>
                            <th>{language ? 'Required Quantity' : 'Cantidad requerida'}</th>
                            <th>{language ? 'Actions' : 'Acciones'}</th>
                        </tr>
                    </thead>
                            
                    {productsFiltered.length > 0 ? (
                        <>
                            {productsFiltered?.map(product => (
                                <tbody key={product.Folio}>
                                    <tr>
                                        <td>{product.Folio}</td>
                                        <td>{product.Name}</td>
                                        <td>{product.StockAvaible}</td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className='form-control form-control-sm' 
                                                placeholder={language ? 'Enter a products quantity' : 'Ingrese la cantidad de productos'}
                                                onChange={e => handleChangeQuantity(e.target.value, product.StockAvaible)}
                                            />
                                        </td>

                                        <td>
                                            <div>
                                                {auth.ID ? (
                                                    <button
                                                        disabled={quantity <= 0}
                                                        onClick={() => handleAddProduct(product.Folio, quantity)}
                                                        className='btn btn-sm btn-success w-100'
                                                    >{language ? 'Add' : 'Agregar'}</button>
                                                ) : (
                                                    <Link
                                                        to={'/contacto'}
                                                        disabled={quantity <= 0}
                                                        className='btn btn-sm btn-primary w-100'
                                                    >{language ? 'Quote' : 'Cotizar'}</Link>
                                                )}     
                                            </div>                               
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={5} className='fw-medium'>{msg}</td>
                            </tr>
                        </tbody>
                    )}                        
                </table>
            )}
        </div>
    )
}

export default InventoryContainer