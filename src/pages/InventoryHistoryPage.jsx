import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import formatearFecha from '../helpers/formatearFecha'
import Scroll from '../components/Scroll'

const InventoryHistoryPage = () => {
  const [requests, setRequests] = useState([])
  const { auth } = useAuth()

  const getLastRequest = async() => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/request/user/${auth.ID}`, config);
      setRequests(data.requests)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getLastRequest()
  }, [])

  return (
    <div>
      <h2>Historial de solicitudes</h2>

      <Scroll>
        
        <table className='table table-hover mt-3'>
          <thead className='table-light'>
            <tr>
              <th>ID</th>
              <th>Fecha de creación</th>
              <th>Estatus</th>
              <th>Productos</th>
              <th>Cantidad total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {requests?.map(request => (
              <tr key={request.ID}>
                <td>{request.ID}</td>
                <td>{formatearFecha(request.CreationDate)}</td>
                <td>
                  <div className='d-flex gap-2 align-items-center justify-content-between'>
                    <p 
                      className={`
                        m-0
                        ${request.Status === 1 && 'text-danger'}
                        ${request.Status === 2 && 'text-primary'}
                        ${request.Status === 3 && 'text-warning'}
                        ${request.Status === 4 && 'text-success'}
                      `}
                    >
                      {request.Status === 1 && 'En espera'}
                      {request.Status === 2 && 'Aceptada'}
                      {request.Status === 3 && 'En camino'}
                      {request.Status === 4 && 'Entregada'}
                    </p>

                    <div 
                      className={`
                        circle
                        ${request.Status === 1 && 'bg-danger'}
                        ${request.Status === 2 && 'bg-primary'}
                        ${request.Status === 3 && 'bg-warning'}
                        ${request.Status === 4 && 'bg-success'}
                      `}
                    ></div>
                  </div>
                </td>
                <td>{request.products.length}</td>
                <td>{request.products.length}</td>
                <td>
                  <div>
                    <button className='btn btn-sm bgPrimary'>Ver información</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroll>
    </div>
  )
}

export default InventoryHistoryPage