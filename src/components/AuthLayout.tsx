import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
            <Bot className="w-8 h-8 text-white" />
          </div>
          {/* <h1 className="text-2xl font-bold text-slate-900 dark:text-white">المحاسب الذكي</h1> */}
          <p className="text-slate-600 dark:text-slate-400 mt-1">AI Personal Accountant</p>
        </div>

        {/* Content */}
        {children}

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
