import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Cpu,
  Database,
  Wifi,
  Activity,
  Gauge,
  Monitor,
  Zap,
  Clock,
} from "lucide-react";

// ---------- Brand colors ----------
const PRIMARY = "#2490CE";
const ACCENT = "#A5C93D";

// ---------- Utilities ----------
const isFiniteNum = (v) => Number.isFinite(Number(v));
const safeNum = (v, fb = 0) => (isFiniteNum(v) ? Number(v) : fb);
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const formatBytesLocal = (bytes) => {
  const b = safeNum(bytes, 0);
  if (b === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"]; // more robust
  const i = Math.floor(Math.log(b) / Math.log(k));
  const val = Math.round((b / Math.pow(k, i)) * 100) / 100;
  return `${val} ${sizes[i] ?? "B"}`;
};

const formatUptimeLocal = (seconds) => {
  const s = safeNum(seconds, 0);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const slug = (t) =>
  String(t ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

// ---------- CircularProgress (fixed) ----------
const CircularProgress = ({
  percentage = 0,
  color = PRIMARY,
  size = 120,
  strokeWidth = 8,
  label,
  value,
}) => {
  const validSize = safeNum(size, 120);
  const validStrokeWidth = safeNum(strokeWidth, 8);
  const validPercentage = clamp(safeNum(percentage, 0), 0, 100);

  const radius = Math.max((validSize - validStrokeWidth) / 2, 0);
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (validPercentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={validSize}
        height={validSize}
        className="transform -rotate-90"
      >
        <circle
          cx={validSize / 2}
          cy={validSize / 2}
          r={radius}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={validStrokeWidth}
          fill="none"
        />
        <motion.circle
          cx={validSize / 2}
          cy={validSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={validStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-2xl font-bold"
          style={{ color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {value || `${Math.round(validPercentage)}%`}
        </motion.div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    </div>
  );
};

// ---------- MetricCard ----------
const MetricCard = ({
  icon: Icon,
  title,
  value,
  unit,
  percentage,
  status = "normal",
  color = PRIMARY,
  subtitle,
  trend = null,
}) => {
  const getStatusColor = (s) => {
    switch (s) {
      case "excellent":
        return "#10b981";
      case "good":
        return ACCENT;
      case "fair":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return color;
    }
  };

  const statusColor = getStatusColor(status);
  const pct =
    percentage !== undefined
      ? clamp(safeNum(percentage, 0), 0, 100)
      : undefined;

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
      whileHover={{ scale: 1.02, y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${statusColor}, transparent)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{
                backgroundColor: `${statusColor}15`,
                color: statusColor,
              }}
            >
              {Icon ? <Icon className="h-6 w-6" /> : null}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {value}
                </span>
                {unit && <span className="text-sm text-gray-500">{unit}</span>}
              </div>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {trend !== null && (
            <div
              className={`text-sm font-medium ${
                trend > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </div>
          )}
        </div>

        {pct !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Usage</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full transition-all duration-1000"
                style={{ backgroundColor: statusColor, width: `${pct}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ---------- RealTimeChart (fixed NaN cx) ----------
const RealTimeChart = ({
  data,
  title,
  color = PRIMARY,
  unit = "",
  height = 120,
}) => {
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 300, height });

  useEffect(() => {
    if (chartRef.current) {
      const { width } = chartRef.current.getBoundingClientRect();
      if (width > 0) setDimensions({ width, height });
    }
  }, [height]);

  const points = useMemo(
    () => (Array.isArray(data) ? data.slice(-30) : []),
    [data]
  );

  const finitePoints = points
    .map((p) => safeNum(p, NaN))
    .filter((p) => Number.isFinite(p));
  const showPoints = finitePoints.length > 1; // guard against length 0/1

  const max = showPoints ? Math.max(...finitePoints, 1) : 1;
  const min = showPoints ? Math.min(...finitePoints, 0) : 0;
  const range = Math.max(max - min, 1);

  const pathData = showPoints
    ? finitePoints
        .map((point, i) => {
          const denom = Math.max(finitePoints.length - 1, 1);
          const x = (i / denom) * dimensions.width;
          const y = height - ((point - min) / range) * height;
          return `${i === 0 ? "M" : "L"} ${x},${y}`;
        })
        .join(" ")
    : "";

  const gradId = `gradient-${slug(title)}`;

  const lastVal = finitePoints.length
    ? finitePoints[finitePoints.length - 1]
    : 0;

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-right">
          <motion.div
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {safeNum(lastVal, 0).toFixed(1)}
            {unit}
          </motion.div>
          <div className="text-xs text-gray-500">Current</div>
        </div>
      </div>

      <div ref={chartRef} className="relative" style={{ height }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {showPoints && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <path
                d={`${pathData} L ${dimensions.width},${height} L 0,${height} Z`}
                fill={`url(#${gradId})`}
              />
              <motion.path
                d={pathData}
                stroke={color}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.g>
          )}

          {/* Data points (guarded) */}
          {showPoints &&
            finitePoints.map((point, index) => {
              const denom = Math.max(finitePoints.length - 1, 1);
              const x = (index / denom) * dimensions.width;
              const y = height - ((point - min) / range) * height;
              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={index === finitePoints.length - 1 ? 5 : 3}
                  fill={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.02, duration: 0.3 }}
                  className="drop-shadow-sm"
                />
              );
            })}
        </svg>
      </div>
    </motion.div>
  );
};

// ---------- SystemHealthOverview ----------
const SystemHealthOverview = ({ health, uptime, processUptime }) => {
  const safeHealth = health ?? { score: 0, status: "Unknown", color: PRIMARY };
  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: `${safeHealth.color}15`,
              color: safeHealth.color,
            }}
          >
            <Gauge className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              System Health
            </h2>
            <p className="text-sm text-gray-600">Overall server performance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={safeNum(safeHealth.score, 0)}
            color={safeHealth.color}
            size={140}
            strokeWidth={10}
            label="Health Score"
            value={`${Math.round(safeNum(safeHealth.score, 0))}/100`}
          />
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div
              className="text-lg font-semibold"
              style={{ color: safeHealth.color }}
            >
              {safeHealth.status}
            </div>
            <div className="text-sm text-gray-500">System Status</div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              Server Uptime
            </span>
          </div>
          <motion.div
            className="text-2xl font-bold text-gray-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            {uptime}
          </motion.div>
          <div className="text-sm text-gray-500 mt-1">Since last restart</div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">
              Process Uptime
            </span>
          </div>
          <motion.div
            className="text-2xl font-bold text-gray-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            {processUptime}
          </motion.div>
          <div className="text-sm text-gray-500 mt-1">Application runtime</div>
        </div>
      </div>
    </motion.div>
  );
};

// ---------- ProcessMemoryBreakdown ----------
const ProcessMemoryBreakdown = ({ processMemory }) => {
  const pm = processMemory ?? {
    rss: 0,
    heapTotal: 0,
    heapUsed: 0,
    external: 0,
  };
  const memoryData = [
    { label: "RSS", value: pm.rss, color: PRIMARY },
    { label: "Heap Total", value: pm.heapTotal, color: ACCENT },
    { label: "Heap Used", value: pm.heapUsed, color: "#f59e0b" },
    { label: "External", value: pm.external, color: "#ef4444" },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
        >
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Process Memory
          </h2>
          <p className="text-sm text-gray-600">Application memory breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {memoryData.map((item, index) => (
          <motion.div
            key={item.label}
            className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <div className="text-sm font-medium text-gray-600">
                  {item.label}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatBytesLocal(item.value)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ---------- Main Component ----------
export default function ServerMonitoringAnalyticsDemo() {
  // Mock data generator for preview (since we don't call your API here)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  const mkSeries = (base = 40, spread = 30, len = 50) =>
    Array.from({ length: len }, (_, i) =>
      Math.max(
        0,
        Math.min(
          100,
          base + Math.sin((i + tick) / 4) * spread + (Math.random() - 0.5) * 10
        )
      )
    );

  const cpuHistory = mkSeries(35, 25);
  const memHistory = mkSeries(55, 15);
  const netHistory = mkSeries(20, 40);

  const serverData = {
    timestamp: Date.now(),
    system: {
      hostname: "twtj-edge-01",
      platform: "linux",
      architecture: "x64",
      nodeVersion: "v20.15.0",
      uptime: 86400 * 3 + 3600 * 5 + 60 * 23, // 3d5h23m
      processUptime: 3600 * 12 + 60 * 4, // 12h4m
    },
    cpu: {
      usage: cpuHistory.at(-1),
      cores: 8,
      speed: 2800,
      model: "Intel(R) Xeon(R) Platinum",
      loadAverage: { "1min": 0.64, "5min": 0.58, "15min": 0.49 },
      history: cpuHistory,
    },
    memory: {
      total: 16 * 1024 * 1024 * 1024,
      used: 9.2 * 1024 * 1024 * 1024,
      free: 6.8 * 1024 * 1024 * 1024,
      usage: memHistory.at(-1),
      process: {
        rss: 420 * 1024 * 1024,
        heapTotal: 300 * 1024 * 1024,
        heapUsed: 210 * 1024 * 1024,
        external: 40 * 1024 * 1024,
      },
      history: memHistory,
    },
    network: {
      interfaces: 3,
      history: netHistory,
    },
    performance: {
      overallHealth: { score: 86, status: "Excellent", color: "#10b981" },
      cpuEfficiency: "Excellent",
      memoryEfficiency: "Good",
    },
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
          >
            <Server className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Server Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time monitoring of {serverData.system.hostname} (
              {serverData.system.platform})
            </p>
          </div>
        </div>
        <motion.div
          className="text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm text-gray-500">Last Updated</div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date(serverData.timestamp).toLocaleTimeString()}
          </div>
        </motion.div>
      </div>

      {/* System Health Overview */}
      <SystemHealthOverview
        health={serverData.performance.overallHealth}
        uptime={formatUptimeLocal(serverData.system.uptime)}
        processUptime={formatUptimeLocal(serverData.system.processUptime)}
      />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Cpu}
          title="CPU Usage"
          value={safeNum(serverData.cpu.usage, 0).toFixed(1)}
          unit="%"
          percentage={safeNum(serverData.cpu.usage, 0)}
          status={String(
            serverData.performance.cpuEfficiency || ""
          ).toLowerCase()}
          subtitle={`${
            serverData.cpu.cores
          } cores • ${serverData.cpu.model?.substring(0, 20)}...`}
          color={PRIMARY}
        />

        <MetricCard
          icon={Database}
          title="Memory Usage"
          value={formatBytesLocal(serverData.memory.used)}
          subtitle={`${formatBytesLocal(serverData.memory.total)} total`}
          percentage={safeNum(serverData.memory.usage, 0)}
          status={String(
            serverData.performance.memoryEfficiency || ""
          ).toLowerCase()}
          color={ACCENT}
        />

        <MetricCard
          icon={Activity}
          title="Load Average"
          value={safeNum(serverData.cpu.loadAverage["1min"], 0).toFixed(2)}
          subtitle={`5m: ${safeNum(
            serverData.cpu.loadAverage["5min"],
            0
          ).toFixed(2)} • 15m: ${safeNum(
            serverData.cpu.loadAverage["15min"],
            0
          ).toFixed(2)}`}
          status={
            safeNum(serverData.cpu.loadAverage["1min"], 0) < 1
              ? "excellent"
              : safeNum(serverData.cpu.loadAverage["1min"], 0) < 2
              ? "good"
              : "fair"
          }
          color="#f59e0b"
        />

        <MetricCard
          icon={Wifi}
          title="Network"
          value={safeNum(serverData.network.interfaces, 0)}
          unit="interfaces"
          subtitle="Active network interfaces"
          color="#10b981"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RealTimeChart
          data={serverData.cpu.history}
          title="CPU Usage History"
          color={PRIMARY}
          unit="%"
          height={150}
        />
        <RealTimeChart
          data={serverData.memory.history}
          title="Memory Usage History"
          color={ACCENT}
          unit="%"
          height={150}
        />
        <RealTimeChart
          data={serverData.network.history}
          title="Network Activity"
          color="#f59e0b"
          unit=""
          height={150}
        />
      </div>

      {/* Process Memory Breakdown */}
      <ProcessMemoryBreakdown processMemory={serverData.memory.process} />

      {/* System Information */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
          >
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              System Information
            </h2>
            <p className="text-sm text-gray-600">
              Server configuration details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Platform</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">OS:</span>
                <span className="font-medium capitalize">
                  {serverData.system.platform}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arch:</span>
                <span className="font-medium">
                  {serverData.system.architecture}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Node:</span>
                <span className="font-medium">
                  {serverData.system.nodeVersion}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">CPU Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cores:</span>
                <span className="font-medium">{serverData.cpu.cores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Speed:</span>
                <span className="font-medium">{serverData.cpu.speed} MHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usage:</span>
                <span className="font-medium">
                  {safeNum(serverData.cpu.usage, 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Memory</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">
                  {formatBytesLocal(serverData.memory.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Used:</span>
                <span className="font-medium">
                  {formatBytesLocal(serverData.memory.used)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Free:</span>
                <span className="font-medium">
                  {formatBytesLocal(serverData.memory.free)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Performance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Health:</span>
                <span
                  className="font-medium"
                  style={{ color: serverData.performance.overallHealth.color }}
                >
                  {serverData.performance.overallHealth.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">
                  {Math.round(serverData.performance.overallHealth.score)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">
                  {formatUptimeLocal(serverData.system.uptime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
