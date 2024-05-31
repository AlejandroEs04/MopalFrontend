import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAdmin from "../hooks/useAdmin"
import Scroll from "./Scroll"
import Spinner from "./Spinner"

const TableSales = ({ sales, startIndex, endIndex, actionsSale = false, actionStorage = false }) => {
  const [folio, setFolio] = useState('');
  const [salesActive, setsalesActive] = useState('');
  const { handleChangeStatus, loading } = useAdmin()

  useEffect(() => {
    const salesActive = sales?.filter(sale => sale.Active === 1);
    setsalesActive(salesActive)
  }, [sales])

  return (
    <Scroll>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Usuario</th>
              <th>Status</th>
              <th>Estado</th>
              {actionStorage | actionsSale && (
                <th>Acciones</th>
              )}
            </tr>
          </thead>

          <tbody>
            {salesActive.length === 0 && (
              <tr>
                <td colspan="6">No hay ventas pendientes</td>
              </tr>
            )}

            {sales?.sort(function(a, b){return a.Folio-b.Folio}).slice(startIndex, endIndex).map(sale => sale.Active === 1 && (
              <tr key={sale.Folio}>
                <td>{sale.Folio}</td>
                <td>{sale.BusinessName}</td>
                <td>{sale.User}</td>
                <td className={`${sale.Status === 'Realizada' ? 'text-warning' : 'text-success'}`}>{sale.Status}</td>
                <td className={`${sale.Active === 1 ? 'text-success' : 'text-danger'}`}>{sale.Active === 1 ? 'Activo' : 'Inactivo'}</td>
                {actionsSale && (
                    <td className="d-flex justify-content-start gap-2">
                        <Link>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable editar">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </Link>

                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </td>
                )}

                {actionStorage && (
                    <td>
                        <div className="d-flex gap-2 align-items-center">
                            <Link to={`/info/sales/${sale.Folio}`} className="btn btn-sm btn-primary">Ver informacion</Link>
                            {loading && sale.Folio === folio ? (
                              <Spinner 
                                margin={false}
                                size="sm"
                              />
                            ) : (
                              <button 
                                onClick={() => {
                                  setFolio(sale.Folio)
                                  handleChangeStatus('sales', sale?.Folio, (sale?.StatusID + 1))
                                }}
                                className={`
                                  btn 
                                  btn-sm 
                                  ${sale.StatusID === 2 && 'btn-warning'}
                                  ${sale.StatusID === 3 && 'btn-success'}
                                `}
                              >
                                {sale.StatusID === 2 && 'En reparto'}
                                {sale.StatusID === 3 && 'Entregada'}
                              </button>
                            )}
                        </div>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
    </Scroll>
  )
}

export default TableSales