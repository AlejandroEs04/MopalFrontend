import { useState, useEffect, useCallback } from "react"
import axios from "axios";
import useAdmin from "../hooks/useAdmin";
import CloudinaryWidget from "./CloudinaryWidget";
import Select from 'react-select'

const ProductViewForm = ({setImageHeaderURL, imageHeaderURL, setImageIconURL, imageIconURL, folio, productName, productSpecifications, setAlerta}) => {
    const [specificationsArray, setSpecificationsArray] = useState([]);
    const [speInput, setSpeInput] = useState(false)
    const [charInput, setCharInput] = useState(false)
    const [charType, setCharType] = useState(0)
    const [newHeaderImage, setNewHeaderImage] = useState("");
    const [newIconImage, setNewIconImage] = useState("");
    const [cloudinaryHeader, setCloudinaryHeader] = useState(false);

    const { specifications } = useAdmin();

    // Inicializar select
    const [speSelected, setSpeSelected] = useState(null)
    const [valueSpe, setValueSpe] = useState('')

    const speOptions = specifications?.map(specification => {
        const speNew = {
            value : specification.ID, 
            label : specification.Name
        }

        return speNew
    })

    const handleSelectSpe = (selected) => {
        setSpeSelected(selected)
    }

    // Array add element
    const handleAddSpeArray = () => {
        const existSpecification = productSpecifications?.filter(specification => specification.SpecificationID === speSelected.value)
        
        if(existSpecification.length === 0) {
            setSpecificationsArray([
                ...specificationsArray,
                {
                    SpecificationID : speSelected.value, 
                    SpecificationName : speSelected.label, 
                    ProductFolio :  folio,
                    Value : valueSpe
                }
            ])
        } else {
            setAlerta({
                error: true, 
                msg: "La especificación ya existe"
            })
        }

        setSpeSelected(null)
        setValueSpe('')
        setSpeInput(false)
    }

    const checkArray = useCallback(() => {
        return specificationsArray.length === 0 &&
            newHeaderImage === "" &&
            newIconImage === ""
    }, [specificationsArray, newHeaderImage, newIconImage])

    useEffect(() => {
        checkArray()
    }, [specificationsArray, newHeaderImage, newIconImage])

    useEffect(() => {
        if(newHeaderImage !== "")
            setImageHeaderURL(newHeaderImage);
    }, [newHeaderImage])

    useEffect(() => {
        if(newIconImage !== "")
            setImageIconURL(newIconImage);
    }, [newIconImage])

    const handleSaveProductInfo = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/info`, {
                specifications : specificationsArray,
                imageHeaderURL : newHeaderImage, 
                imageIconURL : newIconImage,
                folio
            }, config)

            setAlerta({
                error: false, 
                msg: data.msg
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='container border my-4 py-2'>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fw-medium fs-6 m-0">Informacion de la pagina</h2>
                <button 
                    onClick={() => handleSaveProductInfo()} 
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={checkArray()}
                >Guardar Cambios</button>
            </div>

            <div>
                {imageHeaderURL  ? (
                    <>
                        <div className="containerCompleteImageBackgound mt-2 rounded" 
                            style={{
                                backgroundImage: `url('${imageHeaderURL}')`
                            }}
                        >
                            <p>{productName}</p>
                        </div>

                        {cloudinaryHeader ? (
                            <CloudinaryWidget 
                                text="Cambiar Imagen"
                                setImagenUrl={setNewHeaderImage}
                            />
                        ) : (
                            <button onClick={() => setCloudinaryHeader(!cloudinaryHeader)} className="btn btn-sm my-2 bgPrimary">Cambiar Imagen de fondo</button>
                        )}
                        
                    </>
                ) : (
                    <CloudinaryWidget 
                        completeBtn
                        text="Seleccione una imagen de fondo"
                        setImagenUrl={setNewHeaderImage}
                    />
                )}

                <p className="text textPrimary fw-medium">{productName}</p>

                <div className="row">
                    <div className="col-lg-3 col-md-5">
                        {!imageIconURL ? (
                            <>
                                <p className="mb-0">Agregar imagen del producto</p>
                                {!cloudinaryHeader ? (
                                    <CloudinaryWidget 
                                        text="Seleccione la imagen del producto"
                                        setImagenUrl={setNewIconImage}
                                    />
                                ) : (
                                    <button onClick={() => setCloudinaryHeader(!cloudinaryHeader)} className="btn mt-1 btn-sm bgPrimary">Cambiar Imagen de producto</button>
                                )}
                            </>
                        ) : (
                            <img src={imageIconURL} alt="Imagen del producto" />
                        )}
                    </div>
                </div>

                <p className="my-1">Especificaciones</p>
                <button className="btn btn-sm btn-success" type="button" onClick={() => setSpeInput(true)}>+ Agregar especificación</button>

                {speInput && (
                    <>
                        <div className="mt-1">
                            <label>Especificación</label>
                            <Select 
                                options={speOptions}
                                onChange={handleSelectSpe}
                                className="w-100"
                                value={speSelected}
                            />
                        </div>

                        {speSelected && (
                            <>
                                <div className="mt-1">
                                    <label>Valor</label>
                                    <input type="text" value={valueSpe} onChange={e => setValueSpe(e.target.value)} className="form-control" placeholder="Valor de la especificacion" />
                                </div>

                                <button 
                                    className={`btn ${valueSpe === '' ? 'bgIsInvalid' : 'bgPrimary'} btn-sm mt-2`}
                                    onClick={() => handleAddSpeArray()}
                                    disabled={valueSpe === ''}
                                    type="button"
                                >Agregar especificación</button>
                            </>
                        )}
                    </>
                                    
                )}
                                
                {specificationsArray?.map(specification => (
                    <div className="mt-3" key={specification.SpecificationID}>
                        <label>{specification.SpecificationName}</label>
                        <input type="text" value={specification.Value} disabled className="form-control form-control-sm" />
                    </div>            
                ))}

                {productSpecifications.map(specification => (
                    <div className="mt-3" key={specification.SpecificationID}>
                        <label>{specification.Specification}</label>
                        <input type="text" value={specification.Value} disabled className="form-control form-control-sm" />
                    </div>
                ))}

                <p className="mb-1 mt-2">Caracteristicas y Beneficios</p>
                <button type="button" onClick={() => setCharInput(!charInput)} className="btn btn-sm btn-success">Agregar Caracteristica</button>

                {charInput && (
                    <div className="mt-3 p-4 border rounded">
                        <label htmlFor="charType">Seleccione un tipo de caracteristica</label>
                        <select value={charType} onChange={e => setCharType(e.target.value)} id="charType" className="form-select">
                            <option value="0">Seleccione un tipo</option>
                            <option value="1">Texto</option>
                            <option value="2">Lista</option>
                            <option value="3">Acordion</option>
                        </select>

                        <div className="mt-4">
                            {charType === "1" && (
                                <>
                                    <label htmlFor="texto">Escriba el texto</label>
                                    <textarea name="" id="texto" className="form-control" rows={5}></textarea>

                                    <button className="btn bgPrimary mt-3">Guardar Caracteristica</button>
                                </>
                            )}

                            {charType === "2" && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="header">Elija el titulo</label>
                                        <input type="text" name="" id="header" className="form-control" placeholder="Titulo" />

                                        <button className="btn bgPrimary mt-3">Agregar a la lista</button>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="contenido">Elija el contenido</label>
                                        <textarea id="contenido" className="form-control" rows={5}></textarea>                                       
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductViewForm