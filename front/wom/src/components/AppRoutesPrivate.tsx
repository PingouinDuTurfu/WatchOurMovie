import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider';

const AppRoutesPrivate = () => {
    const { authToken } = useAuth();
    return(
        authToken? <Outlet/> : <Navigate to="/connexion"/>
    )
}

export default AppRoutesPrivate