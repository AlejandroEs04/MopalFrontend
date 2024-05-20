import { Link } from 'react-router-dom'

const AdminHeader = () => {
    return (
        <header className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <div className='container'>
                <Link to={'/'}>
                    <img src={'/img/LogoEditableblanco.png'} alt="Logo Mopal Grupo" className={`logo`} />
                </Link>
            </div>
        </header>
    )
}

export default AdminHeader