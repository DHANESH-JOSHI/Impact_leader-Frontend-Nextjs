"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Building2,
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

export default function DirectoryHeader({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterOrganization,
  setFilterOrganization,
  filterTheme,
  setFilterTheme,
  filterLocation,
  setFilterLocation,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  organizationTypes,
  themes,
  onAddEntry,
  totalEntries,
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
      <motion.div
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#eff6ff" }}
          >
            <Building2 className="h-6 w-6" style={{ color: "#2691ce" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
              Directory Management
            </h1>
            <p className="text-sm" style={{ color: "#646464" }}>
              Manage directory entries and organizations
            </p>
          </div>
        </div>

        <motion.button
          onClick={onAddEntry}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "#2691ce" }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Plus className="h-5 w-5" />
          <span>Add Entry</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row gap-4 mb-4"
        variants={itemVariants}
      >
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: "#646464" }}
          />
          <input
            type="text"
            placeholder="Search entries by title, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
            style={{ focusRingColor: "#2691ce" }}
          />
        </div>

        <CustomDropdown
          value={filterOrganization || "all"}
          onChange={setFilterOrganization}
          options={organizationTypes}
          placeholder="All Types"
          minWidth="160px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {themes && themes.length > 0 && (
          <CustomDropdown
            value={filterTheme || "all"}
            onChange={setFilterTheme}
            options={themeOptions}
            placeholder="All Themes"
            minWidth="160px"
            maxHeight="200px"
            getOptionLabel={(option) => option.label || option.name}
            getOptionValue={(option) => option.name}
            getOptionKey={(option, index) => option._id || option.id || index}
          />
        )}

        <div className="relative">
          <input
            type="text"
            placeholder="Filter by location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all min-w-[160px]"
            style={{ focusRingColor: "#2691ce" }}
          />
        </div>

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
            { value: "title-asc", label: "Name (A-Z)" },
            { value: "title-desc", label: "Name (Z-A)" },
          ]}
          placeholder="Sort by..."
          minWidth="160px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />
      </motion.div>

      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="text-sm" style={{ color: "#646464" }}>
          Showing{" "}
          <span className="font-medium" style={{ color: "#040606" }}>
            {totalEntries}
          </span>{" "}
          entries
        </div>

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

