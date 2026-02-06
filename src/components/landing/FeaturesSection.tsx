import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Camera, 
  Shield, 
  BarChart3, 
  Lock, 
  Clock 
} from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-10 h-10 text-emerald-500" />,
    title: 'محاسب ذكي بالذكاء الاصطناعي',
    description: 'يفهم لغتك الطبيعية ويحول كلماتك إلى قيود محاسبية دقيقة في ثوانٍ',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: <Camera className="w-10 h-10 text-blue-500" />,
    title: 'قراءة الفواتير بالكاميرا',
    description: 'صوّر أي فاتورة وسنستخرج البيانات تلقائياً باستخدام تقنية OCR المتقدمة',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Shield className="w-10 h-10 text-purple-500" />,
    title: 'مراجعة قبل الحفظ',
    description: 'راجع كل قيد محاسبي قبل اعتماده - أنت المتحكم الكامل في بياناتك',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-orange-500" />,
    title: 'تقارير وتحليلات ذكية',
    description: 'احصل على رؤى مالية عميقة مع رسوم بيانية تفاعلية وتحليلات متقدمة',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: <Lock className="w-10 h-10 text-indigo-500" />,
    title: 'أمان وخصوصية تامة',
    description: 'بياناتك محمية ومشفرة. لا نشارك بياناتك مع أي طرف ثالث',
    color: 'from-indigo-500 to-violet-500'
  },
  {
    icon: <Clock className="w-10 h-10 text-rose-500" />,
    title: 'توفير الوقت والجهد',
    description: 'اختصر ساعات العمل إلى دقائق. ركز على عملك ودع المحاسبة لنا',
    color: 'from-rose-500 to-pink-500'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-slate-900 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            المميزات
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            كل ما تحتاجه لإدارة محاسبتك
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            مجموعة متكاملة من الأدوات الذكية لمساعدتك في إدارة finances بكفاءة وسهولة
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${feature.color}`} />
              <CardContent className="p-6">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
