"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  FolderOpen,
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

export default function ResourcesHeader({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterTheme,
  setFilterTheme,
  filterPublic,
  setFilterPublic,
  sort,
  setSort,
  types,
  themes,
  onAddResource,
  totalResources,
}) {
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

        {/* Type Filter */}
        <CustomDropdown
          value={filterType || "all"}
          onChange={setFilterType}
          options={types.map((type) => ({
            value: type,
            label: type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1),
          }))}
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

        {/* Public/Private Filter */}
        <CustomDropdown
          value={filterPublic || "all"}
          onChange={setFilterPublic}
          options={[
            { value: "all", label: "All Visibility" },
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
          placeholder="All Visibility"
          minWidth="120px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {/* Sort Options */}
        <CustomDropdown
          value={sort || "newest"}
          onChange={setSort}
          options={[
            { value: "newest", label: "Newest First" },
            { value: "oldest", label: "Oldest First" },
            { value: "downloads", label: "Most Downloaded" },
            { value: "name", label: "Name (A-Z)" },
          ]}
          placeholder="Sort by..."
          minWidth="140px"
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
