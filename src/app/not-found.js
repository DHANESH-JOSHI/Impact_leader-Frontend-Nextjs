"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Server, Compass, Home, ArrowLeft } from "lucide-react";

// Brand palette (matches Server Analytics)
const PRIMARY = "#2490CE"; // blue
const ACCENT = "#A5C93D"; // lime

// Little utility
const Card = ({ children, className = "" }) => (
  <motion.div
    className={`bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8 ${className}`}
    initial={{ opacity: 0, y: 16, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default function NotFoundThemed() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center px-6 py-16">
      {/* Soft gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 10%, rgba(36,144,206,0.10) 0%, rgba(36,144,206,0) 60%)," +
            "radial-gradient(50% 50% at 80% 30%, rgba(165,201,61,0.12) 0%, rgba(165,201,61,0) 60%)," +
            "linear-gradient(180deg, #f8fafc 0%, #eef5fb 100%)",
        }}
      />

      {/* Decorative animated rings */}
      <svg
        className="absolute -left-20 -top-20 w-[40rem] h-[40rem] opacity-20"
        viewBox="0 0 800 800"
      >
        {[120, 200, 300, 420].map((r, i) => (
          <motion.circle
            key={r}
            cx={400}
            cy={400}
            r={r}
            fill="none"
            stroke={i % 2 === 0 ? PRIMARY : ACCENT}
            strokeWidth={i === 0 ? 2 : 1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 + i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Main card */}
      <Card className="max-w-3xl w-full relative">
        {/* Faint gradient ribbon */}
        <div
          className="absolute -inset-x-8 -top-8 h-24 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${PRIMARY}22, transparent 40%, ${ACCENT}22)`,
          }}
        />

        <div className="relative z-10 grid md:grid-cols-[auto,1fr] gap-6 md:gap-10 items-center">
          <div className="flex items-center justify-center">
            <motion.div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
              initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
            >
              <Server className="w-14 h-14" />
            </motion.div>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              404 — Page not found
            </motion.h1>
            <motion.p
              className="text-gray-600 text-base md:text-lg"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              The route you’re chasing took a coffee break. Let’s route you back
              to a healthy path.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold shadow-sm border border-transparent hover:shadow transition"
                style={{ backgroundColor: PRIMARY, color: "white" }}
              >
                <Home className="w-4 h-4" />
                Go home
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold shadow-sm border border-gray-200 hover:border-gray-300 bg-white text-gray-800"
              >
                <Compass className="w-4 h-4" />
                Open dashboard
              </Link>

              <button
                onClick={() => history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold shadow-sm border border-gray-200 hover:border-gray-300 bg-white text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostics block */}
        <motion.div
          className="mt-8 grid sm:grid-cols-3 gap-3 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {[
            { k: "Status", v: "404 Not Found" },
            { k: "Service", v: "TechWithJoshi Edge" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-lg border border-gray-100 bg-white/70 px-4 py-3 flex items-center justify-between"
            >
              <span className="text-gray-500">{item.k}</span>
              <span className="font-medium text-gray-900">{item.v}</span>
            </div>
          ))}
        </motion.div>
      </Card>

      {/* Bottom-right floating accent blob */}
      <motion.div
        className="absolute bottom-[-6rem] right-[-6rem] w-[20rem] h-[20rem] rounded-full"
        style={{ background: ACCENT, filter: "blur(80px)", opacity: 0.15 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}
