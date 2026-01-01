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
  Headphones,
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

export default function SupportHeader({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories,
  statuses,
  priorities,
  onAddTicket,
  totalTickets,
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
            <Headphones className="h-6 w-6" style={{ color: "#2691ce" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
              Support Tickets
            </h1>
            <p className="text-sm" style={{ color: "#646464" }}>
              Manage customer support queries and resolve issues
            </p>
          </div>
        </div>

        <motion.button
          onClick={onAddTicket}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "#2691ce" }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Plus className="h-5 w-5" />
          <span>Add Ticket</span>
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
            placeholder="Search tickets by title, description, or ticket number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
            style={{ focusRingColor: "#2691ce" }}
          />
        </div>

        {/* Category Filter */}
        <CustomDropdown
          value={filterCategory}
          onChange={setFilterCategory}
          options={categories}
          placeholder="All Categories"
          minWidth="150px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {/* Status Filter */}
        <CustomDropdown
          value={filterStatus}
          onChange={setFilterStatus}
          options={statuses}
          placeholder="All Status"
          minWidth="140px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />

        {/* Priority Filter */}
        <CustomDropdown
          value={filterPriority}
          onChange={setFilterPriority}
          options={priorities}
          placeholder="All Priorities"
          minWidth="120px"
          maxHeight="200px"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          getOptionKey={(option, index) => option.value || index}
        />
      </motion.div>

      {/* Sort and View Controls */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium" style={{ color: "#646464" }}>
            Sort by:
          </span>
          <CustomDropdown
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "createdAt", label: "Most Recent" },
              { value: "updatedAt", label: "Recently Updated" },
              { value: "priority", label: "Priority" },
              { value: "status", label: "Status" }
            ]}
            placeholder="Sort by..."
            minWidth="140px"
            maxHeight="200px"
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            getOptionKey={(option, index) => option.value || index}
          />

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" style={{ color: "#646464" }} />
            ) : (
              <SortDesc className="h-4 w-4" style={{ color: "#646464" }} />
            )}
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium" style={{ color: "#646464" }}>
            View:
          </span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <motion.button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 transition-colors ${
                viewMode === "table"
                  ? "text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
              style={
                viewMode === "table" ? { backgroundColor: "#2691ce" } : {}
              }
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <List className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 transition-colors ${
                viewMode === "grid"
                  ? "text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
              style={viewMode === "grid" ? { backgroundColor: "#2691ce" } : {}}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Grid3X3 className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="mt-4 pt-4 border-t border-gray-200"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#646464" }}>
            Total Tickets: <span className="font-semibold">{totalTickets}</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
