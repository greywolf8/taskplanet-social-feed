'use client';

import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DefaultAvatar from "./DefaultAvatar";
import styles from "./Header.module.css";

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Social</h1>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search promotions, users, posts..."
            onClick={() => navigate('/search')}
            readOnly
          />
          <button type="button" className={styles.searchBtn} onClick={() => navigate('/search')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <div className={styles.searchProfileIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <div className={styles.userSection}>
          <div className={styles.iconButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className={styles.iconBadge}>50</span>
          </div>
          
          <div className={styles.iconButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span className={styles.iconBadge}>₹0.00</span>
          </div>
          
          <div className={styles.iconButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          
          <div className={styles.userProfile} onClick={() => navigate('/profile')}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M12 13c-4 0-7 2-7 6v1h14v-1c0-4-3-6-7-6z"></path>
                </svg>
              </div>
            )}
            <span className={styles.profileBadge}>20%</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
