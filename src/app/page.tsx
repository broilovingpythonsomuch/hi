"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Bell,
  Phone,
  Building2,
  LogIn,
  LogOut,
  User,
  Plus,
  Pencil,
  Trash2,
  Clock,
  MapPin,
  BookOpen,
  Mail,
  Search,
  Sparkles,
  GraduationCap,
  LayoutDashboard,
  Shield,
  Eye,
  Star,
  Menu,
  CheckCircle,
  AlertCircle,
  UserPlus,
  ArrowRight,
  Loader2,
  Key,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Types
interface Student {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  studentId: string;
  className: string;
  address: string | null;
  gender: string | null;
  status: string;
  avatar: string | null;
  createdAt: string;
}

interface Schedule {
  id: string;
  title: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string | null;
  teacherName: string | null;
  color: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  isPinned: boolean;
  createdAt: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  position: string | null;
  avatar: string | null;
  bio: string | null;
}

interface ClassStructure {
  id: string;
  name: string;
  position: string;
  description: string | null;
  order: number;
}

// Main Component
export default function ClassManagementPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [structures, setStructures] = useState<ClassStructure[]>([]);

  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [structureDialogOpen, setStructureDialogOpen] = useState(false);

  // Edit states
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingStructure, setEditingStructure] = useState<ClassStructure | null>(null);

  // Search states
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const isAdmin = session?.user?.role === "ADMIN";

  // Fetch data
  useEffect(() => {
    if (session) {
      fetchStudents();
      fetchSchedules();
      fetchAnnouncements();
      fetchTeachers();
      fetchStructures();
    }
  }, [session]);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/schedules");
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  const fetchStructures = async () => {
    try {
      const res = await fetch("/api/structure");
      const data = await res.json();
      setStructures(data);
    } catch (error) {
      console.error("Failed to fetch structures:", error);
    }
  };

  // Auth Form Component (Login/Signup)
  const AuthForm = () => {
    const [authMode, setAuthMode] = useState<"login" | "signup" | "verify">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pendingEmail, setPendingEmail] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
        const result = await signIn("credentials", {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: email.toLowerCase().trim(),
            password,
            confirmPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to create account");
        } else {
          setSuccess("Account created! Please verify your email to continue.");
          setPendingEmail(email.toLowerCase().trim());
          // In development, auto-fill verification token
          if (data.verificationToken) {
            setVerificationToken(data.verificationToken);
          }
          setAuthMode("verify");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleVerify = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: pendingEmail,
            token: verificationToken,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Verification failed");
        } else {
          setSuccess("Email verified! You can now sign in.");
          setAuthMode("login");
          setPassword("");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleResendVerification = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/verify", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: pendingEmail }),
        });

        const data = await res.json();

        if (data.verificationToken) {
          setVerificationToken(data.verificationToken);
        }

        setSuccess("If an account exists, a new verification email has been sent.");
      } catch {
        setError("Failed to resend verification email.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "4s" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Class 7.3
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  {authMode === "login"
                    ? "Sign in to your account"
                    : authMode === "signup"
                    ? "Create a new account"
                    : "Verify your email"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
                </Alert>
              )}

              {authMode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setAuthMode("signup");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create New Account
                  </Button>
                </form>
              )}

              {authMode === "signup" && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be 8+ chars with uppercase, lowercase, and number
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setAuthMode("login");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </form>
              )}

              {authMode === "verify" && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <Alert className="border-violet-500 bg-violet-50 dark:bg-violet-950">
                    <Mail className="h-4 w-4 text-violet-500" />
                    <AlertDescription className="text-violet-700 dark:text-violet-300">
                      We&apos;ve sent a verification code to <strong>{pendingEmail}</strong>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="verification-token">Verification Code</Label>
                    <Input
                      id="verification-token"
                      type="text"
                      placeholder="Enter verification code"
                      value={verificationToken}
                      onChange={(e) => setVerificationToken(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Email
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleResendVerification}
                      disabled={isLoading}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend Code
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => {
                        setAuthMode("login");
                        setError("");
                        setSuccess("");
                      }}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground">Welcome to Class 7.3, {session?.user?.name}!</p>
        </div>
        <div className="flex items-center gap-2">
          {!session?.user?.emailVerified && (
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              Email Not Verified
            </Badge>
          )}
          <Badge variant={isAdmin ? "default" : "secondary"} className="px-4 py-2 text-sm">
            {isAdmin ? <Shield className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isAdmin ? "Administrator" : "Member"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Students", value: students.length, icon: Users, color: "from-violet-500 to-purple-500", light: "bg-violet-50 dark:bg-violet-950/50" },
          { title: "Total Teachers", value: teachers.length, icon: GraduationCap, color: "from-pink-500 to-rose-500", light: "bg-pink-50 dark:bg-pink-950/50" },
          { title: "Classes", value: schedules.length, icon: Calendar, color: "from-cyan-500 to-teal-500", light: "bg-cyan-50 dark:bg-cyan-950/50" },
          { title: "Announcements", value: announcements.length, icon: Bell, color: "from-amber-500 to-orange-500", light: "bg-amber-50 dark:bg-amber-950/50" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden ${stat.light} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-violet-500" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {announcements.slice(0, 5).map((announcement) => (
                  <div key={announcement.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${announcement.priority === "high" ? "bg-red-500" : "bg-green-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                    </div>
                    {announcement.isPinned && <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-500" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {schedules.slice(0, 6).map((schedule) => (
                  <div key={schedule.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-1 h-12 rounded-full" style={{ backgroundColor: schedule.color }} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{schedule.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {schedule.startTime} - {schedule.endTime} | {schedule.room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Students Section
  const StudentsSection = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      studentId: "",
      className: "",
      address: "",
      gender: "",
      status: "active",
    });

    const resetForm = () => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        studentId: "",
        className: "",
        address: "",
        gender: "",
        status: "active",
      });
      setEditingStudent(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingStudent) {
          const res = await fetch(`/api/students/${editingStudent.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Student updated successfully" });
            fetchStudents();
          }
        } else {
          const res = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Student added successfully" });
            fetchStudents();
          }
        }
        setStudentDialogOpen(false);
        resetForm();
      } catch {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this student?")) return;
      try {
        const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast({ title: "Success", description: "Student deleted successfully" });
          fetchStudents();
        }
      } catch {
        toast({ title: "Error", description: "Failed to delete student", variant: "destructive" });
      }
    };

    const filteredStudents = students.filter(
      (s) =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.className.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Students
            </h2>
            <p className="text-muted-foreground">Class 7.3 student list</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                resetForm();
                setStudentDialogOpen(true);
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${student.status === "inactive" ? "opacity-60" : ""}`}>
                  <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-500" />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
                        <AvatarImage src={student.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{student.name}</h3>
                          <Badge variant={student.status === "active" ? "default" : "secondary"} className="text-xs">
                            {student.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{student.studentId}</p>
                        <p className="text-sm text-muted-foreground">{student.className}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                      {student.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{student.email}</span>
                        </div>
                      )}
                      {student.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                      {student.gender && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{student.gender}</span>
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingStudent(student);
                            setFormData({
                              name: student.name,
                              email: student.email || "",
                              phone: student.phone || "",
                              studentId: student.studentId,
                              className: student.className,
                              address: student.address || "",
                              gender: student.gender || "",
                              status: student.status,
                            });
                            setStudentDialogOpen(true);
                          }}
                          className="flex-1"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
              <DialogDescription>
                {editingStudent ? "Update student information" : "Fill in the student details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                    disabled={!!editingStudent}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class</Label>
                  <Input
                    id="className"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setStudentDialogOpen(false); resetForm(); }} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600">
                  {editingStudent ? "Update" : "Add"} Student
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Schedule Section
  const ScheduleSection = () => {
    const [formData, setFormData] = useState({
      title: "",
      subject: "",
      day: "Monday",
      startTime: "",
      endTime: "",
      room: "",
      teacherName: "",
      color: "#8b5cf6",
    });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899"];

    const resetForm = () => {
      setFormData({
        title: "",
        subject: "",
        day: "Monday",
        startTime: "",
        endTime: "",
        room: "",
        teacherName: "",
        color: "#8b5cf6",
      });
      setEditingSchedule(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingSchedule) {
          const res = await fetch(`/api/schedules/${editingSchedule.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Schedule updated successfully" });
            fetchSchedules();
          }
        } else {
          const res = await fetch("/api/schedules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Schedule added successfully" });
            fetchSchedules();
          }
        }
        setScheduleDialogOpen(false);
        resetForm();
      } catch {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this schedule?")) return;
      try {
        const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast({ title: "Success", description: "Schedule deleted successfully" });
          fetchSchedules();
        }
      } catch {
        toast({ title: "Error", description: "Failed to delete schedule", variant: "destructive" });
      }
    };

    const schedulesByDay = days.reduce((acc, day) => {
      acc[day] = schedules.filter((s) => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    }, {} as Record<string, Schedule[]>);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Schedule
            </h2>
            <p className="text-muted-foreground">Weekly class schedule</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                resetForm();
                setScheduleDialogOpen(true);
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {days.map((day) => (
            <Card key={day} className="border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {schedulesByDay[day].length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled</p>
                    ) : (
                      schedulesByDay[day].map((schedule) => (
                        <div
                          key={schedule.id}
                          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 relative group"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: schedule.color }} />
                          <div className="pl-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm">{schedule.title}</h4>
                              {isAdmin && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => {
                                      setEditingSchedule(schedule);
                                      setFormData({
                                        title: schedule.title,
                                        subject: schedule.subject,
                                        day: schedule.day,
                                        startTime: schedule.startTime,
                                        endTime: schedule.endTime,
                                        room: schedule.room || "",
                                        teacherName: schedule.teacherName || "",
                                        color: schedule.color,
                                      });
                                      setScheduleDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive"
                                    onClick={() => handleDelete(schedule.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            {schedule.room && (
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {schedule.room}
                              </div>
                            )}
                            {schedule.teacherName && (
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <User className="w-3 h-3" />
                                {schedule.teacherName}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
              <DialogDescription>
                {editingSchedule ? "Update schedule information" : "Fill in the schedule details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select value={formData.day} onValueChange={(v) => setFormData({ ...formData, day: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">Teacher</Label>
                  <Input
                    id="teacherName"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full border-2 ${formData.color === color ? "border-foreground" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setScheduleDialogOpen(false); resetForm(); }} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600">
                  {editingSchedule ? "Update" : "Add"} Schedule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Announcements Section
  const AnnouncementsSection = () => {
    const [formData, setFormData] = useState({
      title: "",
      content: "",
      priority: "normal",
      isPinned: false,
    });

    const resetForm = () => {
      setFormData({ title: "", content: "", priority: "normal", isPinned: false });
      setEditingAnnouncement(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingAnnouncement) {
          const res = await fetch(`/api/announcements/${editingAnnouncement.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Announcement updated successfully" });
            fetchAnnouncements();
          }
        } else {
          const res = await fetch("/api/announcements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Announcement added successfully" });
            fetchAnnouncements();
          }
        }
        setAnnouncementDialogOpen(false);
        resetForm();
      } catch {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this announcement?")) return;
      try {
        const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast({ title: "Success", description: "Announcement deleted successfully" });
          fetchAnnouncements();
        }
      } catch {
        toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" });
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Announcements
            </h2>
            <p className="text-muted-foreground">Important updates and notifications</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                resetForm();
                setAnnouncementDialogOpen(true);
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Announcement
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-0 shadow-lg overflow-hidden ${announcement.isPinned ? "ring-2 ring-amber-400" : ""}`}>
                  <div className={`h-1 ${announcement.priority === "high" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-violet-500 to-purple-500"}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                          {announcement.isPinned && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <Star className="w-3 h-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                          <Badge variant={announcement.priority === "high" ? "destructive" : "secondary"}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-2">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground mt-3">
                          {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingAnnouncement(announcement);
                              setFormData({
                                title: announcement.title,
                                content: announcement.content,
                                priority: announcement.priority,
                                isPinned: announcement.isPinned,
                              });
                              setAnnouncementDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement ? "Update announcement information" : "Create a new announcement"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isPinned"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isPinned" className="text-sm">Pin this announcement</Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setAnnouncementDialogOpen(false); resetForm(); }} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600">
                  {editingAnnouncement ? "Update" : "Add"} Announcement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Teachers Section
  const TeachersSection = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      position: "",
      bio: "",
    });

    const resetForm = () => {
      setFormData({ name: "", email: "", phone: "", subject: "", position: "", bio: "" });
      setEditingTeacher(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingTeacher) {
          const res = await fetch(`/api/teachers/${editingTeacher.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Teacher updated successfully" });
            fetchTeachers();
          }
        } else {
          const res = await fetch("/api/teachers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Teacher added successfully" });
            fetchTeachers();
          }
        }
        setTeacherDialogOpen(false);
        resetForm();
      } catch {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this teacher?")) return;
      try {
        const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast({ title: "Success", description: "Teacher deleted successfully" });
          fetchTeachers();
        }
      } catch {
        toast({ title: "Error", description: "Failed to delete teacher", variant: "destructive" });
      }
    };

    const filteredTeachers = teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Teachers
            </h2>
            <p className="text-muted-foreground">Contact our teaching staff</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                resetForm();
                setTeacherDialogOpen(true);
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          )}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
                        <AvatarImage src={teacher.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold">
                          {teacher.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">{teacher.position || teacher.subject}</p>
                        <Badge variant="outline" className="mt-1">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {teacher.subject}
                        </Badge>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                      {teacher.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${teacher.email}`} className="hover:text-violet-600 transition-colors truncate">
                            {teacher.email}
                          </a>
                        </div>
                      )}
                      {teacher.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${teacher.phone}`} className="hover:text-violet-600 transition-colors">
                            {teacher.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    {teacher.bio && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{teacher.bio}</p>
                    )}
                    {isAdmin && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTeacher(teacher);
                            setFormData({
                              name: teacher.name,
                              email: teacher.email || "",
                              phone: teacher.phone || "",
                              subject: teacher.subject,
                              position: teacher.position || "",
                              bio: teacher.bio || "",
                            });
                            setTeacherDialogOpen(true);
                          }}
                          className="flex-1"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(teacher.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
              <DialogDescription>
                {editingTeacher ? "Update teacher information" : "Fill in the teacher details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setTeacherDialogOpen(false); resetForm(); }} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600">
                  {editingTeacher ? "Update" : "Add"} Teacher
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Structure Section
  const StructureSection = () => {
    const [formData, setFormData] = useState({
      name: "",
      position: "",
      description: "",
      order: 0,
    });

    const resetForm = () => {
      setFormData({ name: "", position: "", description: "", order: 0 });
      setEditingStructure(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingStructure) {
          const res = await fetch(`/api/structure/${editingStructure.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Structure updated successfully" });
            fetchStructures();
          }
        } else {
          const res = await fetch("/api/structure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            toast({ title: "Success", description: "Structure added successfully" });
            fetchStructures();
          }
        }
        setStructureDialogOpen(false);
        resetForm();
      } catch {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this structure?")) return;
      try {
        const res = await fetch(`/api/structure/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast({ title: "Success", description: "Structure deleted successfully" });
          fetchStructures();
        }
      } catch {
        toast({ title: "Error", description: "Failed to delete structure", variant: "destructive" });
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Structure
            </h2>
            <p className="text-muted-foreground">Class organization hierarchy</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                resetForm();
                setStructureDialogOpen(true);
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Structure
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-purple-500 to-pink-500 hidden sm:block" />

          <div className="space-y-4">
            <AnimatePresence>
              {structures.map((structure, index) => (
                <motion.div
                  key={structure.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-0 sm:pl-16"
                >
                  <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 border-4 border-background hidden sm:block" />

                  <Card className="border-0 shadow-lg overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{structure.name}</h3>
                            <Badge variant="outline" className="mt-1">{structure.position}</Badge>
                            {structure.description && (
                              <p className="text-sm text-muted-foreground mt-2">{structure.description}</p>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingStructure(structure);
                                setFormData({
                                  name: structure.name,
                                  position: structure.position,
                                  description: structure.description || "",
                                  order: structure.order,
                                });
                                setStructureDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(structure.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <Dialog open={structureDialogOpen} onOpenChange={setStructureDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStructure ? "Edit Structure" : "Add New Structure"}</DialogTitle>
              <DialogDescription>
                {editingStructure ? "Update structure information" : "Fill in the structure details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setStructureDialogOpen(false); resetForm(); }} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600">
                  {editingStructure ? "Update" : "Add"} Structure
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Navigation Items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "teachers", label: "Teachers", icon: Phone },
    { id: "structure", label: "Structure", icon: Building2 },
  ];

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <AuthForm />;
  }

  // Main App
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Class 7.3
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(item.id)}
                  className={activeSection === item.id ? "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-purple-500/30" : ""}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white text-sm">
                    {session.user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{session.user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="grid grid-cols-3 gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={activeSection === item.id ? "bg-gradient-to-r from-violet-600 to-purple-600" : ""}
                  >
                    <item.icon className="w-4 h-4 mr-1" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="w-full mt-3"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === "dashboard" && <Dashboard />}
            {activeSection === "students" && <StudentsSection />}
            {activeSection === "schedule" && <ScheduleSection />}
            {activeSection === "announcements" && <AnnouncementsSection />}
            {activeSection === "teachers" && <TeachersSection />}
            {activeSection === "structure" && <StructureSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Class 7.3. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made By <b>Keenan Yumaza Veda :P</b>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
