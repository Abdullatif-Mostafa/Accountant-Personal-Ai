import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * صفحة تحويل قديمة - يتم توجيه المستخدمين تلقائياً إلى صفحة تسجيل الدخول
 * استخدم /login للدخول و /register للتسجيل بدلاً من هذه الصفحة
 */
export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // إعادة توجيه تلقائية إلى صفحة تسجيل الدخول
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}
