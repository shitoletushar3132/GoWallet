import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import React, { Suspense } from "react";

const Signin = React.lazy(() => import("./pages/Signin"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const SendMoney = React.lazy(() => import("./pages/SendMoney"));
const History = React.lazy(() => import("./pages/History"));

const App = () => {
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
      element: <Dashboard />,
    },
    {
      path: "/send",
      element: <SendMoney />,
    },
    {
      path: "/history",
      element: <History />,
    },
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
