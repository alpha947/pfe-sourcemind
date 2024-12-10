import { Link, Outlet } from 'react-router-dom';
import { userAPI } from '../services/UserService';

const Restricted = () => {
    const { data: userData, error, isLoading, refetch } = userAPI.useFetchUserQuery(undefined, { refetchOnMountOrArgChange: true });

    if (isLoading || !userData) {
        return (
            <div className="container py-5" style={{ marginTop: '100px' }}>
                <div className="row">
                    <div className="col text-center">
                        <p>Chargement...</p>
                    </div>
                </div>
            </div>
        )
    }
    if (userData.data.user.role === 'ADMIN' || userData.data.user.role === 'SUPER_ADMIN') {
        return <Outlet />
    } else {
        return (
            <div className="container py-5" style={{ marginTop: '100px' }}>
                <div className="row">
                    <div className="col-md-2 text-center">
                        <p>
                            <i className="bi bi-exclamation-octagon text-warning" style={{ fontSize: '50px' }}></i><br />
                            Code du status: 403
                        </p>
                    </div>
                    <div className="col-md-10">
                        <h3>ACCÈS REFUSÉ</h3>
                        <p>L'accès à cette page est refusé en raison du manque d'autorisations.</p>
                        <Link to={'/'} className="btn btn-primary">Revenir a l'acceuil</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Restricted;