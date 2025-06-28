import { Route, Routes } from "react-router-dom";

import "./App.css";
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
import WeatherCard from "./component/Weather/WeatherCard";
import MovieBox from "./component/Movies/MovieBox";
import MovieDetail from "./component/Movies/MovieDetail";
import PlayMovie from "./component/PlayMovie/PlayMovie";
import Footer from "./component/Footer/Footer";
import ScreenPage from "./component/ScreenPage/ScreenPage";
import DashBoard from "./component/DashBoard/DashBoard";
import InformationUser from "./component/InformationUser/InformationUser";
import AddQuote from "./component/Home/component/ActionWithQuote";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bmi" element={<BodyMassIndexCalculator />} />
        <Route path="/weather" element={<WeatherCard />} />

        <Route
          path="/movies"
          element={
            <ScreenPage>
              <MovieBox />
            </ScreenPage>
          }
        />
        <Route
          path="/movies/:slug_movie"
          element={
            <ScreenPage>
              <MovieDetail />
            </ScreenPage>
          }
        />
        <Route
          path="/player/:slug_name/:slug_eps"
          element={
            <ScreenPage>
              <PlayMovie />
            </ScreenPage>
          }
        />
        <Route
          path="/video-final-boss-202115-767"
          element={
            <PrivateLogin>
              <Cinemas />
            </PrivateLogin>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateLogin>
              <DashBoard />
            </PrivateLogin>
          }
        >
          <Route
            index
            element={
              <PrivateLogin>
                <RegisterPage />
              </PrivateLogin>
            }
          />
          <Route
            path="search-member"
            element={
              <PrivateLogin>
                <InformationUser />
              </PrivateLogin>
            }
          />
          <Route
            path="action-quote"
            element={
              <PrivateLogin>
                <AddQuote />
              </PrivateLogin>
            }
          />
        </Route>

        <Route
          path="/sigin"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
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
      <Footer />
    </div>
  );
}

export default App;
