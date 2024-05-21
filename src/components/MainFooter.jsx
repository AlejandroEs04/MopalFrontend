import useApp from '../hooks/useApp'
import styles from '../styles/Footer.module.css'

const MainFooter = () => {
  const { types } = useApp();

  return (
    <footer className='container-fluid'>
      <div className="container py-5">
        <div className="row gx-5">
          <div className="col-xl-6 col-lg-4 col-md-4 col-md-12">
            <img src="/img/LogoEditableblanco.png" alt="Logo Mopal Grupo" className={`${styles.logo}`} />
            <p className='text-light fw-light mt-3 mb-0'>Mopal Grupo es una empresa mexicana que brinda soluciones de automatización industrial de la más alta calidad en el mercado.</p>
            <p className='text-light fw-light mt-1'>¡Te solucionamos tus problemas!</p>
          </div>

          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
            <p className='text-light fs-5 text-lg-end mb-1 fw-normal'>Menú</p>
            <ul className={styles.navegacion}>
              <li><a href="/" className='nav-link'>Inicio</a></li>
              <li><a href="/productos" className='nav-link'>Productos</a></li>
              <li><a href="/contacto" className='nav-link'>Contacto</a></li>
              <li><a href="/nosotros" className='nav-link'>Nosotros</a></li>
            </ul>
          </div>

          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
            <p className='text-light fs-5 text-lg-end mb-1 fw-normal'>Productos</p>
            <ul className={styles.navegacion}>
              {types?.map(type => (
                <li key={type.ID}><a href={`/productos/${type.ID}`} className='nav-link'>{type.Name}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
            <p className='text-light fs-5 text-lg-end mb-1 fw-normal'>Redes sociales</p>
            <ul className={styles.navegacion}>
              <li><a href="/nosotros" className='nav-link'>Facebook</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MainFooter