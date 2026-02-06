import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, ChevronDown, Play } from 'lucide-react';

const stats = [
  { value: '10K+', label: 'مستخدم نشط' },
  { value: '1M+', label: 'معاملة محاسبية' },
  { value: '99.9%', label: 'دقة التعرف' },
  { value: '4.9', label: 'تقييم المستخدمين' },
];

export function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-32 pb-20 px-4 overflow-hidden"
      style={{ transform: `translateY(${scrollY * 0.1}px)` }}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>النسخة 2.0 متاحة الآن مع مميزات جديدة</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
          <span className="text-slate-900 dark:text-white">محاسبك</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            الذكي الشخصي
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
          حوّل معاملاتك المالية إلى قيود محاسبية منظمة في ثوانٍ.
          <br className="hidden md:block" />
          باستخدام الذكاء الاصطناعي، لا حاجة لخبرة محاسبية - فقط اكتب أو صوّر.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
          <Button 
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl shadow-emerald-500/20"
          >
            ابدأ الآن مجاناً
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate('/login')}
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-6 text-lg rounded-xl"
          >
            <Play className="w-5 h-5 ml-2" />
            جرب النسخة التجريبية
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-slate-400" />
      </div>
    </section>
  );
}
