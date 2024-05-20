import useApp from '../hooks/useApp'
import styles from '../styles/Footer.module.css'

const MainFooter = () => {
  const { types } = useApp();

  return (
    <footer className='container-fluid'>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <img src="./img/LogoEditableblanco.png" alt="Logo Mopal Grupo" className={`${styles.logo}`} />
          </div>

          <div className="col-lg-4">
            <p className='text-light text-end mb-1 fw-bold'>Productos</p>
            <ul className={styles.navegacion}>
              {types?.map(type => (
                <li key={type.ID}><a href={`/productos/${type.ID}`} className='nav-link'>{type.Name}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4">
            <p className='text-light text-end mb-1 fw-bold'>FAQ</p>
            <ul className={styles.navegacion}>
              <li><a href="/" className='nav-link'>Inicio</a></li>
              <li><a href="/productos" className='nav-link'>Productos</a></li>
              <li><a href="/contacto" className='nav-link'>Contacto</a></li>
              <li><a href="/nosotros" className='nav-link'>Nosotros</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MainFooter