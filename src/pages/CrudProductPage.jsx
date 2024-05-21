import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import useApp from "../hooks/useApp";
import ProductViewForm from "../components/ProductViewForm";

const CrudProductPage = () => {
    // Inicializar alerta 
    const [alerta, setAlerta] = useState(null);

    // Inputs
    const [folio, setFolio] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [listPrice, setListPrice] = useState(0);
    const [cost, setCost] = useState(0);
    const [typeID, setTypeID] = useState(0);
    const [classificationID, setClassificationID] = useState(0);
    const [stock, setStock] = useState(0);
    const [imageHeaderURL, setImageHeaderURL] = useState("");
    const [imageIconURL, setImageIconURL] = useState("");

    const [productSpecifications, setProductSpecifications] = useState([])

    // Get informacion
    const { types, classifications, products } = useApp();

    const navigate = useNavigate();
    const { id } = useParams();

    const checkInfo = useCallback(() => {
        return name === '' ||
            folio === '' ||
            description === '' ||
            listPrice <= 0 ||
            cost <= 0 ||
            +typeID === 0 ||
            +classificationID === 0 
    }, [folio, name, description, listPrice, cost, typeID, classificationID])

    useEffect(() => {
        checkInfo()
    }, [folio, name, description, listPrice, cost, typeID, classificationID])

    const handleAddProduct = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
                product : {
                    Folio : folio.trim(), 
                    Name : name, 
                    Description : description, 
                    ListPrice : listPrice, 
                    Cost : cost, 
                    TypeID : typeID, 
                    ClassificationID : classificationID, 
                    Stock : stock
                }
            }, config)

            setAlerta({
                error: false, 
                msg: data.msg
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
                setName(product[0].Name)
                setDescription(product[0].Description)
                setListPrice(product[0].ListPrice)
                setCost(product[0].Cost)
                setTypeID(product[0].TypeID)
                setClassificationID(product[0].ClassificationID)
                setStock(product[0].Stock)
                setProductSpecifications(product[0].specifications)
                setImageHeaderURL(product[0].ImageHeaderURL)
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
                        <label htmlFor="name" className="fw-bold fs-6">Nombre</label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder="Nombre del Producto" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="form-control"
                        />
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
                            <label htmlFor="cost" className="fw-bold fs-6">Costo p/pieza (USD)</label>
                            <input 
                                type="number" 
                                id="cost"
                                placeholder="Costo del Producto" 
                                value={cost}
                                onChange={e => setCost(e.target.value)}
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

                    <button 
                        type="button"
                        className={`btn ${checkInfo() ? 'bgIsInvalid' : 'bgPrimary'}`}
                        disabled={checkInfo()}
                        onClick={() => handleAddProduct()}
                    >Guardar Producto</button>
                </div>
            </form>

            <form>
                {id && (
                    <div className="mt-4">
                        {alerta && (
                            <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
                        )}
                        <div>
                            <ProductViewForm 
                                folio={folio}
                                productName={name}
                                productSpecifications={productSpecifications}
                                setAlerta={setAlerta}
                                imageHeaderURL={imageHeaderURL}
                                imageIconURL={imageIconURL}
                                setImageHeaderURL={setImageHeaderURL}
                                setImageIconURL={setImageIconURL}
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default CrudProductPage