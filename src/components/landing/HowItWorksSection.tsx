import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Brain, CheckCircle, Zap, ArrowLeft } from 'lucide-react';

const steps = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'اكتب أو صوّر',
    description: 'أرسل المعاملة كنص أو صورة فاتورة',
    color: 'bg-emerald-500'
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'الذكاء الاصطناعي يحلل',
    description: 'يفهم البيانات ويحولها لقيد محاسبي',
    color: 'bg-blue-500'
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'راجع القيد',
    description: 'تأكد من صحة البيانات المستخرجة',
    color: 'bg-amber-500'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'اعتماد فوري',
    description: 'وافق لحفظ القيد في دفتر اليومية',
    color: 'bg-purple-500'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            كيف يعمل
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            أربع خطوات بسيطة
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            حوّل معاملاتك إلى قيود محاسبية منظمة في دقائق
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{step.description}</p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -left-3 transform -translate-y-1/2 z-10">
                  <ArrowLeft className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
