import { Navigate, Outlet } from "react-router-dom";
import Layout from "../Components/Layout";

// Redirect to movie list if already logged in
const Auth = () => {
  const token = localStorage.getItem("token");

  return <Layout>{token ? <Navigate to="/movie-list" /> : <Outlet />}</Layout>;
};

export default Auth;
