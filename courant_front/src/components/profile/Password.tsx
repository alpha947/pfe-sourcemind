import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UpdatePassword } from '../../models/ICredentials';
import { userAPI } from '../../services/UserService';
import Loader from './Loader';

const schema = z.object({
  newPassword: z.string().min(5, { message: 'Le nouveau mot de passe est requis' }),
  confirmNewPassword: z.string().min(5, { message: 'La confirmation du mot de passe est requise' }),
  password: z.string().min(5, { message: 'Le mot de passe est requis' }),
}).superRefine(({ newPassword, confirmNewPassword }, ctx) => {
  if(newPassword !== confirmNewPassword) {
      ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmNewPassword'],
          message: 'Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas'
      })
  }
});

const Password = () => {
  const { register, handleSubmit, reset, formState: form, getFieldState } = useForm<UpdatePassword>({ resolver: zodResolver(schema), mode: 'onTouched' });
  const { data: user, error, isSuccess, isLoading, refetch } = userAPI.useFetchUserQuery();
  const [updatePassword, { data: updateData, isLoading: updateLoading, isSuccess: updateSuccess }] = userAPI.useUpdatePasswordMutation();

  const isFieldValid = (fieldName: keyof UpdatePassword): boolean => getFieldState(fieldName, form).isTouched && !getFieldState(fieldName, form).invalid;

  const onUpdatePassowrd = async (request: UpdatePassword) => await updatePassword(request);

  React.useEffect(() => reset(), [updateSuccess]);

  return (
    <>
      {isLoading && <Loader />}
      {isSuccess && <>
        <h4 className="mb-3">Mot de passe</h4>
        <hr />
        <form onSubmit={handleSubmit(onUpdatePassowrd)} className="needs-validation" noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="password" className="form-label">Mot de passe actuel</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-key"></i></span>
                <input type="password" {...register('password')} className={`form-control ' ${form.errors.password ? 'is-invalid' : ''} ${isFieldValid('password') ? 'is-valid' : ''}`} name="password" placeholder="Mot de passe actuel" required />
                <div className="invalid-feedback">{form.errors.password?.message}</div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="col-12">
              <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-key"></i></span>
              <input type="password" {...register('newPassword')} className={`form-control ' ${form.errors.newPassword ? 'is-invalid' : ''} ${isFieldValid('newPassword') ? 'is-valid' : ''}`} name="newPassword" placeholder="Nouveau mot de passe" required />
              <div className="invalid-feedback">{form.errors.newPassword?.message}</div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="address" className="form-label">Confirmer le nouveau mot de passe</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-key"></i></span>
              <input type="password" {...register('confirmNewPassword')} className={`form-control ' ${form.errors.confirmNewPassword ? 'is-invalid' : ''} ${isFieldValid('confirmNewPassword') ? 'is-valid' : ''}`} name="confirmNewPassword" placeholder="Confirmer le nouveau mot de passe" required />
              <div className="invalid-feedback">{form.errors.confirmNewPassword?.message}</div>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="col">
            <button disabled={!form.isValid || form.isSubmitting || isLoading || updateLoading} className="btn btn-primary btn-block" type="submit" >
              {(form.isSubmitting || isLoading || updateLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
              <span role="status">{(form.isSubmitting || isLoading || updateLoading) ? 'Chargement...' : 'Modifier'}</span>
            </button>
          </div>
        </form>
      </>}
    </>
  )
}

export default Password;