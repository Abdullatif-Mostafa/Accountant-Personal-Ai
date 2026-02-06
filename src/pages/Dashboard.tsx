import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExpensePieChart, IncomeExpenseBarChart, MiniTrendChart } from '@/components/Charts';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  ArrowLeft,
  Plus,
  Sparkles,
  Calendar,
  Target,
  PiggyBank,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dashboardStats, pendingCount, isLoading } = useData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionTypeColor = (type: string) => {
    return type === 'income' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' 
      : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400';
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'income' ? 'إيراد' : 'مصروف';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'معتمد';
      case 'pending':
        return 'قيد المراجعة';
      default:
        return status;
    }
  };

  // Sample data for charts
  const expenseData = [
    { name: 'خدمات', value: 2500 },
    { name: 'مواصلات', value: 1800 },
    { name: 'مطاعم', value: 1500 },
    { name: 'تسوق', value: 1200 },
    { name: 'أخرى', value: 800 },
  ];

  const monthlyData = [
    { name: 'يناير', income: 15000, expense: 12000 },
    { name: 'فبراير', income: 18000, expense: 11000 },
    { name: 'مارس', income: 16000, expense: 13000 },
    { name: 'أبريل', income: 20000, expense: 14000 },
    { name: 'مايو', income: 22000, expense: 15000 },
    { name: 'يونيو', income: 25000, expense: 16000 },
  ];

  return (
    <div className="p-6" dir="rtl">
      {/* Welcome Banner */}
      <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-emerald-100 text-sm">مرحباً بك مجدداً</span>
            </div>
            <h2 className="text-2xl font-bold">{user?.name || 'مستخدم'} 👋</h2>
            <p className="text-emerald-100 mt-1">لديك {pendingCount} قيد بانتظار المراجعة</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="card-hover border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {isLoading ? '...' : formatCurrency(dashboardStats?.totalIncome || 0)}
                </p>
                <div className="flex items-center gap-1 mt-1 text-emerald-500 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
            <MiniTrendChart data={[10000, 12000, 11000, 15000, 14000, 18000]} color="#10b981" />
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">إجمالي المصروفات</p>
                <p className="text-2xl font-bold text-rose-600">
                  {isLoading ? '...' : formatCurrency(dashboardStats?.totalExpense || 0)}
                </p>
                <div className="flex items-center gap-1 mt-1 text-rose-500 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>+5%</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-7 h-7 text-rose-600" />
              </div>
            </div>
            <MiniTrendChart data={[8000, 9000, 8500, 10000, 9500, 11000]} color="#ef4444" />
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">الرصيد الصافي</p>
                <p className={`text-2xl font-bold ${
                  (dashboardStats?.netBalance || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {isLoading ? '...' : formatCurrency(dashboardStats?.netBalance || 0)}
                </p>
                <div className="flex items-center gap-1 mt-1 text-slate-500 text-sm">
                  <PiggyBank className="w-4 h-4" />
                  <span>المدخرات</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Wallet className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <MiniTrendChart data={[2000, 3000, 2500, 5000, 4500, 7000]} color="#3b82f6" />
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">عدد القيود</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoading ? '...' : dashboardStats?.transactionCount || 0}
                </p>
                <div className="flex items-center gap-1 mt-1 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>هذا الشهر</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-purple-600" />
              </div>
            </div>
            <MiniTrendChart data={[10, 15, 12, 20, 18, 25]} color="#8b5cf6" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              الإيرادات vs المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseBarChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-500" />
              توزيع المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={expenseData} />
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Review Alert */}
        <Card className={pendingCount > 0 ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-900/20' : 'border-0 shadow-lg'}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                pendingCount > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <AlertCircle className={`w-6 h-6 ${
                  pendingCount > 0 ? 'text-amber-600' : 'text-slate-500'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  قيود قيد المراجعة
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {pendingCount > 0 
                    ? `لديك ${pendingCount} قيد محاسبي بانتظار مراجعتك` 
                    : 'لا توجد قيود بانتظار المراجعة'}
                </p>
                {pendingCount > 0 && (
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/entries')}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    مراجعة الآن
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action: New Transaction */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  إضافة معاملة جديدة
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  استخدم المحادثة الذكية لإضافة معاملة جديدة
                </p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/chat')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  محادثة جديدة
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action: Reports */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  عرض التقارير
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  استعرض تقاريرك المالية وتحليلاتك
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/reports')}
                >
                  الذهاب للتقارير
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">آخر المعاملات</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/entries')}>
            عرض الكل
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">جاري التحميل...</div>
          ) : dashboardStats?.recentTransactions && dashboardStats.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">التاريخ</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">الوصف</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">التصنيف</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">المبلغ</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">النوع</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardStats.recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{formatDate(transaction.date)}</td>
                      <td className="py-3 px-4 text-sm font-medium">{transaction.description}</td>
                      <td className="py-3 px-4 text-sm">{transaction.category}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={getTransactionTypeColor(transaction.type)}>
                          {getTransactionTypeLabel(transaction.type)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusLabel(transaction.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              لا توجد معاملات حتى الآن
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
