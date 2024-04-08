import { Outlet, Navigate } from 'react-router-dom'
import ApiUtils from '../utils/ApiUtils'

const AppRoutesPrivate = () => {
    const auth = ApiUtils.getAuthToken();
    return(
        auth? <Outlet/> : <Navigate to="/connexion"/>
    )
}

export default AppRoutesPrivate