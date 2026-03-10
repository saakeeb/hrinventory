import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/Layout';
import ProtectedRoute from '@/ProtectedRoute';
import LoginPage from '@/LoginPage';
import ProfilePage from '@/ProfilePage';
import React from 'react';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProfilePage />, // Default to profile page
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);