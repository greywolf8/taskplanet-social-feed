'use client';

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DefaultAvatar from "../components/DefaultAvatar";
import styles from "./SearchPage.module.css";

function SearchPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Posts");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCounts, setUserCounts] = useState({ posts: 0, users: 292, promotions: 0 });

  const tabs = [
    { id: "Posts", label: "Posts", count: userCounts.posts },
    { id: "Users", label: "Users", count: userCounts.users },
    { id: "Promotions", label: "Promotions", count: userCounts.promotions }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeTab]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let results = [];
      
      if (activeTab === "Users") {
        // Search real users from database
        const response = await fetch(`http://localhost:5000/api/auth/search?q=${searchQuery}`);
        if (response.ok) {
          const users = await response.json();
          results = users.map(user => ({
            id: user._id,
            username: user.username,
            handle: `@${user.username.toLowerCase().replace(/\s+/g, '')}`,
            avatar: user.profilePicture,
            isFollowing: false
          }));
        }
      } else if (activeTab === "Posts") {
        // Search real posts from database
        const response = await fetch(`http://localhost:5000/api/posts/search?q=${searchQuery}`);
        if (response.ok) {
          const posts = await response.json();
          results = posts.map(post => ({
            id: post._id,
            content: post.content,
            author: post.author.username,
            likes: post.likeCount,
            comments: post.commentCount
          }));
        }
      } else if (activeTab === "Promotions") {
        // Search posts with promotion content
        const response = await fetch(`http://localhost:5000/api/posts/search?q=${searchQuery}&category=Promotions`);
        if (response.ok) {
          const posts = await response.json();
          results = posts.map(post => ({
            id: post._id,
            title: post.content.substring(0, 50) + "...",
            type: "Promotion",
            reward: "Points",
            company: "Social Platform"
          }));
        }
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update the UI to reflect the follow status
        setSearchResults(prevResults => 
          prevResults.map(result => 
            result.id === userId 
              ? { ...result, isFollowing: result.isFollowing }
              : result
          )
        );
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <button onClick={handleBack} className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"></path>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        
        <div className={styles.searchBar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
        </div>
      </div>

      {searchQuery && (
        <div className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count > 0 && <span className={styles.count}>({tab.count})</span>}
            </button>
          ))}
        </div>
      )}

      <div className={styles.resultsContainer}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Searching...</p>
          </div>
        )}

        {!loading && searchQuery && searchResults.length === 0 && (
          <div className={styles.noResults}>
            <p>No {activeTab.toLowerCase()} found for "{searchQuery}"</p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div className={styles.resultsList}>
            {activeTab === "Users" && searchResults.map((user) => (
              <div key={user.id} className={styles.userCard}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className={styles.userAvatar} />
                ) : (
                  <div className={styles.userAvatar}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="7" r="4"></circle>
                      <path d="M12 13c-4 0-7 2-7 6v1h14v-1c0-4-3-6-7-6z"></path>
                    </svg>
                  </div>
                )}
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{user.username}</h3>
                  <p className={styles.userHandle}>{user.handle}</p>
                </div>
                <button
                  className={`${styles.followBtn} ${user.isFollowing ? styles.following : ""}`}
                  onClick={() => handleFollow(user.id)}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))}

            {activeTab === "Posts" && searchResults.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={styles.postAuthor}>{post.author}</span>
                </div>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postStats}>
                  <span className={styles.stat}>♥ {post.likes}</span>
                  <span className={styles.stat}>💬 {post.comments}</span>
                </div>
              </div>
            ))}

            {activeTab === "Promotions" && searchResults.map((promo) => (
              <div key={promo.id} className={styles.promoCard}>
                <div className={styles.promoHeader}>
                  <h3 className={styles.promoTitle}>{promo.title}</h3>
                  <span className={styles.promoType}>{promo.type}</span>
                </div>
                <p className={styles.promoCompany}>{promo.company}</p>
                <div className={styles.promoReward}>
                  <span className={styles.rewardLabel}>Reward:</span>
                  <span className={styles.rewardAmount}>{promo.reward}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
