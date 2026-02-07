'use client';

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { postsAPI } from "./services/api";
import Header from "./components/Header";
import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import FilterTabs from "./components/FilterTabs";
import BottomNav from "./components/BottomNav";
import styles from "./Feed.module.css";

function HomePage() {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Posts");
  const [sortBy, setSortBy] = useState("newest");

  const filters = ["All Posts", "For You", "Most Liked", "Most Commented"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getAllPosts(activeFilter, sortBy);
        setPosts(response.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user, activeFilter, sortBy]);

  const handleLike = async (postId) => {
    try {
      await postsAPI.likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCreatePost = async (newPost) => {
    try {
      const response = await postsAPI.createPost(newPost.content, newPost.image, newPost.category);
      setPosts([response.data, ...posts]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      const response = await postsAPI.addComment(postId, text);
      setPosts(posts.map(post => 
        post.id === postId ? response.data : post
      ));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await postsAPI.deleteComment(postId, commentId);
      setPosts(posts.map(post => 
        post.id === postId ? response.data : post
      ));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // If user is not logged in, show login form
  if (!user) {
    return (
      <div className={styles.feed}>
        <div className={styles.content}>
          <div className={styles.authPrompt}>
            <h2>Welcome to TaskPlanet</h2>
            <p>Please log in to continue</p>
            <div className={styles.authButtons}>
              <button onClick={() => window.location.href = '/login'} className={styles.authButton}>
                Login
              </button>
              <button onClick={() => window.location.href = '/signup'} className={styles.authButton}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, show the feed
  return (
    <div className={styles.feed}>
      <Header user={user} onLogout={logout} />
      <div className={styles.content}>
        <CreatePost onCreatePost={handleCreatePost} />
        <FilterTabs 
          filters={filters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className={styles.postsContainer}>
          {loading ? (
            <div className={styles.loader}>Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No posts yet</h3>
              <p>Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onDelete={handleDeletePost}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>
      </div>
      <BottomNav user={user} />
    </div>
  );
}

export default HomePage;
