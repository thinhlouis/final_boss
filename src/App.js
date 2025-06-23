import "./App.css";
import { Route, Routes } from "react-router-dom";

import AuthState from "./context/AuthState";
import LoginPage from "./component/LoginPage/LoginPage";
import RegisterPage from "./component/RegisterPage/RegisterPage";
import UploadVideo from "./component/UploadVideo/UploadVideo";
import Header from "./component/Header/Header";
import PrivateLogin from "./component/PrivateRoute/PrivateLogin";
import PublicRoute from "./component/PublicRoute/PublicRoute";
import Home from "./component/Home/Home";
import BodyMassIndexCalculator from "./component/BMI/BodyMassIndexCalculator";
import Error from "./component/Error/Error";
import Cinemas from "./component/Cinemas/Cinemas";

function App() {
  return (
    <AuthState>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/video-final-boss-202115-767"
            element={
              <PrivateLogin>
                <Cinemas />
              </PrivateLogin>
            }
          />
          <Route
            path="/sigin"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route path="/bmi" element={<BodyMassIndexCalculator />} />
          <Route
            path="/sigup"
            element={
              <PrivateLogin>
                <RegisterPage />
              </PrivateLogin>
            }
          />

          <Route
            path="/upload-video-767202115"
            element={
              <PrivateLogin>
                <UploadVideo />
              </PrivateLogin>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </AuthState>
  );
}

export default App;
