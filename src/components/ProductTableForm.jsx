import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useApp from '../hooks/useApp'
import Select from 'react-select'
import Scroll from './Scroll'
import ProductFormTr from './ProductFormTr'

const ProductTableForm = ({ productsArray, setProductsArray, sale, setShow, setProductFolio, productFolio }) => {
    const { products, handleAddProduct } = useApp();

    const { id } = useParams();

    // Select
    const [selectedOption, setSelectedOption] = useState(null)

    const options = products.map(product => {
        const productNew = {
            value : product.Folio, 
            label : `${product.Folio} - ${product.Name}`
        }
    
        return productNew;
    })

    // Modificar select
    const handleSelectChange = (selected) => {
        setSelectedOption(selected)
        setProductFolio(selected.value);
    };

    // Agregar productos al arreglo
    const handleAddProductArray = (folio, assemblyFolio, assemblyGroup = null) => {
        const newArray = handleAddProduct(productsArray, folio, 1, assemblyFolio, assemblyGroup)
        setProductsArray({
            ...sale, 
            Products : newArray
        })
    }

    const handleRemoveProductArray = (productID) => {
        const newArray = productsArray.filter(product => product.Folio !== productID)
        setProductsArray({
            ...sale, 
            Products : newArray
        })
    }

    const handleChangeInfo = (e, folio, assembly = '') => {
        let newArray = []
        if(assembly === '') {
            newArray = productsArray.map(product => product.Folio === folio ? {...product, [e.target.name] : e.target.value} : product)
        } else {
            newArray = productsArray.map(product => product.Folio === folio && product.Assembly === assembly ? {...product, [e.target.name] : e.target.value} : product)
        }
        setProductsArray({
            ...sale, 
            Products : newArray
        })
    }

    return (
        <>
            <div className="d-flex align-items-center gap-2">
                <Select 
                    options={options} 
                    onChange={handleSelectChange} 
                    className="w-100"
                    value={selectedOption}
                />
                <div>
                    <button onClick={() => handleAddProductArray(productFolio)} type="button" className="btn bgPrimary text-nowrap">+ Agregar Producto</button>
                </div>
            </div>

            <Scroll>
                <table className="table table-hover mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>Folio</th>
                            <th>Nombre</th>
                            <th className='text-nowrap'>Precio U.</th>
                            <th>Stock</th>
                            <th>Cantidad</th>
                            <th className="text-nowrap">Porcentaje (%)</th>
                            <th>Importe</th>
                            <th>Ensamble</th>
                            <th colSpan={2}>Observaciones</th>
                            {(productsArray?.length > 1 || !id) && (
                                <th>Acciones</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {sale?.Products?.map(product => (
                            <ProductFormTr
                                key={product + "-pieza"}
                                product={product}
                                sale={sale}
                                handleChangeInfo={handleChangeInfo}
                                handleAddProductArray={handleAddProductArray}
                                handleRemoveProductArray={handleRemoveProductArray}
                                setShow={setShow}
                                array={productsArray}
                            /> 
                        ))}
                    </tbody>
                </table>
            </Scroll>
        </>
    )
}

export default ProductTableForm