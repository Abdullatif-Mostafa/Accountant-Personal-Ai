import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Menu,
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  LogOut, 
  Bot, 
  Settings, 
  HelpCircle,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export function MobileHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { pendingCount } = useData();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'الرئيسية', path: '/dashboard' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'المحادثة الذكية', path: '/chat' },
    { icon: <FileText className="w-5 h-5" />, label: 'القيود المحاسبية', path: '/entries' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'التقارير', path: '/reports' },
    { icon: <Wallet className="w-5 h-5" />, label: 'الحسابات', path: '/accounts' },
    { icon: <Settings className="w-5 h-5" />, label: 'الإعدادات', path: '/settings' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'المساعدة', path: '/help' },
  ];

  return (
    <div className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <div className="flex flex-col h-full bg-white dark:bg-slate-900">
                {/* Logo */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-slate-900 dark:text-white text-lg">المحاسب الذكي</h1>
                      <p className="text-xs text-slate-500 dark:text-slate-400">AI Accountant</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                          {item.path === '/entries' && pendingCount > 0 && (
                            <Badge className={`mr-auto ${isActive ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'}`}>
                              {pendingCount}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </nav>

                {/* User & Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-slate-700 dark:text-slate-200 font-bold">
                        {user?.name?.charAt(0) || 'م'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{user?.name || 'مستخدم'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ThemeToggle />
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 ml-2" />
                      خروج
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">المحاسب الذكي</span>
          </div>
        </div>
      </div>
    </div>
  );
}
