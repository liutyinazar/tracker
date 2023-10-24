import { Navigate, Outlet } from "react-router-dom"

const privateRouter = () => {
    const token = localStorage.getItem("auth_token");
    return (
        token ? <Outlet/> : <Navigate to="/login"/>
    );
};

export default privateRouter