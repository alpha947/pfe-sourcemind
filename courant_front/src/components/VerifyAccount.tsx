import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IResponse } from '../models/IResponse';
import { userAPI } from '../services/UserService';

const VerifyAccount = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const key = searchParams.get('key');
    const [verifyAccount, { data: accountData, error: accountError, isLoading: accountLoading, isSuccess: accountSuccess }] = userAPI.useVerifyAccountMutation();

    React.useEffect(() => {
        if (key && location.pathname.includes('/verify/account')) {
            verifyAccount(key);
        }
    }, []);

    if (!key) {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginTop: '100px' }}>
                        <div className="card">
                            <div className="card-body">
                                <div className="alert alert-dismissible alert-danger">
                                Lien invalide. Veuillez vérifier le lien et réessayer.
                                </div>
                                <hr className="my-3" />
                                <div className="row mb-3">
                                    <div className="col d-flex justify-content-start">
                                        <div className="btn btn-outline-light">
                                            <Link to="/login" style={{ textDecoration: 'none' }}>Se connecter</Link>
                                        </div>
                                    </div>
                                    <div className="col d-flex justify-content-end">
                                        <div className="link-dark">
                                            <Link to="/resetpassword">Mot de passe oublier ?</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (key && !accountSuccess) {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginTop: '100px' }}>
                        <div className="card">
                            <div className="card-body">
                                {accountError && <div className="alert alert-dismissible alert-danger">
                                    {'data' in accountError ? (accountError.data as IResponse<void>).message! : 'Une erreur s\'est produite'}
                                </div>}
                                <div className="d-flex align-items-center">
                                    {!accountError && <><strong role="status">Veuillez patienter. Verification...</strong>
                                        <div className="spinner-border ms-auto" aria-hidden="true"></div></>}
                                </div>
                                {accountError && <>
                                    <hr className="my-3" />
                                    <div className="row mb-3">
                                        <div className="col d-flex justify-content-start">
                                            <div className="btn btn-outline-light">
                                                <Link to="/login" style={{ textDecoration: 'none' }}>Se connecter </Link>
                                            </div>
                                        </div>
                                        <div className="col d-flex justify-content-end">
                                            <div className="link-dark">
                                                <Link to="/resetpassword">Mot de passe oublier ?</Link>
                                            </div>
                                        </div>
                                    </div></>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (accountSuccess && location.pathname.includes('/verify/account')) {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginTop: '100px' }}>
                        <div className="card">
                            <div className="card-body">
                                <div className="alert alert-dismissible alert-success">
                                    Account verified. You can log in now.
                                </div>
                                <hr className="my-3" />
                                <div className="row mb-3">
                                    <div className="col d-flex justify-content-start">
                                        <div className="btn btn-outline-light">
                                            <Link to="/login" style={{ textDecoration: 'none' }}>Go to login</Link>
                                        </div>
                                    </div>
                                    <div className="col d-flex justify-content-end">
                                        <div className="link-dark">
                                            <Link to="/resetpassword">Forgot password?</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default VerifyAccount;