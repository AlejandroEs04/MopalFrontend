import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from "axios";
import useApp from "../hooks/useApp";

const CrudProductPage = () => {
    // Inicializar alerta 
    const [alerta, setAlerta] = useState(null);

    // Inputs
    const [folio, setFolio] = useState('');
    const [productListID, setProductListID] = useState(0);
    const [description, setDescription] = useState('');
    const [listPrice, setListPrice] = useState(0);
    const [typeID, setTypeID] = useState(0);
    const [classificationID, setClassificationID] = useState(0);
    const [stock, setStock] = useState(0);

    // Get informacion
    const { types, classifications, products, productsList } = useApp();

    const navigate = useNavigate();
    const { id } = useParams();

    const checkInfo = useCallback(() => {
        return productListID === 0 ||
            folio === '' ||
            description === '' ||
            listPrice <= 0 ||
            +typeID === 0 ||
            +classificationID === 0 
    }, [folio, productListID, description, listPrice, typeID, classificationID])

    useEffect(() => {
        checkInfo()
    }, [folio, productListID, description, listPrice, typeID, classificationID])

    const handleAddProduct = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            let response 

            if(id) {
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/products`, {
                    product : {
                        Folio : folio.trim(), 
                        ProductListID : +productListID, 
                        Description : description, 
                        ListPrice : listPrice, 
                        TypeID : typeID, 
                        ClassificationID : classificationID, 
                        StockAvaible : stock
                    }
                }, config)

                response = data
            } else {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
                    product : {
                        Folio : folio.trim(), 
                        ProductListID : +productListID, 
                        Description : description, 
                        ListPrice : listPrice, 
                        TypeID : typeID, 
                        ClassificationID : classificationID, 
                        StockAvaible : stock
                    }
                }, config)

                response = data
            }

            setAlerta({
                error: false, 
                msg: response.msg
            })

            navigate(``)

            setFolio(data.folio)
        } catch (error) {
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })
        }
    }

    useEffect(() => {
        if(id) {
            const product = products?.filter(product => product.Folio === id);

            if(product.length > 0) {
                setFolio(product[0].Folio)
                setDescription(product[0].Description)
                setListPrice(product[0].ListPrice)
                setTypeID(product[0].TypeID)
                setClassificationID(product[0].ClassificationID)
                setStock(product[0].StockAvaible)
                setProductListID(product[0].ProductListID)
            }
        }
    }, [products])

    return (
        <div className="container my-5">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>
            <h2>Crear Producto</h2>
            <p className="mb-1">Ingresa los datos que se solicitan para dar de alta un nuevo producto</p>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <form className="row">
                <div className="col-lg-6 d-flex flex-column gap-3">
                    <div className={`d-flex flex-column`}>
                        <label htmlFor="folio" className="fw-bold fs-6">Folio</label>
                        <input 
                            type="text" 
                            id="folio"
                            placeholder="Folio del Producto" 
                            value={folio}
                            onChange={e => setFolio(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className={`d-flex flex-column`}>
                        <div className="d-flex justify-content-between">
                            <label htmlFor="productListID" className="fw-bold fs-6">Nombre</label>
                            <Link to={'/admin/productsList/form'} className="fs-6 text-black fw-medium text-decoration-none">+ Agregar Lista de productos</Link>
                        </div>
                        <select 
                            name="productListID" 
                            id="productListID" 
                            className="form-select"
                            value={productListID}
                            onChange={e => setProductListID(e.target.value)}
                        >
                            <option value="0">Seleccione una lista de productos</option>
                            {productsList?.map(productList => (
                                <option key={productList.ID} value={productList.ID}>{productList.Name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`d-flex flex-column`}>
                        <label htmlFor="description" className="fw-bold fs-6">Descripcion</label>
                        <textarea 
                            id="description" 
                            className="form-control"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                        ></textarea>
                    </div>
                </div>

                <div className="col-lg-6 d-flex flex-column gap-3">
                    <div className="row g-3">
                        <div className="col-sm-6">
                        <div className={`d-flex flex-column`}>
                            <label htmlFor="listPrice" className="fw-bold fs-6">Precio lista (USD)</label>
                            <input 
                                type="number" 
                                id="listPrice"
                                placeholder="Precio lista" 
                                value={listPrice}
                                onChange={e => setListPrice(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        </div>

                        <div className="col-sm-6">
                        <div className={`d-flex flex-column`}>
                            <label htmlFor="type" className="fw-bold fs-6">Tipo de producto</label>
                            <select value={typeID} id="type" className="form-select" onChange={e => setTypeID(e.target.value)}>
                            <option value="0">SELECCIONE UN TIPO</option>
                            {types?.map(type => (
                                <option key={type.ID} value={type.ID}>{type.Name}</option>
                            ))}
                            </select>
                        </div>
                        </div>

                        <div className="col-sm-6">
                        <div className={`d-flex flex-column`}>
                            <label htmlFor="classification" className="fw-bold fs-6">Clasificacion</label>
                            <select value={classificationID} id="classification" className="form-select" onChange={e => setClassificationID(e.target.value)}>
                            <option value="0">SELECCIONE UNA CLASIFICACION</option>
                            {classifications?.map(classification => (
                                <option key={classification.ID} value={classification.ID}>{classification.Name}</option>
                            ))}
                            </select>
                        </div>
                        </div>

                        <div className="col">
                        <div className={`d-flex flex-column`}>
                            <label htmlFor="stock" className="fw-bold fs-6">Stock</label>
                            <input 
                                type="number" 
                                id="stock"
                                placeholder="Stock Disponible" 
                                value={stock}
                                onChange={e => setStock(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        </div>
                    </div>

                    <div>
                        <button 
                            type="button"
                            className={`btn ${checkInfo() ? 'bgIsInvalid' : 'bgPrimary'} w-100`}
                            disabled={checkInfo()}
                            onClick={() => handleAddProduct()}
                        >Guardar Producto</button>

                        {id && classificationID === 1 && (
                            <Link 
                                to="accessory"
                                className={`btn mt-2 btn-secondary w-100`}
                                disabled={checkInfo()}
                            >Configurar Producto</Link>
                        )}
                    </div>

                    
                </div>
            </form>
        </div>
    )
}

export default CrudProductPage