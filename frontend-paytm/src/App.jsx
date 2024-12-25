import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import React, { Suspense, useEffect, useState } from "react";

const Signin = React.lazy(() => import("./pages/Signin"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const SendMoney = React.lazy(() => import("./pages/SendMoney"));
const History = React.lazy(() => import("./pages/History"));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a small delay for token validation (if needed).
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); // Mark as not authenticated
    } else {
      setLoading(false); // Proceed if authenticated
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while validating
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/send",
      element: (
        <ProtectedRoute>
          <SendMoney />
        </ProtectedRoute>
      ),
    },
    {
      path: "/history",
      element: (
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
