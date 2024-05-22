import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const CrudCustomerPage = () => {
    const [businessName, setBusinessName] = useState('')
    const [address, setAddress] = useState('')
    const [RFC, setRFC] = useState('')
    const [email, setEmail] = useState('')
    const [alerta, setAlerta] = useState(null)

    const navigate = useNavigate();

    const checkInfo = useCallback(() => {
        return businessName === '' ||
        address === '' ||
        RFC === '' ||
        RFC.length < 12
    }, [businessName, address, RFC])

    useEffect(() => {
        checkInfo()
    }, [businessName, address, RFC])

    const handleAddCostumer = async() => {
        const token = localStorage.getItem('token');

        const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        }

        try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/customers`, {
            customer : {
            BusinessName : businessName, 
            Address : address, 
            RFC : RFC, 
            Email : email
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

    return (
        <div className="container mt-4">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>
            <h2>Crear Cliente</h2>
            <p>Ingresa los datos que se solicitan para dar de alta un nuevo cliente</p>

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
                        placeholder="Razon social del Cliente" 
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        className="form-control"
                        />
                    </div>

                    <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                        <label htmlFor="address" className="fw-bold fs-6">Direccion</label>
                        <input 
                        type="text" 
                        id="address" 
                        placeholder="Direccion del Cliente"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="form-control"
                        />
                    </div>

                    <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                        <label htmlFor="rfc" className="fw-bold fs-6">RFC</label>
                        <input 
                        type="text" 
                        id="rfc" 
                        placeholder="RFC del Cliente"
                        value={RFC}
                        onChange={e => setRFC(e.target.value)}
                        className="form-control"
                        />
                    </div>

                    <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                        <label htmlFor="correo" className="fw-bold fs-6">Correo</label>
                        <input 
                        type="email" 
                        id="correo" 
                        placeholder="Correo del Cliente"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="form-control"
                        />
                    </div>
                </div>

                <button 
                type="button"
                className={`btn ${checkInfo() ? 'bgIsInvalid' : 'bgPrimary'} mt-4`}
                disabled={checkInfo()}
                onClick={() => handleAddCostumer()}
                >Guardar Cliente</button>
            </form>
        </div>
    )
}

export default CrudCustomerPage