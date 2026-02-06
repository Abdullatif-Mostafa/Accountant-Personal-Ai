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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-slate-900">تسجيل الدخول</CardTitle>
          <CardDescription className="text-slate-700">
            أدخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
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
              <Label htmlFor="password" className="text-slate-700">
                كلمة المرور
              </Label>
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
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-600"
              onClick={fillDemoCredentials}
              disabled={isLoading}
            >
              ملء بيانات تجريبية
            </Button>

            <div className="text-center text-sm text-slate-600">
              ليس لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-emerald-600 hover:underline font-medium"
              >
                إنشاء حساب
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
