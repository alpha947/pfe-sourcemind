import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { Key } from '../enum/cache.key';
import { EmailAddress } from '../models/ICredentials';
import { IResponse } from '../models/IResponse';
import { userAPI } from '../services/UserService';

const schema = z.object({ email: z.string().min(3, 'Email is required').email('Invalid email address') });

const ResetPassword = () => {
    const location = useLocation();
    const isLoggedIn: boolean = JSON.parse(localStorage.getItem(Key.LOGGEDIN)!) as boolean || false;
    const { register, handleSubmit, formState, getFieldState } = useForm<EmailAddress>({ resolver: zodResolver(schema), mode: 'onTouched' });
    const [resetPassword, { data, error, isLoading, isSuccess }] = userAPI.useResetPasswordMutation();

    const isFieldValid = (fieldName: keyof EmailAddress): boolean => getFieldState(fieldName, formState).isTouched && !getFieldState(fieldName, formState).invalid;

    const handleResetPassword = async (email: EmailAddress) => await resetPassword(email);

    if (isLoggedIn) {
        return location?.state?.from?.pathname ? <Navigate to={location?.state?.from?.pathname} replace /> : <Navigate to={'/'} replace />
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginTop: '150px' }}>
                    <div className="card">
                        <div className="card-body">
                            <h4 className="mb-3">Reinitialiser le MDP</h4>
                            {error && <div className="alert alert-dismissible alert-danger">
                                {'data' in error ? (error.data as IResponse<void>).message! : 'Une erreur s\'est produite'}
                            </div>}
                            {isSuccess && <div className="alert alert-dismissible alert-success">
                                {(data as IResponse<void>).message || 'Nous vous avons envoyé un e-mail pour vous permettre de réinitialiser votre mot de passe'}
                            </div>}
                            <hr />
                            <form onSubmit={handleSubmit(handleResetPassword)} className="needs-validation" noValidate>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">Adresse email</label>
                                        <div className="input-group has-validation">
                                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                                            <input type="text" {...register('email')} name='email' className={`form-control ' ${formState.errors.email ? 'is-invalid' : ''} ${isFieldValid('email') ? 'is-valid' : ''}`} id="email" placeholder="Email address" disabled={isLoading} required />
                                            <div className="invalid-feedback">{formState.errors.email?.message}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col mt-3">
                                    <button disabled={formState.isSubmitting || isLoading} className="btn btn-primary btn-block" type="submit" >
                                        {(formState.isSubmitting || isLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                                        <span role="status">{(formState.isSubmitting || isLoading) ? 'Chargement...' : 'Reinitialiser'}</span>
                                    </button>
                                </div>
                            </form>
                            <hr className="my-3" />
                            <div className="row mb-3">
                                <div className="col d-flex justify-content-start">
                                    <div className="btn btn-outline-light">
                                        <Link to="/register" style={{ textDecoration: 'none' }}>Creer un compte</Link>
                                    </div>
                                </div>
                                <div className="col d-flex justify-content-end">
                                    <div className="link-dark">
                                        <Link to="/login">Se connecter ?</Link>
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

export default ResetPassword;