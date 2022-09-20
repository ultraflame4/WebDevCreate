import React from 'react'
import ReactDOM from 'react-dom/client'
import {createHashRouter, Navigate, RouterProvider} from "react-router-dom";
import "@/assets/index.scss"
import App from "@/routes/App";

const router = createHashRouter([
    {
        path: "/",
        element: <Navigate replace to={"/app"}/>
    },
    {
        path: "/app",
        element: <App/>,
    }
],);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)
