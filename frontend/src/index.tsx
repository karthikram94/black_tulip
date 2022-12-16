import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Login from './Components/common/login';
import Signup from './Components/common/signup';
import Forgotpassword from './Components/common/forgotpassword';
import Admin from './Components/Admin';
import Users from './Components/Users';
import ProtectedRoute from './Components/common/protectedroute';
import { Provider } from "react-redux";
import {store} from "./helpers"
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/forgotpassword",
    element: <Forgotpassword />
  },
  {
    path: "/user",
    element: <ProtectedRoute loader={<Users />} userAccess={2} />
  },
  {
    path: "/admin",
    element: <ProtectedRoute loader={<Admin />} userAccess={1} />
  },
])
const storeaccess:any = store
root.render(
  <React.StrictMode>
    <Provider store={storeaccess}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
