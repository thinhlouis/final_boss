import "./App.css";
import { Route, Routes } from "react-router-dom";

import AuthState from "./context/AuthState";
import VideoPlaylistStream from "./component/VideoPlaylist/VideoPlaylist";
import LoginPage from "./component/LoginPage/LoginPage";
import UploadVideo from "./component/UploadVideo/UploadVideo";
import Header from "./component/Header/Header";
import PrivateLogin from "./component/PrivateRoute/PrivateLogin";

function App() {
  return (
    <AuthState>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/video-final-boss-202115-767"
            element={
              <PrivateLogin>
                <VideoPlaylistStream />
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
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </AuthState>
  );
}

export default App;
