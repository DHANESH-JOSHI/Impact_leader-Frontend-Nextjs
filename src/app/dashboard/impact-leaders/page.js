"use client";

import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  BookOpen,
  HelpCircle,
  Bell,
  Heart,
  Activity,
  TrendingUp,
  Calendar,
  MessageSquare,
  Search,
  Monitor,
  Video
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Import our services
import { AdminService } from '@/services/adminService';
import { UsersService } from '@/services/usersService';
import { PostsService } from '@/services/postsService';
import { ResourcesService } from '@/services/resourcesService';
import { QnAService } from '@/services/qnaService';
import { StoriesService } from '@/services/storiesService';
import { NotificationsService } from '@/services/notificationsService';
import { ConnectionsService } from '@/services/connectionsService';
import { MeetingsService } from '@/services/meetingsService';
import { MessagesService } from '@/services/messagesService';
import { DirectoryService } from '@/services/directoryService';
import { SystemHealthService } from '@/services/systemHealthService';

export default function ImpactLeadersAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load main analytics
      const analyticsResult = await AdminService.getAnalyticsDashboard();
      if (analyticsResult.success) {
        setStats(analyticsResult.data);
      }

      // Load pending approvals
      const approvalsResult = await AdminService.getPendingApprovals();
      if (approvalsResult.success) {
        setPendingApprovals(approvalsResult.data.total || 0);
      }

      // Load recent activity (mock for now)
      setRecentActivity([
        { id: 1, type: 'user', message: 'New user registered', time: '2 minutes ago', user: 'John Doe' },
        { id: 2, type: 'post', message: 'New post published', time: '5 minutes ago', user: 'Jane Smith' },
        { id: 3, type: 'resource', message: 'Resource uploaded', time: '10 minutes ago', user: 'Mike Johnson' },
        { id: 4, type: 'question', message: 'New Q&A question', time: '15 minutes ago', user: 'Sarah Wilson' },
        { id: 5, type: 'story', message: 'Story created', time: '20 minutes ago', user: 'Admin User' }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'post': return <FileText className="h-4 w-4 text-green-500" />;
      case 'resource': return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'question': return <HelpCircle className="h-4 w-4 text-orange-500" />;
      case 'story': return <Activity className="h-4 w-4 text-pink-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const managementCards = [
    {
      title: 'User Management',
      description: 'Manage users, profiles, and permissions',
      icon: <Users className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/users',
      color: 'bg-blue-500',
      stat: stats?.totalUsers || '0'
    },
    {
      title: 'Posts & Social',
      description: 'Manage posts, comments, and social interactions',
      icon: <FileText className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/posts',
      color: 'bg-green-500',
      stat: stats?.totalPosts || '0'
    },
    {
      title: 'Stories',
      description: 'Manage stories and featured content',
      icon: <Activity className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/stories',
      color: 'bg-pink-500',
      stat: stats?.totalStories || '0'
    },
    {
      title: 'Resources',
      description: 'Manage resource library and uploads',
      icon: <BookOpen className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/resources',
      color: 'bg-purple-500',
      stat: stats?.totalResources || '0'
    },
    {
      title: 'Q&A Forum',
      description: 'Manage questions, answers, and forum activity',
      icon: <HelpCircle className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/qna',
      color: 'bg-orange-500',
      stat: stats?.totalQuestions || '0'
    },
    {
      title: 'Notifications',
      description: 'Send announcements and manage notifications',
      icon: <Bell className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/notifications',
      color: 'bg-yellow-500',
      stat: stats?.totalNotifications || '0'
    },
    {
      title: 'Connections',
      description: 'Monitor user connections and networking',
      icon: <Heart className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/connections',
      color: 'bg-red-500',
      stat: stats?.totalConnections || '0'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/analytics',
      color: 'bg-indigo-500',
      stat: pendingApprovals > 0 ? `${pendingApprovals} pending` : 'Up to date'
    },
    {
      title: 'Messages',
      description: 'Monitor conversations and messaging',
      icon: <MessageSquare className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/messages',
      color: 'bg-emerald-500',
      stat: stats?.totalMessages || '0'
    },
    {
      title: 'Meetings',
      description: 'Manage meeting scheduling and verification',
      icon: <Video className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/meetings',
      color: 'bg-violet-500',
      stat: stats?.totalMeetings || '0'
    },
    {
      title: 'Directory',
      description: 'Professional search and directory management',
      icon: <Search className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/directory',
      color: 'bg-cyan-500',
      stat: stats?.totalDirectoryProfiles || '0'
    },
    {
      title: 'System Health',
      description: 'Monitor API health and performance',
      icon: <Monitor className="h-6 w-6" />,
      href: '/dashboard/impact-leaders/system-health',
      color: 'bg-slate-500',
      stat: 'Monitoring'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Impact Leaders Admin</h1>
          <p className="text-gray-600 mt-2">Loading dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Impact Leaders Admin</h1>
          <p className="text-gray-600 mt-2">
            Manage your Impact Leaders mobile app backend
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadDashboardData} variant="outline">
            Refresh Data
          </Button>
          {pendingApprovals > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingApprovals} Pending Approvals
            </Badge>
          )}
        </div>
      </div>

      {/* Management Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managementCards.map((card, index) => (
          <Link key={index} href={card.href}>
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {card.stat}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest activity across your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/impact-leaders/notifications/create">
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </Link>
              <Link href="/dashboard/impact-leaders/users/create">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </Link>
              <Link href="/dashboard/impact-leaders/stories/create">
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Create Story
                </Button>
              </Link>
              <Link href="/dashboard/impact-leaders/resources/upload">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              </Link>
              {pendingApprovals > 0 && (
                <Link href="/dashboard/impact-leaders/approvals">
                  <Button className="w-full justify-start" variant="default">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Review Pending ({pendingApprovals})
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>API Health Status</CardTitle>
          <CardDescription>Connection status to Impact Leaders API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Connected to Impact Leaders API</span>
            <Badge variant="outline">http://13.60.221.160</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
