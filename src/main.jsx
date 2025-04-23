import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// TODO: add react router when ready to pass queries to url
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <p>Error</p>,
//   },
// ]);

// TODO: change root for app when ready to integrated with Opensquare
ReactDOM.createRoot(document.getElementById("app")).render(
    // <React.StrictMode>
    //   <RouterProvider router={router} />
    // </React.StrictMode>
    <App />
);
