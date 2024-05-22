import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import Spinner from '../components/Spinner';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState(null)

  const { loading, setLoading } = useApp();
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate()

  const handleLogin = async() => {
    try {
      setLoading(true)
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth`, {
        UserName: userName, 
        Password: password
      });

      setAuth(data)

      localStorage.setItem('token', data.token);

      setAlerta(null)

      navigate('/')
    } catch (error) {
      setAlerta({
        error: true, 
        msg: error.response.data.msg
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container my-5 allScreenHeight'>
      <div className="row g-0 shadow-lg">
        <form className={`col-md-6 bg-light p-5`}>
          <div>
            <h1 className='text-start'>Iniciar Sesión</h1>
            <p>Ingrese sus licencias para iniciar sesión</p>

            {alerta && (
              <p className='alert alert-danger'>{alerta.msg}</p>
            )}
          </div>
          
          <div className={`d-flex flex-column mt-1`}>
            <label htmlFor="userName" className='form-label'>Nombre de usuario</label>
            <input type="text" value={userName} placeholder='Nombre de usuario' onChange={e => setUserName(e.target.value)} id="userName" className='form-control' />
          </div>
          <div className={`d-flex flex-column mt-2`}>
            <label htmlFor="password" className='form-label'>Contraseña</label>
            <input type="password" value={password} placeholder='Contraseña' onChange={e => setPassword(e.target.value)} id="password" className='form-control' />
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <button type="button" onClick={() => handleLogin()} className={`btnPrimaryBg mt-3`}>Iniciar Sesión</button>
          )}

        </form>

        <div className='col-md-6 bg bgPrimary p-5 text-center'>
            <h4 className='fs-3 fw-bold'>Bienvenido al sistema de Mopal Grupo</h4>
            <p className='fs-5'>Si desea tener acceso al sistema, favor de ingresar la siguiente informacion</p>

            <button className='btn btn-dark'>Solicitar Acceso</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage