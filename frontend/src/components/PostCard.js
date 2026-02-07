'use client';

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { postsAPI, authAPI } from "../services/api";
import DefaultAvatar from "./DefaultAvatar";
import styles from "./PostCard.module.css";

function PostCard({
  post,
  onPostDeleted,
  onPostLiked,
  onCommentAdded,
  onCommentDeleted,
}) {
  const { user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isAuthor = user && post.author._id === user.id;
  const isLiked = post.likes.includes(user?.id);

  // Check if current user is following the post author
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user && post.author._id !== user.id) {
        try {
          // Check if current user follows the post author
          const currentUserResponse = await authAPI.getCurrentUser();
          const currentUser = currentUserResponse.data;
          const isUserFollowing = currentUser.following?.includes(post.author._id);
          setIsFollowing(isUserFollowing);
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    };
    
    checkFollowStatus();
  }, [user, post.author._id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLike = async () => {
    try {
      const response = await postsAPI.likePost(post._id);
      onPostLiked(response.data);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const response = await postsAPI.addComment(post._id, commentText);
      onCommentAdded(response.data);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await postsAPI.deleteComment(post._id, commentId);
      onCommentDeleted(post._id, response.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleShare = () => {
    // Simple share functionality - copy post link to clipboard
    const postUrl = `${window.location.origin}/post/${post._id}`;
    
    if (navigator.share) {
      // Use native share API if available
      navigator.share({
        title: `Post by ${post.author.username}`,
        text: post.content,
        url: postUrl
      }).catch(err => console.log('Share cancelled'));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(postUrl).then(() => {
        alert('Post link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link:', err);
      });
    }
  };

  const handleFollow = async () => {
    if (!user || user.id === post.author._id) return;
    
    setFollowLoading(true);
    try {
      const response = await authAPI.followUser(post.author._id);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await postsAPI.deletePost(post._id);
      onPostDeleted(post._id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className={styles.postCard}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          {post.author.profilePicture ? (
            <img
              src={post.author.profilePicture}
              alt="Avatar"
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
          <div className={styles.authorDetails}>
            <h3 className={styles.authorName}>{post.author.username}</h3>
            <p className={styles.authorHandle}>@{post.author.username.toLowerCase().replace(/\s+/g, '')}</p>
            <p className={styles.timestamp}>{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className={styles.actions}>
          {isAuthor && (
            <button
              onClick={handleDeletePost}
              className={styles.deleteBtn}
              title="Delete post"
            >
              ✕
            </button>
          )}
          <button 
            className={`${styles.followBtn} ${isFollowing ? styles.following : ""} ${followLoading ? styles.loading : ""}`}
            onClick={handleFollow}
            disabled={followLoading || !user || user.id === post.author._id}
          >
            {followLoading ? "..." : (isFollowing ? "Following" : "Follow")}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.text}>{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className={styles.contentImage}
          />
        )}
      </div>

      <div className={styles.interactions}>
        <button
          className={`${styles.interactionBtn} ${isLiked ? styles.liked : ""}`}
          onClick={handleLike}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>{post.likeCount || post.likes?.length || 0}</span>
        </button>
        <button
          className={styles.interactionBtn}
          onClick={() => setShowComments(!showComments)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>{post.commentCount || post.comments?.length || 0}</span>
        </button>
        <button 
          className={styles.interactionBtn}
          onClick={handleShare}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          <div className={styles.commentsList}>
            {post.comments.length === 0 ? (
              <p className={styles.noComments}>No comments yet</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className={styles.comment}>
                  {comment.author.profilePicture ? (
                    <img
                      src={comment.author.profilePicture}
                      alt="Commenter avatar"
                      className={styles.commentAvatar}
                    />
                  ) : (
                    <div className={styles.commentAvatar}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M12 13c-4 0-7 2-7 6v1h14v-1c0-4-3-6-7-6z"></path>
                      </svg>
                    </div>
                  )}
                  <div className={styles.commentContent}>
                    <p className={styles.commentAuthor}>
                      {comment.author.username}
                    </p>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                  {user && comment.author._id === user.id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className={styles.deleteCommentBtn}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className={styles.commentInputContainer}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Your avatar"
                className={styles.commentInputAvatar}
              />
            ) : (
              <div className={styles.commentInputAvatar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M12 13c-4 0-7 2-7 6v1h14v-1c0-4-3-6-7-6z"></path>
                </svg>
              </div>
            )}
            <form onSubmit={handleAddComment} className={styles.commentForm}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className={styles.commentInput}
              />
              <button
                type="submit"
                disabled={loading || !commentText.trim()}
                className={styles.commentSubmitBtn}
              >
                {loading ? "..." : "Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
