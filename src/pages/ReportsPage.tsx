import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  LogOut,
  Bot,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Download,
  FileSpreadsheet,
  FilePieChart,
  ArrowLeft,
  Loader2,
  PieChart,
  BarChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { reportsApi } from '@/services/api';
import type { ReportData, ReportFilters } from '@/types';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pendingCount } = useData();
  
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'all'
  });
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await reportsApi.generate(filters);
      if (response.success && response.data) {
        setReportData(response.data);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'الرئيسية', path: '/dashboard' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'المحادثة الذكية', path: '/chat' },
    { icon: <FileText className="w-5 h-5" />, label: 'القيود المحاسبية', path: '/entries' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'التقارير', path: '/reports', active: true },
  ];

  // Calculate percentages for category breakdown
  const getCategoryPercentage = (amount: number) => {
    if (!reportData) return 0;
    const total = reportData.totalIncome + reportData.totalExpense;
    return total > 0 ? (amount / total) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">المحاسب الذكي</h1>
              <p className="text-xs text-slate-500">AI Accountant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.path === '/entries' && pendingCount > 0 && (
                  <Badge className="mr-auto bg-amber-500 text-white">{pendingCount}</Badge>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-600 font-medium">
                {user?.name?.charAt(0) || 'م'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{user?.name || 'مستخدم'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">التقارير</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">التقارير المالية</h2>
              <p className="text-slate-600 mt-1">استخراج وتحليل التقارير المالية</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                فلترة التقرير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">من تاريخ</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">إلى تاريخ</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع المعاملة</Label>
                  <select
                    id="type"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as ReportFilters['type'] })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                  >
                    <option value="all">الكل</option>
                    <option value="income">الإيرادات فقط</option>
                    <option value="expense">المصروفات فقط</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 ml-2" />
                        توليد التقرير
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Results */}
          {hasGenerated && reportData && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">إجمالي الإيرادات</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(reportData.totalIncome)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">إجمالي المصروفات</p>
                        <p className="text-2xl font-bold text-rose-600">
                          {formatCurrency(reportData.totalExpense)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-rose-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">الرصيد الصافي</p>
                        <p className={`text-2xl font-bold ${
                          reportData.netAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {formatCurrency(reportData.netAmount)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction Count */}
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-5 h-5" />
                <span>عدد المعاملات: <strong>{reportData.transactionCount}</strong> معاملة</span>
              </div>

              {/* Category Breakdown */}
              {reportData.categoryBreakdown.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      التحليل حسب التصنيف
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.categoryBreakdown.map((category, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{category.category}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-500">{category.count} معاملة</span>
                              <span className="font-bold">{formatCurrency(category.amount)}</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all"
                              style={{ width: `${getCategoryPercentage(category.amount)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Daily Data */}
              {reportData.dailyData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart className="w-5 h-5" />
                      الحركات اليومية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">التاريخ</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">الإيرادات</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">المصروفات</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">الصافي</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.dailyData.map((day, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-3 px-4">{formatDate(day.date)}</td>
                              <td className="py-3 px-4 text-emerald-600">{formatCurrency(day.income)}</td>
                              <td className="py-3 px-4 text-rose-600">{formatCurrency(day.expense)}</td>
                              <td className={`py-3 px-4 font-medium ${
                                (day.income - day.expense) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}>
                                {formatCurrency(day.income - day.expense)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    تصدير التقرير
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      تصدير Excel
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FilePieChart className="w-4 h-4" />
                      تصدير PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {hasGenerated && !reportData && (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                لا توجد بيانات للفترة المحددة
              </h3>
              <p className="text-slate-500">
                جرب تغيير فترة التقرير أو إضافة معاملات جديدة
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                item.active ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
