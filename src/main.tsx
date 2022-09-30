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

if (import.meta.env.PROD) {
    if (APP_VERSION.includes("dev")) {
        console.log("test")
        alert("WARNING: This website version very much being built! Many things will not work! Not all features will be available! DO NOT USE FOR SERIOUS APPLICATIONS")
    }
    else if (APP_VERSION.includes("alpha")){
        alert("This website version is in alpha! Beware of bugs and crashes! Not all planned features has been implemented. Not Recommended for use.")
    }
    else if (APP_VERSION.includes("beta")){
        alert("This website version is in beta! Not much testing has been done. Beware of bugs!")
    }
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

