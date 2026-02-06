import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, FileQuestion, BookOpen, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: 'كيف يمكنني إضافة فاتورة جديدة؟',
      answer: 'يمكنك إضافة فاتورة جديدة من خلال صفحة "المحادثة الذكية". يمكنك كتابة تفاصيل الفاتورة نصياً (مثلاً: "دفعت 100 ريال فاتورة كهرباء") أو رفع صورة الفاتورة ليقوم الذكاء الاصطناعي بتحليلها.'
    },
    {
      question: 'هل بياناتي آمنة؟',
      answer: 'نعم، نحن نولي اهتماماً كبيراً لخصوصية وأمان بياناتك. جميع البيانات مشفرة ويتم تخزينها بشكل آمن. نحن لا نشارك بياناتك المالية مع أي طرف ثالث.'
    },
    {
      question: 'كيف يعمل الذكاء الاصطناعي في التطبيق؟',
      answer: 'يستخدم التطبيق نماذج لغوية متطورة لفهم مدخلاتك النصية وتحليل صور الفواتير. يقوم النظام باستخراج المعلومات المهمة مثل المبلغ، التاريخ، والتصنيف، ثم يقترح القيد المحاسبي المناسب.'
    },
    {
      question: 'هل يمكنني تعديل القيود بعد اعتمادها؟',
      answer: 'حالياً، بمجرد اعتماد القيد، يصبح جزءاً من السجلات الدائمة. إذا اكتشفت خطأ، يمكنك إنشاء قيد عكسي لتصحيحه. سنضيف ميزة تعديل القيود في التحديثات القادمة.'
    },
    {
      question: 'كيف يمكنني استخراج تقرير ضريبي؟',
      answer: 'يمكنك الذهاب إلى صفحة "التقارير" واختيار الفترة الزمنية المطلوبة. سيوفر لك النظام ملخصاً للإيرادات والمصروفات يساعدك في إعداد إقراراتك الضريبية.'
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">المساعدة والدعم</h1>
        <p className="text-slate-500 dark:text-slate-400">إجابات على الأسئلة الشائعة وطرق التواصل معنا</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-emerald-600" />
              <CardTitle>الأسئلة الشائعة</CardTitle>
            </div>
            <CardDescription>إجابات سريعة على أكثر الأسئلة شيوعاً</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-right">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <CardTitle>تواصل معنا</CardTitle>
              </div>
              <CardDescription>نحن هنا لمساعدتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2" variant="outline">
                <Mail className="w-4 h-4" />
                راسل الدعم الفني
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <MessageCircle className="w-4 h-4" />
                محادثة مباشرة
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <CardTitle>دليل الاستخدام</CardTitle>
              </div>
              <CardDescription>شروحات مفصلة للمميزات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="text-sm font-medium">كيف تبدأ؟</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="text-sm font-medium">شرح القيود المحاسبية</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="text-sm font-medium">إدارة التقارير</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
