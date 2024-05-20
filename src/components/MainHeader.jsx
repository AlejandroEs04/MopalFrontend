import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';

const MainHeader = () => {
  const { pathname } = useLocation();
  const { auth, logOut } = useAuth()
  const { types, products } = useApp();

  return (
    <>
      <nav className='navContainer' id='navContainer'>
        <div className="wrapper container">
              <div className="logo">
                <Link className={`${pathname === '' && 'active'}`} to={"/"}><img src="/img/LogoEditableblanco.png" alt="Logo de la empresa" /></Link>
              </div>

              <input type="radio" name="slide" id="menu-btn" />
              <input type="radio" name="slide" id="cancel-btn" />

              <ul className="nav-links">
                  <label htmlFor="cancel-btn" className="btn cancel-btn"><i className='fas fa-times'></i></label>
                  <li><Link className={`${pathname === '/' && 'active'}`} to="/">Inicio</Link></li>
                  <li>
                      <Link className={`${pathname === '/productos' && 'active'} desktop-item`} to="/productos">Productos</Link>
                      <input type="checkbox" id="showMega" />
                      <label htmlFor="showMega" className="mobile-item">Productos</label>
                      <div className="mega-box">
                          <div className="content">
                            <div className="container">
                              {types?.slice(0, 3).map(type => (
                                <div className="row" key={type.ID}>
                                    <header className='fw-bold'>{type.Name}</header>
                                    <ul className="mega-links">
                                      {products?.map(product => product.TypeID === type.ID && (
                                        <li key={product.Folio}><Link className={`fw-normal`} to={`/productos/${product.Folio}`}>{product.Name}</Link></li>
                                      ))}
                                    </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                      </div>
                  </li>
                  <li><Link className={`${pathname === '/inventory' && 'active'}`} to="/inventory">Inventario</Link></li>
                  <li><Link className={`${pathname === '/contacto' && 'active'}`} to="/contacto">Contacto</Link></li>
                  <li><Link className={`${pathname === '/nosotros' && 'active'}`} to="/nosotros">Nosotros</Link></li>

                  {auth.ID ? (
                    <>
                      {+auth.RolID === 1 && (
                        <li><Link to="/admin">Administracion</Link></li>
                      )}
                      {+auth.RolID === 2 && (
                        <li><Link to="/purchase">Compras</Link></li>
                      )}
                      {+auth.RolID === 3 && (
                        <li><Link to="/sales">Ventas</Link></li>
                      )}
                      {+auth.RolID === 4 && (
                        <li><Link to="/storage">Entregas</Link></li>
                      )}
                      {+auth.RolID === 5 && (
                        <li><Link to="/managment">Gestion</Link></li>
                      )}
                      <button className='btn btn-sm btn-danger' onClick={() => logOut()}>Cerrar Sesion</button>
                    </>
                  ) : (
                    <li><Link className={`${pathname === '/login' && 'active'}`} to={'/login'}>Iniciar sesion</Link></li>
                  )}
              </ul>
              <label htmlFor="menu-btn" className="btn menu-btn"><i className='fas fa-bars'></i></label>
          </div>
      </nav>
    </>
  )
}

export default MainHeader