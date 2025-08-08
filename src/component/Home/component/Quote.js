import "./Quote.css";
import React from "react";

const Quote = ({ quote, avatar, author }) => {
  return (
    <div className="quote-card">
      <div className="blockquote">
        <svg
          height="1rem"
          className="svg-quote-top"
          fill="#98b72b"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 32 32"
        >
          <g>
            <g id="right_x5F_quote">
              <g>
                <path d="M0,4v12h8c0,4.41-3.586,8-8,8v4c6.617,0,12-5.383,12-12V4H0z"></path>
                <path d="M20,4v12h8c0,4.41-3.586,8-8,8v4c6.617,0,12-5.383,12-12V4H20z"></path>
              </g>
            </g>
          </g>
        </svg>
        <blockquote className="leading-relaxed">{quote}</blockquote>
      </div>

      <div className="items-center">
        <img
          alt="Yifan testimonial for ShipFast"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="avatar-author"
          src={avatar}
        />
        <p className="quote_name_author">
          <strong>Author: </strong>
          <span>{author}</span>
        </p>
      </div>
    </div>
  );
};

export default Quote;
