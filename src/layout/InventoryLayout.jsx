import { Outlet, useLocation, Link } from 'react-router-dom'
import useApp from '../hooks/useApp'
import styles from '../styles/Inventory.module.css'
import MainHeader from '../components/MainHeader'
import MainFooter from '../components/MainFooter'
import Offcanvas from 'react-bootstrap/Offcanvas'
import useAuth from '../hooks/useAuth'
import NavOffCanva from '../components/NavOffCanva'
import Spinner from '../components/Spinner'

const InventoryLayout = () => {
    const { pathname } = useLocation();
    const { language, setLanguage, show, handleClose, handleShow } = useApp()
    const { auth, loading } = useAuth()

    if(loading) return (
        <div className="container-fluid">
          <Spinner />
        </div>
    )

    return (
        <div>
            <MainHeader />
            <main className='container-fluid'>
                <div className="row">
                    <div className={`${styles.topNav} bg-dark text-light py-3 justify-content-between`}>
                        <p className='m-0 fw-bold'>Bienvenido <span className='fw-light'>{auth.LastName}</span></p>
                        <button onClick={() => handleShow()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavHeader} text-light`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div> 
                    
                    <aside className={`${styles.inventoryAside} bg-dark col-lg-2 col-md-4 p-0`}>
                        <div className={`${styles.divAside} flex-column align-items-center p-4 w-100`}>
                            <h4 className='text-white'>{language ? 'Welcome' : 'Bienvenido'}</h4>
                            {auth.ID && (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"w-6 h-6 svgUser"}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <p className='text-center text-light mt-2'>{auth.Name + " " + auth.LastName}</p>
                                </>
                            )}
                            
                        </div>
                        
                        <nav className={styles.navInventory}>
                            <ul className={`${styles.lstNav} ${styles.divAside} gap-2`}>
                                <li className={`${pathname === "/inventory" && styles.active }`}>
                                    <Link to={'/inventory'} className={`${styles.navItem} align-items-center gap-2 px-4 text-decoration-none`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                        </svg>
                                        <p className='m-0 fs-6'>{language ? 'Inventory' : 'Inventario'}</p> 
                                    </Link>
                                    
                                </li>

                                {auth.ID && (
                                    <>
                                        <li className={`${pathname === "/inventory/products-list" && styles.active } d-flex align-items-center gap-2`}>
                                            <Link to={'/inventory/products-list'} className={`${styles.navItem} d-flex align-items-center gap-2 px-4 text-decoration-none position-relative`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                                <p className='m-0 fs-6'>{language ? 'Product List' : 'Lista de Productos'}</p>
                                            </Link>
                                        </li>

                                        <li className={`${pathname.includes('history') && styles.active } d-flex align-items-center gap-2`}>
                                            <Link to={'/inventory/history'} className={`${styles.navItem} d-flex align-items-center gap-2 px-4 text-decoration-none`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                <p className='m-0 fs-6'>{language ? 'History' : 'Historial'}</p> 
                                            </Link>
                                        </li>
                                    </>
                                )}

                                <li className={`d-flex align-items-center gap-2 mt-4`}>
                                    <button onClick={() => setLanguage(!language)} className={`${styles.navItem} d-flex align-items-center gap-2 px-4 text-decoration-none`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                                        </svg>
                                        <p className='m-0 fs-6'>{language ? 'Español' : 'English'}</p> 
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    <div className={`${styles.minHFull} px-lg-5 col-lg-10 col-md-8 col-xxl-10 py-3`}>
                        <Outlet />
                    </div>
                </div>

                <NavOffCanva />

                <Offcanvas show={show} onHide={handleClose} className="bg-dark text-light">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='p-0'>
                        <div className={`d-flex flex-column align-items-center p-4 w-100`}>
                            <h4 className='text-white'>{language ? 'Welcome' : 'Bienvenido'}</h4>
                            {auth.ID && (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"w-6 h-6 svgUser"}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <p className='text-center text-light mt-2'>{auth.Name + " " + auth.LastName}</p>
                                </>
                            )}
                        </div>

                        <nav className={styles.navOffcanva}>
                            <ul className={`d-flex flex-column gap-2 p-0`}>
                                <li>
                                    <Link to={'/inventory'} className={`${pathname.includes('inventory') && styles.active } ${styles.navItem} d-flex align-items-center gap-2 text-decoration-none`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                        </svg>
                                        <p className='m-0 fs-4'>{language ? 'Inventory' : 'Inventario'}</p> 
                                    </Link>
                                </li>

                                {auth.ID && (
                                    <>
                                        <li className={`${pathname.includes('lstProducts') && styles.active } d-flex align-items-center gap-2`}>
                                            <Link to={'/lstProducts'} className={`${styles.navItem} d-flex align-items-center gap-2 text-decoration-none`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                                <p className='m-0 fs-4'>{language ? 'Product List' : 'Lista de Productos'}</p> 
                                            </Link>
                                        </li>

                                        <li className={`${pathname.includes('history') && styles.active } d-flex align-items-center gap-2`}>
                                            <Link to={'/history'} className={`${styles.navItem} d-flex align-items-center gap-2 text-decoration-none`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                                                <p className='m-0 fs-4'>{language ? 'Inventory' : 'Inventario'}</p> 
                                            </Link>
                                        </li>
                                    </>
                                )}

                                <li className={`${pathname.includes('history') && styles.active } d-flex align-items-center gap-2 mt-4`}>
                                    <button onClick={() => setLanguage(!language)} className={`${styles.navItem} d-flex align-items-center gap-2 text-decoration-none`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                                        </svg>
                                        <p className='m-0 fs-6'>{language ? 'Español' : 'English'}</p> 
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </Offcanvas.Body>
                </Offcanvas>
            </main>
            <MainFooter />
        </div>
  )
}

export default InventoryLayout