import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Auth } from './pages/AuthPage/Auth';
import { Main } from './pages/MainPage/Main';
import { checkTokenExpiration } from './store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

function App() {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
     dispatch(checkTokenExpiration());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? (
        <Navigate to="/main" />
      ) : (
        <Navigate to="/login" />
      ),
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/main" /> : <Auth />,
    },
    {
      path: 'signup',
      element: isAuthenticated ? <Navigate to="/main" /> : <Auth />,
    },
    {
      path: 'main',
      element: isAuthenticated ? <Main /> : <Navigate to="/login" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
