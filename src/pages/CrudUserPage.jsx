import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import useAdmin from "../hooks/useAdmin";
import Select from 'react-select';
import useApp from "../hooks/useApp";
import Spinner from "../components/Spinner";
import generatePSWD from "../helpers/generarPassword";


const CrudUserPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [address, setAddress] = useState('')
  const [rolID, setRolID] = useState(6)

  const [selectedSupplierOption, setSelectedSupplierOption] = useState(null)
  const [selectedCustomerOption, setSelectedCustomerOption] = useState(null)
  const [supplierID, setSupplierID] = useState(null)
  const [customerID, setCustomerID] = useState(null)

  const [userType, setUserType] = useState(0)

  const [alerta, setAlerta] = useState(null)
  const [disableRol, setDisableRol] = useState(false)

  const { roles, customers, suppliers, users } = useAdmin()
  const { loading, setLoading } = useApp();
  const { id } = useParams();

  const supplierOptions = suppliers.map(supplier => {
    const supplierNew = {
        value : supplier.ID, 
        label : `${supplier.ID} - ${supplier.BusinessName}`
    }

    return supplierNew;
  })

  const handleSupplierSelectChange = (selected) => {
    setSupplierID(selected.value);
    setSelectedSupplierOption(selected)
  };
  
  const customerOptions = customers.map(customer => {
    const customerNew = {
      value : customer.ID, 
      label : `${customer.ID} - ${customer.BusinessName}`
    }

    return customerNew;
  })

  const handleCustomerSelectChange = (selected) => {
    setCustomerID(selected.value);
    setSelectedCustomerOption(selected)
  };

  const navigate = useNavigate();

  const checkInfo = useCallback(() => {
    return userName === '' ||
      name === '' ||
      lastName === '' ||
      +rolID === 0
  }, [userName, password, name, lastName, email, number, rolID])

  useEffect(() => {
      checkInfo()
  }, [userName, password, name, lastName, email, number, rolID])

  useEffect(() => {
    if(userType === "2" || userType === "1") {
      setRolID(6)
      setDisableRol(true)

      switch (userType) {
        case "1":
          setSupplierID(null)
          break;
        
        case "2":
          setCustomerID(null)
          break;
      }
    } else {
      setDisableRol(false)
    }
  }, [userType])

  const handleAddUser = async() => {
    const user = {
      ID : id,
      UserName : userName, 
      Password: password, 
      Name : name, 
      LastName : lastName, 
      Email : email,
      Number : number,
      RolID : rolID, 
      Active : true, 
      supplier : supplierID, 
      customer : customerID, 
      Address : address
    }

    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      setLoading(true)

      if(id) {
        const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users`, {user}, config);
        setAlerta({
          error: false, 
          msg : data.msg
        })
      } else {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {user}, config);
        setAlerta({
          error: false, 
          msg : data.msg
        })
      }
    } catch (error) {
      setAlerta({
        error: true, 
        msg : error.response.data.msg
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(id) {
      const user = users.filter(user => user.ID === +id)

      if(user.length > 0) {
        setName(user[0].Name)
        setLastName(user[0].LastName)
        setEmail(user[0].Email)
        setNumber(user[0].Number)
        setUserName(user[0].UserName)
        setRolID(user[0].RolID)
        setAddress(user[0].Address)

        if(user[0].CustomerID) {
          setUserType(1)
          setCustomerID(user[0].CustomerID)

          const customer = customers?.filter(customer => customer.ID === user[0].CustomerID)
          
          setSelectedCustomerOption({
            value : customer[0]?.ID, 
            label : `${customer[0]?.ID} - ${customer[0]?.BusinessName}`
          })
        } else if(user[0].SupplierID) {
          setUserType(2);
          setSupplierID(user[0].SupplierID)

          const supplier = suppliers?.filter(supplier => supplier.ID === user[0].SupplierID)

          setSelectedSupplierOption({
            value : supplier[0]?.ID, 
            label : `${supplier[0]?.ID} - ${supplier[0]?.BusinessName}`
          })
        }
      }
    }
  }, [users])

  const handleGetUserName = () => {
    let userName = ""
  
    if(name !== "") {
      userName += name?.charAt(0);
    }
  
    if(lastName !== "") {
      const lastNames = lastName?.split(" ");
      userName += lastNames[0]
  
      if(lastNames[1] !== undefined) {
        userName += lastNames[1]?.charAt(0)
      } else {
        userName += lastNames[0].charAt(1).toUpperCase()
      }
    }
  
    userName += (Math.random() * (999 - 100) + 1).toFixed(0)
  
    return userName
  }

  useEffect(() => {
    if(!id) {
      setUserName(handleGetUserName())
    }
  }, [name, lastName])

  useEffect(() => {
    if(!id) {
      setPassword(generatePSWD())
    }
  }, [])

  return (
    <div className="container mt-4">
      <button onClick={() => navigate(-1)} className="backBtn mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>

          <p>Back</p>
      </button>

      <h2>Crear Usuario</h2>
      <p>Ingresa los datos que se solicitan para dar de alta un nuevo usuario</p>

      {alerta && (
        <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <form>
          <div className="row g-3">
            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="name" className="fw-bold fs-6">Nombre</label>
              <input 
                type="text" 
                id="name"
                placeholder="Nombre del usuario" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="lastName" className="fw-bold fs-6">Apellido</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder="Apellidos del usuario"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="email" className="fw-bold fs-6">Correo</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Ej. correo@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="numero" className="fw-bold fs-6">Número de contacto</label>
              <input 
                type="number" 
                id="numero" 
                placeholder="Numero del usuario"
                value={number}
                onChange={e => setNumber(e.target.value)}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="address" className="fw-bold fs-6">Direccion</label>
              <input 
                type="text" 
                id="address" 
                placeholder="Ej. Aragon 129, Privadas del rey"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="userName" className="fw-bold fs-6">Nombre de usuario</label>
              <input 
                type="text" 
                id="userName" 
                placeholder="Nombre de usuario"
                value={userName}
                disabled
                onChange={e => setUserName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="password" className="fw-bold fs-6">Password</label>
              <input 
                type="text" 
                disabled
                id="password" 
                placeholder="Password del usuario"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control"
              />
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="rol" className="fw-bold fs-6">Rol</label>
              <select 
                id="rol" 
                value={rolID} 
                onChange={e => setRolID(e.target.value)}
                className="form-select"
                disabled={disableRol}
              >
                <option value="0">Seleccione un rol</option>
                {roles?.map(rol => (
                  <option key={rol.ID} value={rol.ID}>{rol.Name}</option>
                ))}
              </select>
            </div>

            <div className={`d-flex flex-column col-lg-4 col-md-6`}>
              <label htmlFor="type" className="fw-bold fs-6">Tipo de usuario</label>
              <select id="type" value={userType} onChange={e => setUserType(e.target.value)} className="form-select">
                <option value="0">Interno</option>
                <option value="1">Cliente</option>
                <option value="2">Proveedor</option>
              </select>
            </div>

            {+userType === 1 && (
              <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                <label htmlFor="supplier">Cliente</label>
                  <Select 
                    options={customerOptions} 
                    onChange={handleCustomerSelectChange} 
                    value={selectedCustomerOption}
                    className="w-100"
                  />
              </div>
            )}

            {+userType === 2 && (
              <div className={`d-flex flex-column col-lg-4 col-md-6`}>
                <label htmlFor="supplier">Proveedor</label>
                  <Select 
                    options={supplierOptions} 
                    onChange={handleSupplierSelectChange} 
                    value={selectedSupplierOption}
                    className="w-100"
                  />
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button 
              type="button"
              className={`btn ${checkInfo() ? 'bgIsInvalid' : 'bgPrimary'} mt-4`}
              disabled={checkInfo()}
              onClick={() => handleAddUser()}
            >Guardar Usuario</button>

            <button 
              type="button"
              className={`btn btn-secondary mt-4`}
              disabled={!id}
              onClick={() => setPassword(generatePSWD())}
            >Generar Password</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CrudUserPage