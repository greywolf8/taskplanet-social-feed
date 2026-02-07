'use client';

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { postsAPI } from "../services/api";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import FilterTabs from "../components/FilterTabs";
import BottomNav from "../components/BottomNav";
import styles from "./Feed.module.css";

function Feed() {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Posts");
  const [sortBy, setSortBy] = useState("newest");

  const filters = ["All Posts", "For You", "Most Liked", "Most Commented"];

  useEffect(() => {
    fetchPosts();
  }, [activeFilter, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts(
        activeFilter === "All Posts" ? undefined : activeFilter,
        sortBy === "newest" ? undefined : sortBy
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const handlePostLiked = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handleCommentAdded = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handleCommentDeleted = (postId, updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === postId ? updatedPost : post))
    );
  };

  return (
    <div className={styles.feedContainer}>
      <Header user={user} onLogout={logout} />

      <div className={styles.feedContent}>
        <div className={styles.mainFeed}>
          <CreatePost onPostCreated={handlePostCreated} />

          <FilterTabs
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className={styles.postsList}>
            {loading && <p className={styles.loadingText}>Loading posts...</p>}
            {!loading && posts.length === 0 && (
              <p className={styles.emptyText}>No posts yet. Be the first to post!</p>
            )}
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostLiked={handlePostLiked}
                onCommentAdded={handleCommentAdded}
                onCommentDeleted={handleCommentDeleted}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav user={user} />
    </div>
  );
}

export default Feed;
