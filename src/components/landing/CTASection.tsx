import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowLeft } from 'lucide-react';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-12 text-center text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">جاهز لتجربة المحاسبة الذكية؟</h2>
              <p className="text-emerald-100 mb-8 text-lg max-w-xl mx-auto">
                انضم الآن واستمتع بتجربة محاسبة سهلة وذكية. لا حاجة لبطاقة ائتمان.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl shadow-xl"
                >
                  ابدأ مجاناً الآن
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                >
                  جرب النسخة التجريبية
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
