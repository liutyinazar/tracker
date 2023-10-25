import { Navigate, Outlet } from "react-router-dom"
import Cookies from 'js-cookie';

const privateRouter = () => {
    const token = Cookies.get('auth_token')
    return (
        token ? <Outlet/> : <Navigate to="/login"/>
    );
};

export default privateRouter