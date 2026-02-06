import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/AuthLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    
    const success = await register(email, password, name);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('البريد الإلكتروني مستخدم بالفعل');
    }
  };

  const passwordStrength = password ? (
    password.length < 6 ? 'ضعيفة' : password.length < 10 ? 'متوسطة' : 'قوية'
  ) : '';

  const strengthColor = {
    'ضعيفة': 'text-red-600 dark:text-red-400',
    'متوسطة': 'text-yellow-600 dark:text-yellow-400',
    'قوية': 'text-green-600 dark:text-green-400',
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-slate-900">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-slate-600">
            أنشئ حسابك وابدأ رحلتك مع المحاسبة الذكية
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                الاسم الكامل
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="محمد أحمد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="text-right bg-white border-slate-200 text-slate-900 placeholder:text-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="text-right bg-white border-slate-200 text-slate-900 placeholder:text-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700">
                  كلمة المرور
                </Label>
                {passwordStrength && (
                  <span className={`text-xs font-medium ${strengthColor[passwordStrength as keyof typeof strengthColor]}`}>
                    {passwordStrength}
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="text-right bg-white border-slate-200 text-slate-900 placeholder:text-slate-600 pr-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                يجب أن تكون مليئة بـ 6 أحرف على الأقل
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-700">
                تأكيد كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="text-right bg-white border-slate-200 text-slate-900 placeholder:text-slate-600 pr-4"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                'إنشاء حساب'
              )}
            </Button>

            <div className="text-center text-sm text-slate-600">
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-emerald-600 hover:underline font-medium"
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
