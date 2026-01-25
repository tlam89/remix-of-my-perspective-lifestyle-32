import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Shield, Settings } from 'lucide-react';
import { getRoleDisplayName, Role } from '@/lib/permissions';
import { useNavigate } from 'react-router-dom';
import { PermissionGate } from './auth/PermissionGate';

export function UserMenu() {
  const { user, logout, isDemoMode, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Button variant="outline" onClick={() => navigate('/login')}>
        <User className="h-4 w-4 mr-2" />
        Đăng nhập
      </Button>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left hidden sm:flex">
            <span className="text-sm font-medium">{user.name || user.email}</span>
            <div className="flex items-center gap-1">
              {user.roles.slice(0, 1).map((role) => (
                <Badge key={role} variant="secondary" className="text-xs py-0 h-5">
                  {getRoleDisplayName(role as Role)}
                </Badge>
              ))}
              {isDemoMode && (
                <Badge variant="outline" className="text-xs py-0 h-5 border-dashed">
                  Demo
                </Badge>
              )}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{user.name || 'Người dùng'}</span>
            <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          <Shield className="h-4 w-4 mr-2" />
          Vai trò: {user.roles.map((r) => getRoleDisplayName(r as Role)).join(', ')}
        </DropdownMenuItem>

        <PermissionGate permission="admin.access">
          <DropdownMenuItem onClick={() => navigate('/dashboard/admin')}>
            <Settings className="h-4 w-4 mr-2" />
            Quản trị
          </DropdownMenuItem>
        </PermissionGate>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
