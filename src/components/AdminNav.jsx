import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'
import useAdmin from '../hooks/useAdmin';
import styles from "../styles/AdminNav.module.css"
import Scroll from './Scroll';

const AdminNav = () => {
  const [pendingRequest, setPendingRequest] = useState([])
  const { pathname } = useLocation();
  const { request } = useAdmin()

  const handleCountRequest = () => {
    const requestPen = request.filter(requestNew => requestNew.Status === 1);
    return requestPen.length
  }

  useEffect(() => {
    const requestArray = request?.filter(requestNew => requestNew.Status === 1);
    setPendingRequest(requestArray);
  }, [request])

  return (
    <div>
        <Scroll
            xscroll={true}
            yscroll={false}
        >
            <ul className={`${styles.AdminNavContainer} d-flex gap-2 mt-4 pb-2`}>
                <li className={`${pathname === '/admin' && styles.linkActive}`}><Link className={styles.link} to="/admin">Inicio</Link></li>
                <li className={`${pathname === '/admin/products' && styles.linkActive}`}><Link className={styles.link} to="/admin/products">Productos</Link></li>
                <li className={`${pathname === '/admin/purchase' && styles.linkActive}`}><Link className={styles.link} to="/admin/purchase">Compras</Link></li>
                <li className={`${pathname === '/admin/quotation' && styles.linkActive}`}><Link className={`${styles.link} position-relative`} to="/admin/quotation">
                  Pedidos
                  {pendingRequest.length > 0 && (
                    <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                      {handleCountRequest()}
                      <span className="visually-hidden">Products on list</span>
                    </span>
                  )}
                </Link></li>
                <li className={`${pathname === '/admin/sales' && styles.linkActive}`}><Link className={styles.link} to="/admin/sales">Ventas</Link></li>
                <li className={`${pathname === '/admin/storage' && styles.linkActive}`}><Link className={styles.link} to="/admin/storage">Almacén</Link></li>
                <li className={`${pathname === '/admin/users' && styles.linkActive}`}><Link className={styles.link} to="/admin/users">Usuarios</Link></li>
                <li className={`${pathname === '/admin/suppliers' && styles.linkActive}`}><Link className={styles.link} to="/admin/suppliers">Proveedores</Link></li>
                <li className={`${pathname === '/admin/customers' && styles.linkActive}`}><Link className={styles.link} to="/admin/customers">Clientes</Link></li>
            </ul>
        </Scroll>
    </div>
  )
}

export default AdminNav