import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import AuthState from "./context/AuthContext/AuthState";
import MoviesState from "./context/MovieContext/MoviesState";
import ActiveState from "./context/ActiveContext/ActiveState";
import ScrollState from "./context/ScrollContex/ScrollState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthState>
        <ActiveState>
          <MoviesState>
            <ScrollState>
              <Header />
              <App />
              <Footer />
            </ScrollState>
          </MoviesState>
        </ActiveState>
      </AuthState>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
