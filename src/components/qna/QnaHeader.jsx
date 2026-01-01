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
  HelpCircle,
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

export default function QnaHeader({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterTheme,
  setFilterTheme,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  themes,
  onAddQuestion,
  totalQuestions,
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
            <HelpCircle className="h-6 w-6" style={{ color: "#2691ce" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
              Q&A Management
            </h1>
            <p className="text-sm" style={{ color: "#646464" }}>
              Manage questions and answers for customer support
            </p>
          </div>
        </div>

        <motion.button
          onClick={onAddQuestion}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "#2691ce" }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Plus className="h-5 w-5" />
          <span>Add Question</span>
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
            placeholder="Search questions, answers, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
            style={{ focusRingColor: "#2691ce" }}
          />
        </div>

        {/* Theme Filter */}
        <CustomDropdown
          value={filterTheme}
          onChange={setFilterTheme}
          options={themes.map(theme => ({ value: theme, label: theme === "all" ? "All Themes" : theme }))}
          placeholder="All Themes"
          minWidth="120px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {/* Status Filter */}
        <CustomDropdown
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "all", label: "All Status" },
            { value: "open", label: "Open" },
            { value: "answered", label: "Answered" },
            { value: "closed", label: "Closed" }
          ]}
          placeholder="All Status"
          minWidth="120px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <CustomDropdown
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "createdAt", label: "Date" },
              { value: "question", label: "Question" },
              { value: "author", label: "Author" },
              { value: "views", label: "Views" },
              { value: "likes", label: "Likes" }
            ]}
            placeholder="Sort by..."
            minWidth="140px"
            maxHeight="200px"
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            getOptionKey={(option, index) => option.value || index}
          />

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
            {totalQuestions}
          </span>{" "}
          questions
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
