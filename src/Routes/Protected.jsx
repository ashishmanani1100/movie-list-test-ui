import { Navigate, Outlet } from "react-router-dom";
import Layout from "../Components/Layout";

// Redirect to login if not logged in
const Protected = () => {
  const token = localStorage.getItem("token");

  return <Layout>{token ? <Outlet /> : <Navigate to="/signin" />}</Layout>;
};

export default Protected;
