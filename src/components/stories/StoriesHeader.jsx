"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  BookOpen,
} from "lucide-react";
import CustomDropdown from "@/components/core/CustomDropdown";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

import { STORY_TYPE_ENUM, STORY_MODERATION_STATUS_ENUM, formatEnumValue } from '@/constants/backendEnums';

export default function StoriesHeader({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  filterTheme,
  setFilterTheme,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  themes,
  onAddStory,
  totalStories,
}) {
  // Use backend enums for status options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    ...STORY_MODERATION_STATUS_ENUM.map(status => ({
      value: status,
      label: formatEnumValue(status)
    })),
    { value: "expired", label: "Expired" }, // Special case for expired stories
  ];

  // Use backend enums for type options
  const typeOptions = [
    { value: "all", label: "All Types" },
    ...STORY_TYPE_ENUM.map(type => ({
      value: type,
      label: formatEnumValue(type)
    })),
  ];

  // Prepare theme options for dropdown
  const themeOptions = themes && themes.length > 0
    ? [{ name: "all", label: "All Themes" }, ...themes]
    : [{ name: "all", label: "All Themes" }];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title and Add Button */}
      <motion.div
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#eff6ff" }}
          >
            <BookOpen className="h-6 w-6" style={{ color: "#2691ce" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
              Stories Management
            </h1>
            <p className="text-sm" style={{ color: "#646464" }}>
              Manage all your stories
            </p>
          </div>
        </div>

        <motion.button
          onClick={onAddStory}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "#2691ce" }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Story</span>
        </motion.button>
      </motion.div>

      {/* Search and Filters Row */}
      <motion.div
        className="flex flex-col lg:flex-row gap-4 mb-4"
        variants={itemVariants}
      >
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: "#646464" }}
          />
          <input
            type="text"
            placeholder="Search stories by title, caption, author, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
            style={{ focusRingColor: "#2691ce" }}
          />
        </div>

        {/* Status Filter */}
        <CustomDropdown
          value={filterStatus || "all"}
          onChange={setFilterStatus}
          options={statusOptions}
          placeholder="All Statuses"
          minWidth="140px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {/* Type Filter */}
        <CustomDropdown
          value={filterType || "all"}
          onChange={setFilterType}
          options={typeOptions}
          placeholder="All Types"
          minWidth="120px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {/* Theme Filter */}
        {themes && themes.length > 0 && (
          <CustomDropdown
            value={filterTheme || "all"}
            onChange={setFilterTheme}
            options={themeOptions}
            placeholder="All Themes"
            minWidth="140px"
            maxHeight="200px"
            getOptionLabel={(option) => option.label || option.name}
            getOptionValue={(option) => option.name}
            getOptionKey={(option, index) => option._id || option.id || index}
          />
        )}

        {/* Sort Filter */}
        <CustomDropdown
          value={`${sortBy}-${sortOrder}`}
          onChange={(value) => {
            const [by, order] = value.split('-');
            setSortBy(by);
            setSortOrder(order);
          }}
          options={[
            { value: "createdAt-desc", label: "Newest First" },
            { value: "createdAt-asc", label: "Oldest First" },
            { value: "viewCount-desc", label: "Most Views" },
            { value: "viewCount-asc", label: "Least Views" },
            { value: "expiresAt-asc", label: "Expiring Soon" },
            { value: "expiresAt-desc", label: "Expiring Later" },
          ]}
          placeholder="Sort by..."
          minWidth="160px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />
      </motion.div>

      {/* Stats and View Toggle */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="text-sm" style={{ color: "#646464" }}>
          Showing{" "}
          <span className="font-medium" style={{ color: "#040606" }}>
            {totalStories}
          </span>{" "}
          stories
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <motion.button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "cards"
                ? "bg-white shadow-sm text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
            style={viewMode === "cards" ? { backgroundColor: "#2691ce" } : {}}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Grid3X3 className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "table"
                ? "bg-white shadow-sm text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
            style={viewMode === "table" ? { backgroundColor: "#2691ce" } : {}}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <List className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
