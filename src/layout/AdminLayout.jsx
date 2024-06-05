import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminProvider } from "../context/AdminProvider";
import useAuth from "../hooks/useAuth";
import AdminHeader from "../components/AdminHeader";
import AdminNav from "../components/AdminNav";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

const AdminLayout = () => {
  const { auth, loading } = useAuth();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const checkRolID = (rolID) => {
    return rolID === 1 || rolID === 2 || rolID === 3 || rolID === 5
  }

  if(loading) return (
    <div className="container-fluid">
      <>
        <Spinner />
        <p className="text-center m-0">Autenticando...</p>
      </>
    </div>
  )

  return (
    <AdminProvider>
      {auth.ID && checkRolID(auth.RolID) ? (
        <>
          <AdminHeader />
          <main className="container">
            {!pathname.includes("form") && (
              <AdminNav />
            )}
  
            <Outlet />
          </main>

          <Toast />
        </>
      ) : navigate('/')}
    </AdminProvider>
  )
}

export default AdminLayout