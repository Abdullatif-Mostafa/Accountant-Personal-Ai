import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'أحمد محمد',
    role: 'صاحب متجر إلكتروني',
    content: 'وفرت لي ساعات من العمل يومياً. المحاسب الذكي يفهم كل شيء من أول مرة!',
    rating: 5
  },
  {
    name: 'سارة العلي',
    role: 'محاسبة مستقلة',
    content: 'أفضل أداة استخدمتها في مسيرتي. التقارير والتحليلات رائعة جداً.',
    rating: 5
  },
  {
    name: 'خالد الراشد',
    role: 'مدير مالي',
    content: 'سهل الاستخدام ودقيق جداً. أنصح به كل من يبحث عن حلول محاسبة ذكية.',
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
            آراء المستخدمين
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            انضم لآلاف المستخدمين الذين يثقون بالمحاسب الذكي
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg bg-slate-50 dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
