import { ThemeToggle } from '@/components/ThemeToggle';
import { Bot } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-lg">المحاسب الذكي</span>
            </div>
            <p className="text-sm leading-relaxed">
              حوّل معاملاتك المالية إلى قيود محاسبية منظمة باستخدام الذكاء الاصطناعي.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">المنتج</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">المميزات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">التسعير</a></li>
              <li><a href="#" className="hover:text-white transition-colors">التحديثات</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المدونة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © 2025 AI Personal Accountant. جميع الحقوق محفوظة.
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
