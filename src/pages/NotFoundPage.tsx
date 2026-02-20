import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
      dir="rtl"
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center max-w-md">
        <AlertCircle className="w-24 h-24 text-rose-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          404 - الصفحة غير موجودة
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
          يبدو أنك حاولت الوصول إلى مسار غير موجود أو تمت إزالة الصفحة.
          يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.
        </p>
        <Button
          onClick={handleGoBack}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl h-12 w-full"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          {isAuthenticated ? 'اذهب إلى لوحة التحكم' : 'العودة للرئيسية'}
        </Button>
      </div>
    </div>
  );
}
