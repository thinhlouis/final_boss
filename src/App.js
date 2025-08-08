import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { throttle } from "lodash";

import "./App.css";
import LoginPage from "./component/LoginPage/LoginPage";
import RegisterPage from "./component/RegisterPage/RegisterPage";
import UploadVideo from "./component/UploadVideo/UploadVideo";
import UploadImage from "./component/UploadImage/UploadImage";
import PublicRoute from "./component/PublicRoute/PublicRoute";
import Home from "./component/Home/Home";
import BodyMassIndexCalculator from "./component/BMI/BodyMassIndexCalculator";
import Error from "./component/Error/Error";
import WeatherCard from "./component/Weather/WeatherCard";
import MovieDetail from "./component/Movies/MovieDetail";
import PlayMovie from "./component/PlayMovie/PlayMovie";
import ScreenPage from "./component/ScreenPage/ScreenPage";
import DashBoard from "./component/DashBoard/DashBoard";
import WellcomRoot from "./component/DashBoard/WellcomRoot";
import UserProfile from "./component/UserProfie/UserProfile";
import AboutUser from "./component/AboutUser/AboutUser";
import EditProfile from "./component/EditProfile/EditProfile";
import InformationUser from "./component/InformationUser/InformationUser";
import AddQuote from "./component/Home/component/ActionWithQuote";
import ResetPassword from "./component/ResetPassword/ResetPassword";
import InactivityModal from "./component/InactivityModal/InactivityModal";

const LazyMoviesPage = lazy(() => import("./component/Movies/Movies"));

const LazyVideoRealPage = lazy(() =>
  import("./component/Cinemas/VideoRealistic/VideoRealistic")
);
const LazyVideoJvPage = lazy(() =>
  import("./component/Cinemas/VideoPlaylist/VideoPlaylist")
);

const LazyGalleryPage = lazy(() =>
  import("./component/GallerysRealistic/GallerysRealistic")
);

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [fullPage, setFullPage] = useState(false);

  const { pathname } = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 100,
      behavior: "smooth", // Để cuộn mượt mà
    });
  };
  const handleScroll = throttle(() => {
    // Kiểm tra vị trí cuộn: nếu cuộn xuống quá 100px thì hiển thị nút
    if (window.pageYOffset > 700) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, 1000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const path = ["/admin", "/player"];
    const isPage = path.some((p) => pathname.includes(p));
    if (isPage) {
      setFullPage(true);
      return;
    }
    setFullPage(false);
  }, [pathname]);

  return (
    <InactivityModal>
      <div className="App">
        <aside className={fullPage ? "aside_left_full" : "aside_left"}></aside>
        <main className={fullPage ? "container_main_full" : "container_main"}>
          <Suspense fallback={<div>Đang tải trang...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bmi" element={<BodyMassIndexCalculator />} />

              <Route
                path="/sigin"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route path="/weather" element={<WeatherCard />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/ksc" element={<ScreenPage />}>
                <Route path="movies" element={<LazyMoviesPage />} />
                <Route path="movies/:slug_movie" element={<MovieDetail />} />
                <Route
                  path="player/:slug_name/:slug_eps"
                  element={<PlayMovie setFullPage={setFullPage} />}
                />
              </Route>

              <Route
                path="/admin"
                element={<DashBoard setFullPage={setFullPage} />}
              >
                <Route index element={<WellcomRoot />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="search-member" element={<InformationUser />} />
                <Route path="action-quote" element={<AddQuote />} />
                <Route path="upload-video" element={<UploadVideo />} />
                <Route path="upload-image" element={<UploadImage />} />
                <Route
                  path="video-vip"
                  element={<LazyVideoJvPage scrollToTop={scrollToTop} />}
                />
                <Route
                  path="video-pro"
                  element={<LazyVideoRealPage scrollToTop={scrollToTop} />}
                />
                <Route path="gallery" element={<LazyGalleryPage />} />
              </Route>

              <Route path="/profile" element={<UserProfile />}>
                <Route index element={<AboutUser />} />
                <Route path="edit-profile" element={<EditProfile />} />
              </Route>

              <Route path="*" element={<Error />} />
              <Route path="/404" element={<Error />} />
            </Routes>
          </Suspense>
        </main>
        <aside
          className={fullPage ? "aside_right_full" : "aside_right"}
        ></aside>
      </div>
      {isVisible && (
        <button className="scroll-to-top-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </InactivityModal>
  );
}

export default App;
