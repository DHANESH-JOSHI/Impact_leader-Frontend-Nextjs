"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  FolderOpen,
} from "lucide-react";

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

export default function ResourcesHeader({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories,
  types,
  onAddResource,
  totalResources,
}) {
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
            <FolderOpen className="h-6 w-6" style={{ color: "#2691ce" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
              Resources Management
            </h1>
            <p className="text-sm" style={{ color: "#646464" }}>
              Manage your media files, videos, and audio content
            </p>
          </div>
        </div>

        <motion.button
          onClick={onAddResource}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "#2691ce" }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Plus className="h-5 w-5" />
          <span>Add Resource</span>
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
            placeholder="Search resources by title, description, author, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
            style={{ focusRingColor: "#2691ce" }}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:border-transparent transition-all min-w-[120px]"
            style={{ focusRingColor: "#2691ce" }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <Filter
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: "#646464" }}
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:border-transparent transition-all min-w-[120px]"
            style={{ focusRingColor: "#2691ce" }}
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "all"
                  ? "All Types"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <Filter
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: "#646464" }}
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:border-transparent transition-all min-w-[120px]"
            style={{ focusRingColor: "#2691ce" }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <Filter
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: "#646464" }}
          />
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:border-transparent transition-all"
            style={{ focusRingColor: "#2691ce" }}
          >
            <option value="createdAt">Date</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="views">Views</option>
            <option value="likes">Likes</option>
            <option value="downloads">Downloads</option>
            <option value="fileSize">File Size</option>
          </select>

          <motion.button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" style={{ color: "#646464" }} />
            ) : (
              <SortDesc className="h-4 w-4" style={{ color: "#646464" }} />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats and View Toggle */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="text-sm" style={{ color: "#646464" }}>
          Showing{" "}
          <span className="font-medium" style={{ color: "#040606" }}>
            {totalResources}
          </span>{" "}
          resources
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <motion.button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "card"
                ? "bg-white shadow-sm text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
            style={viewMode === "card" ? { backgroundColor: "#2691ce" } : {}}
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
