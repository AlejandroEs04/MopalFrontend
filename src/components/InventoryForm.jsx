import { useState } from 'react';
import useApp from '../hooks/useApp'
import useAuth from '../hooks/useAuth';
import InventoryContainer from './InventoryContainer'
import Scroll from './Scroll';

const InventoryForm = () => {
    const [accesoryQuantity, setAccesoryQuantity] = useState(1);
    const [accesoryFolio, setAccesoryFolio] = useState('');
    const [showAccesories, setShowAccesories] = useState(false)
    const [showProductFolio, setShowProductFolio] = useState('')
    const [productsFiltered, setProductsFiltered] = useState([])
    const { alerta, products, setAlerta, setQuantity, handleAddNewRequest, requestProducts, setRequestProducts, setFolio } = useApp();
    const { auth } = useAuth();

    const handleAddProduct = (folio, quantity) => {
        const product = products.filter(product => product.Folio === folio)[0]

        const newProduct = {
            ProductFolio : folio, 
            Name : product.Name, 
            Discount : 0,
            Quantity : quantity, 
            Accesories : product.accessories
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

    const handleDeleteProduct = (folio) => {
        const newArray = requestProducts.filter(product => product.ProductFolio !== folio);
        setRequestProducts(newArray);
    }

    return (
        <>
            <InventoryContainer 
                alerta={alerta}
                setAlerta={setAlerta}
                requestProducts={requestProducts}
                setRequestProducts={setRequestProducts}
                handleAddProduct={handleAddProduct}
                productsFiltered={productsFiltered}
                setProductsFiltered={setProductsFiltered}
            />

            <div className='d-flex justify-content-between align-items-center py-2 border-top'>
                <h3>Listado de productos</h3>
                <div>
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                            if(auth.ID) {
                                handleAddNewRequest(auth.ID, requestProducts)
                            } else {
                                console.log('cotizando...')
                            }
                        }}
                        disabled={requestProducts.length === 0}
                    >
                        {auth.ID ? 'Solicitar' : 'Cotizar'}
                    </button>
                </div>
            </div>
            {requestProducts?.length > 0 ? (
                <Scroll>
                    <table className='table table-hover'>
                        <thead className='table-light'>
                            <tr>
                                <th>Folio</th>
                                <th>Nombre</th>
                                <th>Cantidad solicitada</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {requestProducts?.map(product => (
                                <>
                                    <tr key={product.ProductFolio}>
                                        <td>{product.ProductFolio}</td>
                                        <td>{product.Name}</td>
                                        <td>{product.Quantity}</td>
                                        <td>
                                            <div>
                                                <button
                                                    className='btn btn-danger btn-sm'
                                                    onClick={() => handleDeleteProduct(product.ProductFolio)}
                                                    >Eliminar</button>

                                                {product.ProductFolio === showProductFolio ? (
                                                    <button
                                                        onClick={() => {
                                                            setShowAccesories(false)
                                                            setShowProductFolio('')
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-danger">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                ) : product.Accesories.length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setShowAccesories(true)
                                                            setShowProductFolio(product.ProductFolio)
                                                        }}
                                                    >   
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-dark">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    </tr>

                                    {showAccesories && product?.Accesories?.map(accesory => product.ProductFolio === showProductFolio && (
                                        <tr>
                                            <td className='fs-6 fw-light'>{accesory.Folio}</td>
                                            <td className='fs-6 fw-light'>{accesory.Name}</td>
                                            <td className='fs-6 fw-light'>
                                                <div className='d-flex gap-2'>
                                                    <input 
                                                        type="number" 
                                                        placeholder='Numero de piezas' 
                                                        className='form-control form-control-sm w-50'
                                                        onChange={e => {
                                                            setAccesoryFolio(accesory.Folio)
                                                            setAccesoryQuantity(e.target.value)
                                                        }} 
                                                    />
                                                    <p className={`${accesoryQuantity > accesory.StockAvaible ? 'text-danger' : 'text-dark'} m-0 text-nowrap fw-medium w-50`}>Disponible: {accesory.StockAvaible}</p>
                                                </div>
                                            </td>
                                            <td className='fs-6 fw-light'>
                                                <div>
                                                    <button 
                                                        className='btn btn-sm btn-primary'
                                                        disabled={accesoryQuantity <= 0 || accesoryFolio !== accesory.Folio || accesoryQuantity > accesory.StockAvaible}
                                                        onClick={() => handleAddProduct(accesoryFolio, accesoryQuantity)}
                                                    >
                                                        Agregar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </Scroll>
            ) : (
                <p>No hay productos en la lista</p>
            )}
        </>
    )
}

export default InventoryForm