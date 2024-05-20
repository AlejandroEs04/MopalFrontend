import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader.jsx';
import MainFooter from '../components/MainFooter.jsx';

const MainLayout = () => {
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />
      </main>
      <MainFooter />
    </>
  )
}

export default MainLayout