import "./App.css";
import { Route, Routes } from "react-router-dom";

import VideoPlaylistStream from "./component/VideoPlaylis/VideoPlaylist";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<VideoPlaylistStream />} />
      </Routes>
    </div>
  );
}

export default App;
