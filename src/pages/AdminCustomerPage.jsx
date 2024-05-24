import { Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import Scroll from "../components/Scroll";

const AdminCustomerPage = () => {
    const { customers } = useAdmin();

    return (
        <div className='mt-2'>
            <h1 className='m-0'>Clientes</h1>
            <Link to={'/admin/customers/form'} className='btnAgregar fs-5'>+ Agregar nuevo cliente</Link>

            <Scroll>
                {customers?.length > 0 ? (
                    <table class="table table-hover mt-3">
                        <thead className="table-secondary">
                        <tr>
                            <th>ID</th>
                            <th>Razon Social</th>
                            <th>Direccion</th>
                            <th>RFC</th>
                            <th>Correo</th>
                        </tr>
                        </thead>

                        <tbody>
                        {customers.map(customer => (
                            <tr key={customer.ID}>
                            <td>{customer.ID}</td>
                            <td>{customer.BusinessName}</td>
                            <td>{customer.Address}</td>
                            <td>{customer.RFC}</td>
                            <td>{customer.Email}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div>
                        <h3 className='fw-bold text-center mt-3'>Aun no hay Clientes dados de alta</h3>
                    </div>
                )}
            </Scroll>
        </div>
    )
}

export default AdminCustomerPage