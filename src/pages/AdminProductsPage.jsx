import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useApp from '../hooks/useApp'
import axios from 'axios';
import DeletePop from '../components/DeletePop';
import TableProducts from '../components/TableProducts';
import useAdmin from '../hooks/useAdmin';
import useAuth from '../hooks/useAuth';

const AdminProductsPage = () => {
    const [show, setShow] = useState(false);
    const [productsFiltered, setProductsFiltered] = useState(null);
    const [searchBar, setSearchBar] = useState("");
    const [folio, setFolio] = useState('')
    const [showDeleted, setShowDeleted] = useState(false)

    const { products, setProducs } = useApp();
    const { auth } = useAuth();
    const { alerta, setAlerta } = useAdmin();
    const { pathname } = useLocation();

    const handleDeleteProduct = async() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${folio}`, config)
            setAlerta({
                error: true, 
                msg: data.msg
            })

            const productsArrray = products.map(product => {
                if(product.Folio === folio) {
                    product.Active = 0
                }
                
                return product
            })

            setProducs(productsArrray)

            setFolio('')

            setTimeout(() => {
                setAlerta(null)
            }, 2500)
        } catch (error) {
            setAlerta({
                error: true, 
                msg: 'Error al eliminar el producto'
            })
        }
    }

    useEffect(() => {
        if(searchBar !== "") {
            const filtered = products?.filter(product => {
                const folioMatch = product?.Folio?.toLowerCase().includes(searchBar?.toLowerCase());
                const NameMatch = product?.Name?.toLowerCase().includes(searchBar?.toLowerCase());
                return folioMatch || NameMatch
            });

            setProductsFiltered(filtered)
        } else {
            setProductsFiltered(products)
        }
        
    }, [searchBar])

    useEffect(() => {
        setProductsFiltered(products)
    }, [products])

    const checkPathname = () => {
        return pathname.includes('purchase') || 
        pathname.includes('sale')
    }

    return (
        <div className='mt-2'>
            <h1 className='m-0'>Productos</h1>
            {!checkPathname() && (auth.RolID === 1 || auth.RolID === 5) && (
                <Link to={`/admin/products/form`} className='btnAgregar fs-5'>+ Agregar nuevo producto</Link>
            )}

            <div className='row g-1 mt-2'>
                <div className='col-lg-10 col-md-8'>
                    <input value={searchBar} onChange={e => setSearchBar(e.target.value)} type="search" name="" id="seachProduct" className='form-control form-control-sm' placeholder='Buscar un producto' />
                </div>

                <div className="col-lg-2 col-md-4">
                    <button
                        className='btn btn-secondary w-100 btn-sm'
                        onClick={() => setShowDeleted(!showDeleted)}
                    >{showDeleted ? 'Ocultar' : 'Mostrar'} inactivos</button>
                </div>
            </div>

            {alerta && (
                <p className={`alert mt-3 ${alerta.error ? 'alert-warning' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            <TableProducts 
                products={productsFiltered}
                showDeleted={showDeleted}
                setShow={setShow}
                setFolio={setFolio}
            />

            <DeletePop 
                text={`¿Quieres eliminar el producto ${folio}?`}
                setFolio={setFolio}
                show={show}
                setShow={setShow}
                handleFunction={handleDeleteProduct}
            />
        </div>
    )
}

export default AdminProductsPage