import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Articles",
    value: "128",
    description: "+12 from last month",
    icon: FileText,
    trend: "up",
  },
  {
    title: "Active Users",
    value: "2,847",
    description: "+180 from last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Page Views",
    value: "45.2K",
    description: "+8.1% from last month",
    icon: BarChart3,
    trend: "up",
  },
  {
    title: "Engagement Rate",
    value: "24.5%",
    description: "+2.4% from last month",
    icon: TrendingUp,
    trend: "up",
  },
];

const recentActivity = [
  { action: "New article published", title: "Finding Balance in a Digital Age", time: "2 hours ago" },
  { action: "Comment received", title: "The Art of Slow Living", time: "4 hours ago" },
  { action: "New subscriber", title: "john.doe@email.com", time: "5 hours ago" },
  { action: "Article updated", title: "Mindful Morning Routines", time: "1 day ago" },
  { action: "New article published", title: "Sustainable Travel Tips", time: "2 days ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your content performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions on your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="h-2 w-2 mt-2 rounded-full bg-accent" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Create New Article</p>
                  <p className="text-sm text-muted-foreground">Write and publish a new article</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Manage Subscribers</p>
                  <p className="text-sm text-muted-foreground">View and manage your audience</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-muted-foreground">Check detailed performance metrics</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
