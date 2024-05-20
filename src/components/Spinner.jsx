import styles from '../styles/Spinner.module.css'

const Spinner = () => {
  return (
    <div className='d-flex justify-content-center my-5'>
        <span className={styles.loader}></span>
    </div>
  )
}

export default Spinner