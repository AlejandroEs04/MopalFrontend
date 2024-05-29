import { useParams } from "react-router-dom"
import useApp from "../hooks/useApp"
import Select from 'react-select'
import { useEffect, useState } from "react"
import useAdmin from "../hooks/useAdmin"
import axios from "axios"

const CrudProductAccesoriesPage = () => {
  const [product, setProduct] = useState({})
  const [editFolio, setEditFolio] = useState('');
  const [accesories, setAccesories] = useState([]);
  const [accesoriesNew, setAccesoriesNew] = useState([]);
  const [accesoriesOptions, setAccesoriesOptions] = useState({}); 
  const [accesorySelected, setAccesorySelected] = useState(null)
  const { products } = useApp();
  const { alerta, setAlerta } = useAdmin();
  const { id } = useParams()

  const handleChangeAccesorySelected = (selected) => {
    setAccesorySelected(selected)
  }

  const handleAddProductArray = (accesoryFolio) => {
    const newAccesory = products?.filter(accesory => accesory.Folio === accesoryFolio);

    setAccesoriesNew([
      ...accesoriesNew, 
      {
        ProductFolio : id,
        AccessoryFolio : newAccesory[0].Folio,
        Name : newAccesory[0].Name,
        Quantity : null,
        Piece : null
      }
    ]);
  }

  const handleChangeField = (field, value, folio) => {
    const newArray = accesoriesNew.map(accesory => {
        if(accesory.AccessoryFolio === folio) {
          if(field === 'piece') {
            accesory.Piece = value
          } else if(field === 'quantity') {
            accesory.Quantity = value
          }
        }

        return accesory
    })
    setAccesoriesNew(newArray);
  }

  const addNewAccesory = async() => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${id}/accesories`, { accesories : accesoriesNew }, config);
      
      setAlerta({
        error : false, 
        msg : data.msg
      })

      setTimeout(() => {
        setAlerta(null)
      }, 5000)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const accesoriesArray = products?.filter(product => product.ClassificationID === 2);
    const productCurrent = products?.filter(product => product.Folio === id);
    setAccesories(accesoriesArray)
    setProduct(productCurrent[0])
  }, [products, ])

  useEffect(() => {
    const options = accesories?.map(accesory => {
      const accesorieItem = {
        value : accesory.Folio, 
        label : `${accesory.Folio} - ${accesory.Name}`
      }

      return accesorieItem
    })

    setAccesoriesOptions(options)
  }, [accesories])

  return (
    <div className='my-5'>
      <h1 className="fw-light">Configura la pieza <span className="fw-medium">{id}</span></h1>
      <p>Selecciona los accesorios que puede tener un producto</p>

      {alerta && (
        <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
      )}

      <div className="d-flex gap-2">
        <Select 
          options={accesoriesOptions}
          value={accesorySelected}
          onChange={handleChangeAccesorySelected}
          className="w-100"
        />

        <button onClick={() => handleAddProductArray(accesorySelected.value)} disabled={!accesorySelected} className="btn btn-secondary">Agregar</button>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h3 className="fw-normal m-0">Lista de accesorios</h3>
        {accesoriesNew?.length > 0 && (
          <div>
            <button onClick={() => addNewAccesory()} className="btn btn-sm btn-success">Guardar</button>
          </div>
        )}
      </div>
      
      {accesoriesNew?.length > 0 | product?.accessories?.length > 0 ? (
        <table className="table table-hover">
          <thead className="table-secondary">
            <tr>
              <th>Folio</th>
              <th>Nombre</th>
              <th>Pieza necesaria</th>
              <th>No. Piezas necesarias</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {accesoriesNew.map(accesory => (
            <tr key={accesory.AccessoryFolio}>
              <td>{accesory?.AccessoryFolio}</td>
              <td>{accesory?.Name}</td>
              <td><input type="text" onChange={(e) => handleChangeField('piece', e.target.value, accesory.AccessoryFolio)} value={accesory?.Piece} className="border-0 tableInput" /></td>
              <td><input type="number" onChange={(e) => handleChangeField('quantity', e.target.value, accesory.AccessoryFolio)} value={accesory?.Quantity} className="border-0 tableInput" /></td>
            </tr>
          ))}

          {product?.accessories?.map(accesory => (
            <tr key={accesory.Folio}>
              <td>{accesory?.Folio}</td>
              <td>{accesory?.Name}</td>
              <td>
                {accesory.Folio === editFolio ? (
                  <input type="text" onChange={(e) => handleChangeField('piece', e.target.value, accesory.Folio)} value={accesory?.Piece} className="border-0 tableInput" />
                ) : accesory.Piece}
              </td>
              <td>
                {accesory.Folio === editFolio ? (
                  <input type="number" onChange={(e) => handleChangeField('quantity', e.target.value, accesory.Folio)} value={accesory?.QuantityPiece} className="border-0 tableInput" />
                ) : accesory.QuantityPiece}
              </td>
            </tr>
          ))}
        </table>
      ) : (
        <h4>No hay accesorios dados de alta</h4>
      )}
    </div>
  )
}

export default CrudProductAccesoriesPage