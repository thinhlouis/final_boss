import React from "react";

import displayText from "../../utils/displayText";

export default function UploadForm({ video, index, setVideoLinks }) {
  return (
    <div className="upload-video-form">
      <h3 style={{ color: "#657e1f" }}>Video {index + 1}</h3>
      <label htmlFor={`name-video-${index}`} className="label-form-upload">
        <span>Name Video:</span>
        <input
          type="text"
          id={`name-video-${index}`}
          value={displayText(video.name, 15)}
          readOnly
        />
      </label>

      <label htmlFor={`thumbnail-video-${index}`} className="label-form-upload">
        <span>Thumbnail Video:</span>
        {video.thumbnail !== "" ? (
          <input
            type="text"
            id={`thumbnail-video-${index}`}
            readOnly
            value={displayText(video.thumbnail, 15)}
          />
        ) : (
          <input
            type="text"
            id={`thumbnail-video-${index}`}
            value={video.thumbnail}
            onChange={(e) =>
              setVideoLinks((prevVideoLinks) =>
                prevVideoLinks.map((v, i) =>
                  i === index ? { ...v, thumbnail: e.target.value } : v
                )
              )
            }
          />
        )}
      </label>
      <label htmlFor={`url-video-${index}`} className="label-form-upload">
        <span>URL Video:</span>
        <input
          type="text"
          id={`url-video-${index}`}
          value={displayText(video.url, 15)}
          readOnly
        />
      </label>
      <label htmlFor={`tag-video-${index}`} className="label-form-upload">
        <span>Tag Video:</span>
        <select
          id={`tag-video-${index}`}
          value={video.tag}
          onChange={(e) =>
            setVideoLinks((prevVideoLinks) =>
              prevVideoLinks.map((v, i) =>
                i === index ? { ...v, tag: e.target.value } : v
              )
            )
          }
        >
          <option value="normal">Normal Video</option>
          <option value="hot">Hot Video</option>
          <option value="video_real">Real Video</option>
        </select>
      </label>
      <span className="border-form">------------------</span>
    </div>
  );
}
