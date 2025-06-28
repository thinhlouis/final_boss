import "./CustomControl.css";

import React from "react";

import {
  RiReplay10Fill,
  RiForward10Fill,
  RiPlayLargeFill,
  RiPauseLargeFill,
  RiFullscreenFill,
  RiVolumeMuteFill,
  RiVolumeUpFill,
} from "react-icons/ri";

export default function CustomControl({
  play,
  setPlay,
  muted,
  setMuted,
  replay,
  forward,
  fullScreen,
}) {
  return (
    <div className="custom-control">
      <div className="control-center">
        <button className="button_replay" onClick={replay}>
          <RiReplay10Fill />
        </button>
        <button className="button_play-pause">
          {play ? <RiPauseLargeFill /> : <RiPlayLargeFill />}
        </button>
        <button className="button_forward" onClick={forward}>
          <RiForward10Fill />
        </button>
      </div>
      <div className="control-bottom">
        <button className="button_muted">
          {muted ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
        </button>
        <button className="button_full-screen" onClick={fullScreen}>
          <RiFullscreenFill />
        </button>
      </div>
    </div>
  );
}
