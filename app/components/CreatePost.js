'use client';

import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { postsAPI } from "../services/api";
import styles from "./CreatePost.module.css";

function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All Posts");
  const [promotionSubfilter, setPromotionSubfilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = React.useRef(null);

  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "🤝", "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤙", "💪", "🙏", "✍️"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    setContent(prevContent => prevContent + emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await postsAPI.createPost(content, selectedImage);
      onPostCreated(response.data);
      setContent("");
      setSelectedImage(null);
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showPromotionSubfilters = activeTab === "Promotions";
  const promotionFilters = ["All", "Refer and Earn", "Crypto"];

  return (
    <div className={styles.createPostCard}>
      <div className={styles.inputSection}>
        <textarea
          className={styles.input}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
        />
        
        {selectedImage && (
          <div className={styles.imagePreview}>
            <img src={selectedImage} alt="Preview" className={styles.previewImage} />
            <button
              type="button"
              className={styles.removeImageBtn}
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        )}
        
        <div className={styles.inputActions}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <button 
            type="button" 
            className={styles.actionBtn} 
            title="Add image"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>
          
          <div className={styles.emojiPickerContainer}>
            <button 
              type="button" 
              className={styles.actionBtn} 
              title="Add emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            
            {showEmojiPicker && (
              <div className={styles.emojiPicker}>
                <div className={styles.emojiGrid}>
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className={styles.emojiBtn}
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button type="button" className={styles.actionBtn} title="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.tabs}>
          <button 
            type="button" 
            className={`${styles.tab} ${activeTab === "All Posts" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("All Posts")}
          >
            All Posts
          </button>
          <button 
            type="button" 
            className={`${styles.tab} ${activeTab === "Promotions" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("Promotions")}
          >
            Promotions
          </button>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.promoteBtn}
            title="Promote"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
            </svg>
            Promote
          </button>
          
          <button
            type="submit"
            className={styles.postBtn}
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {showPromotionSubfilters && (
        <div className={styles.promotionSubfilters}>
          {promotionFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`${styles.subTab} ${promotionSubfilter === filter ? styles.activeSubTab : ""}`}
              onClick={() => setPromotionSubfilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default CreatePost;
