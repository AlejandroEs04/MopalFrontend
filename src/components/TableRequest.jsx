import { Link } from 'react-router-dom'
import Scroll from './Scroll'

const TableRequest = ({ items, startIndex, endIndex, actionStorage = false }) => {
  return (
    <Scroll>
      <table className='table table-light table-secondary'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Folio del producto</th>
            <th>Cantidad Solicitada</th>
            <th>Estatus</th>
            <th>Direccion</th>
            {actionStorage && (
              <th>Acciones</th>
            )}
            </tr>
        </thead>

        <tbody>
            {items?.map(item => item.Status === 2 && (
              <tr key={item.ID}>
                <td>{item.ID}</td>
                <td>{item.ProductFolio}</td>
                <td>{item.Quantity}</td>
                <td>{item.Status === 2 ? 'Aceptada' : 'Entregada'}</td>
                <td>{item.Address}</td>
                <td>
                  <Link to={`/info/requests/${item.ID}`} className='btn btn-sm btn-success'>Ver informacion</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Scroll>
  )
}

export default TableRequest