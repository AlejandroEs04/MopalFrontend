import useApp from '../hooks/useApp'
import InventoryContainer from '../components/InventoryContainer'
import Scroll from '../components/Scroll'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

const InventoryPage = () => {
    const { alerta, setAlerta, handleAddNewRequest, requestProducts, setRequestProducts } = useApp();
    const { auth } = useAuth();

    const handleDeleteProduct = (folio) => {
        const newArray = requestProducts.filter(product => product.ProductFolio !== folio);
        setRequestProducts(newArray);
    }

    return (
        <>
            <Scroll>
                <InventoryContainer 
                    alerta={alerta}
                    setAlerta={setAlerta}
                    requestProducts={requestProducts}
                    setRequestProducts={setRequestProducts}
                />
            </Scroll>

            <div className='d-flex justify-content-between align-items-center py-2 border-top'>
                <h3>Listado de productos</h3>
                <div>
                    <button
                        className='btn btn-primary'
                        onClick={() => handleAddNewRequest(auth.ID, requestProducts)}
                        disabled={!auth.ID || requestProducts.length === 0}
                    >
                        Solicitar
                    </button>
                </div>
            </div>
            {requestProducts?.length > 0 ? (
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
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay productos en la lista</p>
            )}
        </>
        
  )
}

export default InventoryPage