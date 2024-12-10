import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import logo from '../assets/logo.png';
import { IRegisterRequest } from '../models/ICredentials';
import { IResponse } from '../models/IResponse';
import { userAPI } from '../services/UserService';

const schema = z.object({
  email: z.string().min(3, 'l\'adresse email est obligatoire').email('adresse email invalide'),
  firstName: z.string().min(1, 'Le prenom est obligatoire'),
  lastName: z.string().min(1, 'Le nom de famille est obligatoire'),
  password: z.string().min(5, 'Le mot de passe est obligatoire'),
  departement: z.string().min(1, 'Le departement est obligatoire'),
  grade: z.string().min(1, 'Le grade est obligatoire')
});
// definition de la constante d'encapsulation des grades
const grades = [
  { value: 'A1', label: 'Grade A1' },
  { value: 'A2', label: 'Grade A2' },
  { value: 'B1', label: 'Grade B1' },
  { value: 'B2', label: 'Grade B2' },
  // Ajoute autant de grades que nécessaire
];
const Register = () => {
  const { register, handleSubmit, reset, formState, getFieldState } = useForm<IRegisterRequest>({ resolver: zodResolver(schema), mode: 'onTouched' });
  const [registerUser, { data, error, isLoading, isSuccess }] = userAPI.useRegisterUserMutation();

  const isFieldValid = (fieldName: keyof IRegisterRequest): boolean => getFieldState(fieldName, formState).isTouched && !getFieldState(fieldName, formState).invalid;

  const handleRegister = async (registerRequest: IRegisterRequest) => await registerUser(registerRequest);

  React.useEffect(() => reset(), [isSuccess]);
  
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginTop: '100px' }}>
          <div className="card">
            <div className="card-body"> 
              <h2 className="mb-3"><img src={logo} alt="Logo" width="40" height="40" style={{ padding: '0', margin: '0', borderRadius: '0.370rem' }} /> ARA         S'enregistrer </h2>
              {error && <div className="alert alert-dismissible alert-danger">
                {'data' in error ? (error.data as IResponse<void>).message! : 'Une erreur s\'est produite'}
              </div>}
              {isSuccess && <div className="alert alert-dismissible alert-success">
                {data.message}
              </div>}
              <hr />
              <form onSubmit={handleSubmit(handleRegister)} className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="firstName" className="form-label">Prenom</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                      <input type="text" {...register('firstName')} name='firstName' className={`form-control ' ${formState.errors.firstName ? 'is-invalid' : ''} ${isFieldValid('firstName') ? 'is-valid' : ''}`} id="firstName" placeholder="Prenom" disabled={isLoading} required />
                      <div className="invalid-feedback">{formState.errors.firstName?.message}</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="lastName" className="form-label">Nom</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                      <input type="text" {...register('lastName')} name='lastName' className={`form-control ' ${formState.errors.lastName ? 'is-invalid' : ''} ${isFieldValid('lastName') ? 'is-valid' : ''}`} id="lastName" placeholder="Nom" disabled={isLoading} required />
                      <div className="invalid-feedback">{formState.errors.lastName?.message}</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Adresse mail</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                      <input type="text" {...register('email')} name='email' className={`form-control ' ${formState.errors.email ? 'is-invalid' : ''} ${isFieldValid('email') ? 'is-valid' : ''}`} id="email" placeholder="Adresse email" disabled={isLoading} required />
                      <div className="invalid-feedback">{formState.errors.email?.message}</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-key"></i></span>
                      <input type="password" {...register('password')} name='password' className={`form-control ' ${formState.errors.password ? 'is-invalid' : ''} ${isFieldValid('password') ? 'is-valid' : ''}`} placeholder="Mot de passe" disabled={isLoading} required />
                      <div className="invalid-feedback">{formState.errors.password?.message}</div>
                    </div>
                  </div>
                  {/* rajout des parametres de commandant DIABY*/}
                  <div className="col-12">
                    <label htmlFor="departement" className="form-label">Département</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-building"></i></span>
                      <select
                        {...register('departement')}
                        name='departement'
                        className={`form-control ${formState.errors.departement ? 'is-invalid' : ''} ${isFieldValid('departement') ? 'is-valid' : ''}`}
                        disabled={isLoading}
                        required
                      >
                        <option value="">Sélectionner un département</option>
                        {/* Ajoute ici les départements prédéfinis */}
                        <option value="01">DLRRI</option>
                        <option value="02">Direction Informatique et Statistique</option>
                        <option value="03">Direction Regionale de conakry Port</option>
                        {/* ... autres départements */}
                      </select>
                      <div className="invalid-feedback">{formState.errors.departement?.message}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="grade" className="form-label">Grade</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-award"></i></span>
                      <select
                        {...register('grade')}
                        name='grade'
                        className={`form-control ${formState.errors.grade ? 'is-invalid' : ''} ${isFieldValid('grade') ? 'is-valid' : ''}`}
                        disabled={isLoading}
                        required
                      >
                        <option value="">Sélectionner un grade</option>
                        {grades.map((grade) => (
                          <option key={grade.value} value={grade.value}>{grade.label}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{formState.errors.grade?.message}</div>
                    </div>
                  </div>
                  {/* fin du rajout des params de commandant DIABY */}
                </div>
                <hr className="my-4" />
                <div className="col">
                  <button disabled={formState.isSubmitting || isLoading} className="btn btn-primary" type="submit" >
                    {(formState.isSubmitting || isLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                    <span role="status">{(formState.isSubmitting || isLoading) ? 'Chargement...' : 'S\'enregistrer'}</span>
                  </button>
                </div>
              </form>
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

export default Register;