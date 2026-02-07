'use client';

import React from "react";
import styles from "./FilterTabs.module.css";

function FilterTabs({ filters, activeFilter, onFilterChange, sortBy, onSortChange }) {
  const allFilters = ["All Posts", "Promotions", "For You", "Most Liked", "Most Commented", "Most Shared"];
  const promotionFilters = ["All", "Refer and Earn", "Crypto"];
  
  const showPromotionSubfilters = activeFilter === "Promotions";
  
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.filterTabs}>
        {allFilters.map((filter) => (
          <button
            key={filter}
            className={`${styles.tab} ${activeFilter === filter ? styles.active : ""}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {showPromotionSubfilters && (
        <div className={styles.promotionSubfilters}>
          {promotionFilters.map((filter) => (
            <button
              key={filter}
              className={`${styles.subTab} ${activeFilter.includes(filter) ? styles.activeSub : ""}`}
              onClick={() => onFilterChange(`Promotions - ${filter}`)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterTabs;
