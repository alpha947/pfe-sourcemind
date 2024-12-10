import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { IRegisterRequest } from '../../models/ICredentials';
import { userAPI } from '../../services/UserService';
import Loader from './Loader';

const schema = z.object({
  email: z.string().min(3, 'L\adresse email est requise').email('Adresse email invalide'),
  firstName: z.string().min(1, 'Le prenom est obligatoire'),
  lastName: z.string().min(1, 'Le nom de famille est obligatoire'),
  bio: z.string().min(5, 'La Biographie est obligatoire'),
  phone: z.string().min(5, 'Phone is required')
});

const Profile = () => {
  const { register, handleSubmit, formState: form, getFieldState } = useForm<IRegisterRequest>({ resolver: zodResolver(schema), mode: 'onTouched' });
  const { data: user, error, isSuccess, isLoading, refetch } = userAPI.useFetchUserQuery();
  const [update, { data: updateData, isLoading: updateLoading }] = userAPI.useUpdateUserMutation();

  const updateUser = async (user: IRegisterRequest) => await update(user);

  const isFieldValid = (fieldName: keyof IRegisterRequest): boolean => getFieldState(fieldName, form).isTouched && !getFieldState(fieldName, form).invalid;

  return (
    <>
      {isLoading && <Loader /> }
      {isSuccess && <>
        <h4 className="mb-3">Profil</h4>
        <hr />
        <form onSubmit={handleSubmit(updateUser)} className="needs-validation" noValidate>
          <div className="row g-3">
            <div className="col-sm-6">
              <label htmlFor="firstName" className="form-label">Prenom</label><div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                <input type="text" {...register('firstName')} className={`form-control ' ${form.errors.firstName? 'is-invalid' : ''} ${isFieldValid('firstName') ? 'is-valid' : '' }`} placeholder="Prenom" defaultValue={user?.data.user.firstName} disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.firstName?.message}</div>
                </div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="lastName" className="form-label">Nom</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                <input type="text" {...register('lastName')} className={`form-control ' ${form.errors.lastName? 'is-invalid' : ''} ${isFieldValid('lastName') ? 'is-valid' : '' }`} placeholder="Nom de famille" defaultValue={user?.data.user.lastName} disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.lastName?.message}</div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input type="text" {...register('email')} className={`form-control ' ${form.errors.email? 'is-invalid' : ''} ${isFieldValid('email') ? 'is-valid' : '' }`} placeholder="Email" defaultValue={user?.data.user.email} disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.email?.message}</div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="phone" className="form-label">Numero de telephone</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                <input type="text" {...register('phone')} className={`form-control ' ${form.errors.phone? 'is-invalid' : ''} ${isFieldValid('phone') ? 'is-valid' : '' }`} placeholder="626 92 91 78" defaultValue={user?.data.user.phone} disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.phone?.message}</div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="bio" className="form-label">Biographie</label>
              <textarea className={`form-control ' ${form.errors.bio? 'is-invalid' : ''} ${isFieldValid('bio') ? 'is-valid' : '' }`} {...register('bio')} placeholder="Quelque chose sur vous-même ici" defaultValue={user?.data.user.bio} disabled={user?.data.user.role === 'USER'} rows={3} required></textarea>
              <div className="invalid-feedback">{form.errors.bio?.message}</div>
            </div>
          </div>
          <hr className="my-4"/>
          <div className="col">
            <button disabled={!form.isValid || form.isSubmitting || isLoading || updateLoading || user?.data.user.role === 'USER'} className="btn btn-primary btn-block" type="submit" >
                  {(form.isSubmitting || isLoading || updateLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                    <span role="status">{(form.isSubmitting || isLoading || updateLoading) ? 'Chargement...' : 'Modifier'}</span>
                  </button>
          </div>
        </form>
      </>}
    </>
  )
}

export default Profile;