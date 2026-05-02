"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  Bell,
  Settings,
  LogOut,
  Plus,
  Search,
  Crown,
  Shield,
  PenTool,
  Wallet,
  UserCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  BookOpen,
  Target,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  emailVerified: boolean;
}

interface ClassInfo {
  id: string;
  name: string;
  description: string | null;
  year: string;
  semester: string;
  isActive: boolean;
  createdAt: string;
  members: ClassMember[];
  _count: {
    members: number;
    payments: number;
    activities: number;
    announcements: number;
  };
}

interface ClassMember {
  id: string;
  userId: string;
  classId: string;
  position: string;
  number: number | null;
  status: string;
  joinedAt: string;
  user: User;
}

interface Payment {
  id: string;
  title: string;
  amount: number;
  type: string;
  status: string;
  dueDate: string;
  paidDate: string | null;
  paymentMethod: string | null;
  description: string | null;
  createdAt: string;
}

interface Activity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  date: string;
  location: string | null;
  status: string;
  budget: number | null;
  actualCost: number | null;
  createdAt: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  isPinned: boolean;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes] = await Promise.all([
        fetch("/api/classes").then(res => res.json()),
      ]);

      setClasses(classesRes);
      
      if (classesRes.length > 0) {
        setSelectedClass(classesRes[0]);
        await fetchClassData(classesRes[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClassData = async (classId: string) => {
    try {
      const [membersRes, paymentsRes, activitiesRes, announcementsRes] = await Promise.all([
        fetch(`/api/classes/${classId}/members`).then(res => res.json()),
        fetch(`/api/classes/${classId}/payments`).then(res => res.json()),
        fetch(`/api/classes/${classId}/activities`).then(res => res.json()),
        fetch(`/api/classes/${classId}/announcements`).then(res => res.json()),
      ]);

      setMembers(membersRes);
      setPayments(paymentsRes);
      setActivities(activitiesRes);
      setAnnouncements(announcementsRes);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <Crown className="w-4 h-4" />;
      case "BENDAHARA": return <Wallet className="w-4 h-4" />;
      case "SEKRETARIS": return <PenTool className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-purple-100 text-purple-800";
      case "BENDAHARA": return "bg-green-100 text-green-800";
      case "SEKRETARIS": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "KETUA_KELAS": return <Crown className="w-4 h-4" />;
      case "WAKIL_KETUA": return <Shield className="w-4 h-4" />;
      case "SEKRETARIS": return <PenTool className="w-4 h-4" />;
      case "BENDAHARA": return <Wallet className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "KETUA_KELAS": return "bg-yellow-100 text-yellow-800";
      case "WAKIL_KETUA": return "bg-orange-100 text-orange-800";
      case "SEKRETARIS": return "bg-blue-100 text-blue-800";
      case "BENDAHARA": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "ONGOING": return "bg-blue-100 text-blue-800";
      case "PLANNED": return "bg-purple-100 text-purple-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Class 7.3</CardTitle>
            <CardDescription>Sign in to access dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Class 7.3 Dashboard</h1>
              {selectedClass && (
                <Badge variant="outline" className="ml-2">
                  {selectedClass.name} - {selectedClass.year}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.avatar || ""} />
                  <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(session.user.role)}
                    <Badge className={`text-xs ${getRoleColor(session.user.role)}`}>
                      {session.user.role}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Class Selector */}
        {classes.length > 1 && (
          <div className="mb-6">
            <div className="flex space-x-2">
              {classes.map((cls) => (
                <Button
                  key={cls.id}
                  variant={selectedClass?.id === cls.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedClass(cls);
                    fetchClassData(cls.id);
                  }}
                >
                  {cls.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {selectedClass && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedClass._count.members}</div>
                <p className="text-xs text-muted-foreground">Active class members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {payments.filter(p => p.status === "PENDING").length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activities</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedClass._count.activities}</div>
                <p className="text-xs text-muted-foreground">Class activities</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedClass._count.announcements}</div>
                <p className="text-xs text-muted-foreground">Recent announcements</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest class activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                        <Badge className={getActivityStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No activities yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Latest class announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.slice(0, 5).map((announcement) => (
                      <div key={announcement.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-sm text-gray-500">{announcement.createdAt}</p>
                        </div>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No announcements yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Members</CardTitle>
                <CardDescription>Manage class members and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={member.user.avatar || ""} />
                          <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-sm text-gray-500">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {getPositionIcon(member.position)}
                          <Badge className={getPositionColor(member.position)}>
                            {member.position}
                          </Badge>
                        </div>
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {members.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No members yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Track and manage class payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.title}</p>
                        <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Rp {payment.amount.toLocaleString()}</p>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No payments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Activities</CardTitle>
                <CardDescription>Manage class activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{activity.title}</h3>
                        <Badge className={getActivityStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {activity.date}
                          </span>
                          {activity.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {activity.location}
                            </span>
                          )}
                        </div>
                        {activity.budget && (
                          <span>Budget: Rp {activity.budget.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No activities yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Class announcements and notices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{announcement.title}</h3>
                        <div className="flex items-center space-x-2">
                          {announcement.isPinned && (
                            <Badge variant="outline">Pinned</Badge>
                          )}
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                      <p className="text-xs text-gray-500">{announcement.createdAt}</p>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No announcements yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
