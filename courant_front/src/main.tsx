import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import App from './App.tsx';
import Login from './components/Login.tsx';
import NavBar from './components/NavBar.tsx';
import NotFound from './components/NotFound.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Register from './components/Register.tsx';
import ResetPassword from './components/ResetPassword.tsx';
import Restricted from './components/Restricted.tsx';
import VerifyAccount from './components/VerifyAccount.tsx';
import VerifyPassword from './components/VerifyPassword.tsx';
import Actes from './components/actes/Actes.tsx';
import DocumentDetails from './components/document/DocumentDetails.tsx';
import Documents from './components/document/Documents.tsx';
import Authentication from './components/profile/Authentication.tsx';
import Authorization from './components/profile/Authorization.tsx';
import Password from './components/profile/Password.tsx';
import Profile from './components/profile/Profile.tsx';
import Settings from './components/profile/Settings.tsx';
import User from './components/profile/User.tsx';
import Users from './components/users/Users.tsx';
import './index.css';
import { setupStore } from './store/store.ts';

const store = setupStore();
const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='resetpassword' element={<ResetPassword />} />
    <Route path='verify/account' element={<VerifyAccount />} />
    <Route path='verify/password' element={<VerifyPassword />} />
    <Route element={<ProtectedRoute />} >
      <Route element={<NavBar />}>
      {/* pour la configuration des requirements de ara */}
        <Route index path='/actes' element={<Actes />} />
        <Route index path='/documents' element={<Documents />} />
        <Route path='/' element={<Navigate to={'/documents'} />} />
        <Route path='documents/:documentId' element={<DocumentDetails />} />
        <Route element={<Restricted />} >
          <Route path='users' element={<Users />} />
        </Route>
        <Route path='/user' element={<User />} >
          <Route path='/user' element={<Navigate to='/user/profile' />} />
          <Route path='profile' element={<Profile />} />
          <Route path='password' element={<Password />} />
          <Route path='settings' element={<Settings />} />
          <Route path='authorization' element={<Authorization />} />
          <Route path='authentication' element={<Authentication />} />
        </Route>
      </Route>
    </Route>
    <Route path='*' element={<NotFound />} />
  </Route>
));

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store} >
    <RouterProvider router={router} />
  </Provider>
);