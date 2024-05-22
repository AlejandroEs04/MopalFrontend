import { Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import Scroll from "../components/Scroll";

const AdminSupplierPage = () => {
    const { suppliers } = useAdmin();

    return (
        <div className="mt-2">
            <h1 className='m-0'>Proveedores</h1>
            <Link to={'/admin/suppliers/form'} className='btnAgregar fs-5'>+ Agregar nuevo proveedor</Link>

            <Scroll>
                {suppliers?.length > 0 ? (
                    <table className="table table-dark table-hover mt-3">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Razon Social</th>
                        <th>Direccion</th>
                        <th>RFC</th>
                        </tr>
                    </thead>

                    <tbody>
                        {suppliers.map(supplier => (
                            <tr key={supplier.ID}>
                                <td>{supplier.ID}</td>
                                <td>{supplier.BusinessName}</td>
                                <td>{supplier.Address}</td>
                                <td>{supplier.RFC}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                ) : (
                    <div>
                        <h3 className='fw-bold text-center mt-3'>Aun no hay proveedores dados de alta</h3>
                    </div>
                )}
            </Scroll>
        </div>
    )
}

export default AdminSupplierPage