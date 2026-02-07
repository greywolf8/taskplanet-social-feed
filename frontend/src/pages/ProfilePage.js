'use client';

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { postsAPI, authAPI } from "../services/api";
import BottomNav from "../components/BottomNav";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("My Posts");
  const [userPosts, setUserPosts] = useState([]);
  const [userPromotions, setUserPromotions] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const fileInputRef = React.useRef(null);
  const profileImageInputRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "My Posts", label: "My Posts", count: userPosts.length },
    { id: "Promotions", label: "Promotions", count: userPromotions.length },
    { id: "Liked", label: "Liked", count: likedPosts.length },
    { id: "Commented", label: "Commented", count: commentedPosts.length }
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, activeTab]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      console.log('Fetching user data for user:', user);
      console.log('User ID:', user._id || user.id);
      
      const userId = user._id || user.id;
      
      if (activeTab === "My Posts") {
        // Fetch all posts and filter by current user
        const response = await postsAPI.getAllPosts();
        console.log('All posts:', response.data);
        const userPosts = response.data.filter(post => {
          console.log('Post author:', post.author, 'User ID:', userId);
          // Handle both populated author (object) and author ID (string)
          const authorId = typeof post.author === 'object' ? post.author._id : post.author;
          return post.author && authorId === userId;
        });
        console.log('User posts:', userPosts);
        setUserPosts(userPosts);
      } else if (activeTab === "Promotions") {
        // Fetch posts with promotion category and filter by current user
        const response = await postsAPI.getAllPosts("Promotions");
        const userPromotions = response.data.filter(post => {
          const authorId = typeof post.author === 'object' ? post.author._id : post.author;
          return post.author && authorId === userId;
        });
        setUserPromotions(userPromotions.map(post => ({
          id: post._id,
          title: post.content.substring(0, 50) + "...",
          type: "Refer and Earn",
          reward: "Points",
          company: "Social Platform",
          status: "Active"
        })));
      } else if (activeTab === "Liked") {
        // Fetch all posts and filter by liked by user
        const response = await postsAPI.getAllPosts();
        const likedPosts = response.data.filter(post => 
          post.likes && post.likes.includes(userId)
        );
        setLikedPosts(likedPosts);
      } else if (activeTab === "Commented") {
        // Fetch all posts and filter by commented by user
        const response = await postsAPI.getAllPosts();
        const commentedPosts = response.data.filter(post => 
          post.comments && post.comments.some(comment => {
            const commentAuthorId = typeof comment.author === 'object' ? comment.author._id : comment.author;
            return comment.author && commentAuthorId === userId;
          })
        );
        setCommentedPosts(commentedPosts);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target.result;
          setProfilePictureFile(base64Image);
          
          try {
            // Save to database
            const response = await authAPI.updateProfilePicture(base64Image);
            console.log('Profile picture updated:', response.data);
            
            // Update user context to reflect changes across app
            if (response.data.user) {
              setUser(response.data.user);
            }
          } catch (error) {
            console.error('Error updating profile picture:', error);
            // Show error message to user
            alert('Failed to update profile picture. Please try again.');
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Please select an image file');
        alert('Please select an image file');
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    // Open file picker for profile picture
    profileImageInputRef.current?.click();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "My Posts":
        return userPosts.length > 0 ? (
          <div className={styles.postsList}>
            {userPosts.map((post) => (
              <div key={post._id} className={styles.postCard}>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postStats}>
                  <span className={styles.stat}>♥ {post.likeCount || post.likes?.length || 0}</span>
                  <span className={styles.stat}>💬 {post.commentCount || post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No posts yet.</p>
          </div>
        );

      case "Promotions":
        return userPromotions.length > 0 ? (
          <div className={styles.promotionsList}>
            {userPromotions.map((promo) => (
              <div key={promo.id} className={styles.promoCard}>
                <div className={styles.promoHeader}>
                  <h3 className={styles.promoTitle}>{promo.title}</h3>
                  <span className={`${styles.promoStatus} ${promo.status.toLowerCase()}`}>
                    {promo.status}
                  </span>
                </div>
                <p className={styles.promoCompany}>{promo.company}</p>
                <div className={styles.promoDetails}>
                  <span className={styles.promoType}>{promo.type}</span>
                  <span className={styles.promoReward}>{promo.reward}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No promotions yet.</p>
          </div>
        );

      case "Liked":
        return likedPosts.length > 0 ? (
          <div className={styles.postsList}>
            {likedPosts.map((post) => (
              <div key={post._id} className={styles.postCard}>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postStats}>
                  <span className={styles.stat}>♥ {post.likeCount || post.likes?.length || 0}</span>
                  <span className={styles.stat}>💬 {post.commentCount || post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No liked posts yet.</p>
          </div>
        );

      case "Commented":
        return commentedPosts.length > 0 ? (
          <div className={styles.postsList}>
            {commentedPosts.map((post) => (
              <div key={post._id} className={styles.postCard}>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postStats}>
                  <span className={styles.stat}>♥ {post.likeCount || post.likes?.length || 0}</span>
                  <span className={styles.stat}>💬 {post.commentCount || post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No commented posts yet.</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"></path>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1>My Profile</h1>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileLeft}>
            <div className={styles.profileImageContainer}>
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
              {user.profilePicture || profilePictureFile ? (
                <img
                  src={profilePictureFile || user.profilePicture}
                  alt="Profile"
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImage}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M12 13c-4 0-7 2-7 6v1h14v-1c0-4-3-6-7-6z"></path>
                  </svg>
                </div>
              )}
              <button onClick={handleEditProfile} className={styles.cameraButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l9-9"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>
            
            <div className={styles.profileInfo}>
              <h2 className={styles.userName}>
                {user.username} <span className={styles.flagEmoji}>🇮🇳</span>
              </h2>
              <p className={styles.userHandle}>@arkaprds1s</p>
              <p className={styles.joinDate}>Joined Feb 2026</p>
              
              <div className={styles.followStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{user.following?.length || 0}</span>
                  <span className={styles.statLabel}>Following</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{user.followers?.length || 0}</span>
                  <span className={styles.statLabel}>Followers</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.profileRightStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{userPosts.reduce((sum, post) => sum + (post.likeCount || post.likes?.length || 0), 0)}</span>
              <span className={styles.statLabel}>Earned Points</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{userPromotions.length}</span>
              <span className={styles.statLabel}>Total Promotions</span>
            </div>
          </div>
        </div>
        
        <div className={styles.profileActions}>
          <button onClick={handleEditProfile} className={styles.editProfileBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className={styles.contentContainer}>
        {renderTabContent()}
      </div>

      <button className={styles.fab}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <BottomNav user={user} />
    </div>
  );
}

export default ProfilePage;
