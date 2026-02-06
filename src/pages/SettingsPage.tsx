import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Save, User, Bell, Shield, Database, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('تم حفظ المعلومات بنجاح');
  };

  const handleExportData = () => {
    toast.info('جاري تحضير البيانات للتصدير...');
    setTimeout(() => {
      toast.success('تم تصدير البيانات بنجاح');
    }, 1500);
  };

  const handleClearData = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      toast.error('تم حذف جميع البيانات');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">الإعدادات</h1>
        <p className="text-slate-500 dark:text-slate-400">إدارة إعدادات الحساب والتفضيلات</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 overflow-x-auto">
          
          <TabsTrigger value="security" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg">
            <Shield className="w-4 h-4" />
            <span>الأمان والخصوصية</span>
          </TabsTrigger>
        
          <TabsTrigger value="data" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg">
            <Database className="w-4 h-4" />
            <span>إدارة البيانات</span>
          </TabsTrigger>
                
          <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg">
            <Bell className="w-4 h-4" />
            <span>الإشعارات</span>
          </TabsTrigger>
         <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg">
            <User className="w-4 h-4" />
            <span>الملف الشخصي</span>
          </TabsTrigger> 

        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" style={{direction:"rtl"}}>
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>تحديث معلومات حسابك والبريد الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                />
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveProfile} disabled={isLoading} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" style={{direction:"rtl"}}>
          <Card>
            <CardHeader>
              <CardTitle>تفضيلات الإشعارات</CardTitle>
              <CardDescription>التحكم في كيفية استلام التنبيهات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">تفعيل الإشعارات</Label>
                  <p className="text-sm text-slate-500">استلام تنبيهات حول المعاملات الجديدة والتقارير</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">ملخص أسبوعي</Label>
                  <p className="text-sm text-slate-500">استلام ملخص أسبوعي عن وضعك المالي</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" style={{direction:"rtl"}}>
          <Card>
            <CardHeader>
              <CardTitle>الأمان والخصوصية</CardTitle>
              <CardDescription>حماية حسابك وبياناتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <Button variant="outline" className="w-full justify-start">تغيير كلمة المرور</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">تسجيل الدخول البيومتري</Label>
                  <p className="text-sm text-slate-500">استخدام بصمة الإصبع أو الوجه للدخول</p>
                </div>
                <Switch 
                  checked={biometric} 
                  onCheckedChange={setBiometric}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" style={{direction:"rtl"}}>
          <Card>
            <CardHeader>
              <CardTitle>إدارة البيانات</CardTitle>
              <CardDescription>تصدير أو حذف بياناتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">تصدير البيانات</h4>
                    <p className="text-sm text-slate-500">تحميل نسخة من جميع بياناتك بتنسيق JSON</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleExportData}>تصدير</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-rose-200 bg-rose-50 dark:bg-rose-900/10 dark:border-rose-900/30">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-rose-700 dark:text-rose-400">منطقة الخطر</h4>
                    <p className="text-sm text-rose-600/80 dark:text-rose-400/80">حذف الحساب وجميع البيانات نهائياً</p>
                  </div>
                </div>
                <Button variant="destructive" onClick={handleClearData}>حذف البيانات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
