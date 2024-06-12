import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import useAdmin from "../hooks/useAdmin";
import Scroll from "../components/Scroll";

const CrudSupplierPage = () => {
    const [supplier, setSupplier] = useState({
        ID : 0,
        businessName : '', 
        address : '', 
        RFC : '', 
        users : []
    })

    const [alerta, setAlerta] = useState(null)
    const { suppliers } = useAdmin()

    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = e => {
        setSupplier({
            ...supplier, 
            [e.target.name] : e.target.value
        })
    }

    const checkInfo = useCallback(() => {
        return supplier?.businessName === '' ||
        supplier?.address === '' ||
        supplier?.RFC === '' ||
        supplier?.RFC?.length < 12
    }, [supplier])

    useEffect(() => {
        checkInfo()
    }, [supplier])

    const handleAddSupplier = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/suppliers`, {
                supplier : {
                BusinessName : businessName, 
                Address : address, 
                RFC : RFC, 
                }
            }, config)

            setAlerta({
                error: false, 
                msg: data.msg
            })
        } catch (error) {
            setAlerta({
                error: true, 
                msg: error.response.data.msg
            })
        }
    }

    useEffect(() => {
        if(id) {
            const supplierSelected = suppliers.filter(item => item.ID === +id)[0];
            setSupplier({
                ID: supplierSelected?.ID, 
                businessName: supplierSelected?.BusinessName, 
                RFC: supplierSelected?.RFC, 
                address: supplierSelected?.Address, 
                users: supplierSelected?.Users
            })
        }
    }, [suppliers])

    return (
        <div className="container mt-4">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>
            <h2>Crear Proveedor</h2>
            <p>Ingresa los datos que se solicitan para dar de alta un nuevo proveedor</p>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <form>
                <div className="row">
                    <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                        <label htmlFor="businessName" className="fw-bold fs-6">Razon Social</label>
                        <input 
                        type="text" 
                        id="businessName"
                        name='businessName'
                        placeholder="Razon social del proveedor" 
                        value={supplier.businessName}
                        onChange={handleChange}
                        className="form-control"
                        />
                    </div>

                    <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                        <label htmlFor="address" className="fw-bold fs-6">Direccion</label>
                        <input 
                        type="text" 
                        id="address" 
                        name="address"
                        placeholder="Direccion del proveedor"
                        value={supplier.address}
                        onChange={handleChange}
                        className="form-control"
                        />
                    </div>

                    <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                        <label htmlFor="rfc" className="fw-bold fs-6">RFC</label>
                        <input 
                        type="text" 
                        id="RFC" 
                        name="RFC"
                        placeholder="RFC del proveedor"
                        value={supplier.RFC}
                        onChange={handleChange}
                        className="form-control"
                        />
                    </div>
                </div>

                <button 
                    type="button"
                    className={`btn ${checkInfo() ? 'bgIsInvalid' : 'bgPrimary'} mt-4`}
                    disabled={checkInfo()}
                    onClick={() => handleAddSupplier()}
                >Guardar Proveedor</button>
            </form>

            {supplier?.users?.length > 0 && (
                <>
                    <h2 className="mt-5">Usuarios</h2>

                    <Scroll>
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Nombre de usuario</th>
                                    <th>Número de contacto</th>
                                    <th>Correo de contacto</th>
                                    <th>Dirección</th>
                                    <th>Activo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {supplier.users.map(item => (
                                    <tr key={item.UserID}>
                                        <td>{item.UserID}</td>
                                        <td>{item.FullName}</td>
                                        <td>{item.UserName}</td>
                                        <td>{item.Number}</td>
                                        <td>{item.Email}</td>
                                        <td>{item.Address}</td>
                                        <td>{item.Active === 1 ? 'Activo' : 'Inactivo'}</td>
                                        <td>
                                            <div>
                                                <Link to={`/admin/users/form/${item.UserID}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 iconTable text-primary">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        console.log("Eliminando...")
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 iconTable text-danger">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Scroll>
                </>
            )}
        </div>
    )
}

export default CrudSupplierPage