import "./AboutUser.css";
import "./animationRole.css";

import React from "react";
import { useOutletContext, Link } from "react-router-dom";

export default function AboutUser() {
  const user = useOutletContext();

  const {
    fullname,
    username,
    createdAt,
    email,
    address,
    role,
    date_of_birth: { day, month, year },
    gender,
    phone,
  } = user;

  const showRole = {
    super_root: {
      jsx: (
        <p className="show-root">
          <small>S</small>
          <small>U</small>
          <small>P</small>
          <small>E</small>
          <small>R</small>
          <small> </small>
          <small>R</small>
          <small>O</small>
          <small>O</small>
          <small>T</small>
        </p>
      ),
    },
    admin: {
      jsx: (
        <p className="show-admin">
          <small>A</small>
          <small>D</small>
          <small>M</small>
          <small>I</small>
          <small>N</small>
          <small>I</small>
          <small>S</small>
          <small>T</small>
          <small>R</small>
          <small>A</small>
          <small>T</small>
          <small>O</small>
          <small>R</small>
        </p>
      ),
    },
    moderator: {
      jsx: (
        <p className="show-moderator">
          <small>M</small>
          <small>O</small>
          <small>D</small>
          <small>E</small>
          <small>R</small>
          <small>A</small>
          <small>T</small>
          <small>O</small>
          <small>R</small>
        </p>
      ),
    },
    regular_member: {
      jsx: (
        <p className="show-member">
          <small>M</small>
          <small>E</small>
          <small>M</small>
          <small>B</small>
          <small>E</small>
          <small>R</small>
        </p>
      ),
    },
  };

  return (
    <div className="about-user">
      <div className="about-user-container">
        <ul className="about_item">
          <li>
            <h2>User details</h2>
            <span>
              <Link to="/profile/edit-profile" className="edit-profile-link">
                Edit profile
              </Link>
            </span>
          </li>
          <li>
            <p>Registration date</p>
            <span>{new Date(createdAt).toLocaleDateString("vn-VN")}</span>
          </li>
          <li>
            <p>Full name</p>
            <span>{fullname}</span>
          </li>
          <li>
            <p>Username</p>
            <span>{username}</span>
          </li>
          <li>
            <p>Email address</p>
            <span
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "https://gmail.com",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <Link to=".">{email}</Link>
            </span>
          </li>
        </ul>
        <ul className="about_item">
          <li>
            <p>Phone</p>
            <span>{phone}</span>
          </li>
          <li>
            <p>Birthday</p>
            <span>
              {day}/{month}/{year}
            </span>
          </li>
          <li>
            <p>Gender</p>
            <span>{gender}</span>
          </li>
          <li>
            <p>Address</p>
            <span>{address}</span>
          </li>
          <li>
            <p>Role</p>
            {showRole[role].jsx}
          </li>
        </ul>
      </div>
    </div>
  );
}
