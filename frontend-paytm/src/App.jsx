import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import React, { Suspense } from "react";

const Signin = React.lazy(() => import("./pages/Signin"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const SendMoney = React.lazy(() => import("./pages/SendMoney"));
const History = React.lazy(() => import("./pages/History"));

const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/send", element: <SendMoney /> },
  { path: "/history", element: <History /> },
]);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
