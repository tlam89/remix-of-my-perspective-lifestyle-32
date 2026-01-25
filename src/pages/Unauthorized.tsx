import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldX, Home, ArrowLeft, User } from 'lucide-react';
import { getRoleDisplayName } from '@/lib/permissions';

export default function Unauthorized() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto p-4 rounded-full bg-destructive/10 w-fit mb-4">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Không có quyền truy cập</CardTitle>
          <CardDescription>
            Bạn không có quyền truy cập trang này
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAuthenticated && user && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{user.name || user.email}</p>
                  <div className="flex gap-2 mt-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {getRoleDisplayName(role)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground text-center">
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên để được hỗ trợ.
          </p>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Về trang Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Về trang chủ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
