import "./PlayMovie.css";
import HLSMoviePlayer from "./HLSMoviePlayer";
import not_found from "../../assets/video-not-found.png";
import membership from "../../assets/vip.png";
import qr_code from "../../assets/qr_code.png";
import telegram from "../../assets/telegram_logo_icon.png";
import { session, local } from "../../utils/setStorage";
import ActiveContext from "../../context/ActiveContext/ActiveContext";
import AuthContext from "../../context/AuthContext/AuthContext";

import { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { FadeLoader } from "react-spinners";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function PlayMovie() {
  const [usenameOrEmal, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [urlMovie, setUrlMovie] = useState("");
  const [poster, setPoster] = useState(null);
  const [hidePass, setHidePass] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errorPage, setErrorPage] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [vipBox, setVipBox] = useState(false);

  const { slug_name, slug_eps } = useParams();
  const { verifyMembership } = useContext(ActiveContext);
  const {
    auth: { isAuthenticated },
    loading,
    handleSubmitLogin,
  } = useContext(AuthContext);

  const location = useLocation();
  const path = location.pathname;

  const index = local.get("idxsv") ?? 0;

  useEffect(() => {
    const eps = Number(slug_eps.split("tap-")[1]);
    const fetchCurrentMovie = async () => {
      try {
        const response = await axios.get(
          `https://phimapi.com/phim/${slug_name}`
        );

        const {
          episodes,
          movie: { thumb_url },
        } = response?.data;

        console.log(response?.data);

        const { server_data } = episodes[index];

        const url = server_data.find((item) => item.slug === slug_eps);
        const splitEpisode = Math.floor(server_data?.length * 0.4);

        if (!url) {
          setErrorPage(true);
          setNotification(
            "Không tìm thấy tập phim hoặc đã có lỗi xãy ra, vui lòng thử lại sau!"
          );
          return;
        }

        if (eps > splitEpisode) {
          if (!loading && !isAuthenticated) {
            setErrorPage(true);
            setNotification("Vui lòng login!");
            return;
          }

          const user = session.get("userInfo") ?? null;
          if (!user) return;
          const isVip = await verifyMembership(user._id);

          if (!isVip) {
            setVipBox(true);
            setNotification("Tập phim này chỉ dành cho thành viên VIP");
            return;
          }
        }

        setUrlMovie(url.link_m3u8);
        setPoster(thumb_url);
      } catch (error) {
        console.error(error);
        setNotification(error);
        setErrorPage(true);
      } finally {
        setLoadingCurrent(false);
      }
    };
    fetchCurrentMovie();
  }, [slug_eps, slug_name, verifyMembership, isAuthenticated, loading, index]);

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  if (errorPage && notification !== "Vui lòng login!") {
    return (
      <div className="playing-movie root_flex_column">
        <h4 style={{ color: "#F81101", textAlign: "center" }}>
          {notification}
        </h4>
        <img src={not_found} alt="video-not-fond" loading="eager" />
      </div>
    );
  }
  if (!isAuthenticated && errorPage && notification === "Vui lòng login!") {
    return (
      <div className="playing-movie root_flex_column">
        <p
          style={{
            width: "80%",
            color: "#98b72b",
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          Tập phim này chỉ dành cho <span>MEMBER</span> vui lòng <b>login</b>{" "}
          rồi thử lại.
        </p>

        <form
          className="container_login_movie root_flex_column gap_1"
          onSubmit={(e) => handleSubmitLogin(e, usenameOrEmal, password, path)}
        >
          <div className="form-item-login-movie root_flex_column item_start gap_025">
            <label htmlFor="name-login-movie">Username or Email</label>
            <input
              type="text"
              id="name-login-movie"
              value={usenameOrEmal}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>
          <div className="form-item-login-movie root_flex_column item_start gap_025">
            <label htmlFor="pass-login-movie">Password</label>
            <input
              type={hidePass ? "text" : "password"}
              id="pass-login-movie"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={handleHidePass}
              className="hide_unhide-pass-movie"
            >
              {hidePass ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
          <div className="form-item-login-movie root_flex_column item_start">
            <button type="submit">Submit Login</button>
          </div>
        </form>
      </div>
    );
  }

  if (vipBox) {
    return (
      <div className="playing-movie root_flex_column flex_start playing-movie-vip">
        <section className="section-vip-top">
          <img src={membership} alt="video-not-fond" className="membership" />
          <h5>
            {notification}
            <p>Vui lòng quét mã bên dưới để đăng ký thành viên VIP</p>
            <p>Phí đăng kí VIP là 200 cá nha</p>
          </h5>
        </section>
        <section className="section-vip-bottom root_flex_row">
          <img src={qr_code} alt="video-not-fond" className="qr_code" />
          <div className="box-ck root_flex_row flex_start">
            <p>Chuyển khoản xong vui lòng liên hệ</p>
            <a
              href="https://t.me/final_boss_88"
              target="_blank"
              rel="noopener noreferrer"
              className="root_flex_row"
            >
              <img
                src={telegram}
                alt="telegram account"
                className="telegram_icon"
              />
              final_boss_88
            </a>
            <p>gửi bill để được kích hoạt VIP</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="playing-movie">
      {loading && loadingCurrent && !vipBox && !errorPage ? (
        <div className="playing-movie-loading_current">
          <FadeLoader color="#ef4444" />
          <p style={{ marginBottom: "10px", color: "#ef4444" }}>
            Đang tải đợi xíu...
          </p>
        </div>
      ) : (
        <div className="player-movie">
          {<HLSMoviePlayer url={urlMovie} poster={poster} />}
        </div>
      )}
    </div>
  );
}
