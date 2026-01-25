import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role, ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LogIn, User, Shield, Eye, Edit, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, setDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role: Role) => {
    setDemoUser(role);
    navigate(from, { replace: true });
  };

  const roleIcons: Record<Role, React.ReactNode> = {
    admin: <Shield className="h-4 w-4" />,
    editor: <Edit className="h-4 w-4" />,
    viewer: <Eye className="h-4 w-4" />,
  };

  const roleDescriptions: Record<Role, string> = {
    admin: 'Toàn quyền: quản lý người dùng, cài đặt, nội dung',
    editor: 'Tạo và chỉnh sửa nội dung, báo cáo',
    viewer: 'Chỉ xem nội dung, không chỉnh sửa',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Đăng nhập</h1>
          <p className="text-muted-foreground mt-2">
            Chọn phương thức đăng nhập của bạn
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo Mode</TabsTrigger>
            <TabsTrigger value="login">Đăng nhập thật</TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Chọn vai trò Demo
                </CardTitle>
                <CardDescription>
                  Đăng nhập nhanh để thử nghiệm các vai trò khác nhau
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(['admin', 'editor', 'viewer'] as Role[]).map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    className="w-full justify-start h-auto py-4"
                    onClick={() => handleDemoLogin(role)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {roleIcons[role]}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{ROLE_DISPLAY_NAMES[role]}</span>
                          <Badge variant="secondary" className="text-xs">
                            {role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {roleDescriptions[role]}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Đăng nhập
                </CardTitle>
                <CardDescription>
                  Nhập thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
