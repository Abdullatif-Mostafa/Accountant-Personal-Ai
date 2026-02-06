import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  LogOut,
  CheckCircle,
  XCircle,
  Eye,
  Bot,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Calendar,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { AccountingEntry } from '@/types';

export default function EntriesPage() {
  const navigate = useNavigate();
  // const { user, logout } = useAuth();
  const { logout } = useAuth();
  const { accountingEntries, pendingCount, isLoading, approveEntry, rejectEntry } = useData();
  
  const [selectedEntry, setSelectedEntry] = useState<AccountingEntry | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await approveEntry(id);
    setProcessingId(null);
    if (selectedEntry?.id === id) {
      setShowDetailsDialog(false);
      setSelectedEntry(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    await rejectEntry(id);
    setProcessingId(null);
    if (selectedEntry?.id === id) {
      setShowDetailsDialog(false);
      setSelectedEntry(null);
    }
  };

  const handleViewDetails = (entry: AccountingEntry) => {
    setSelectedEntry(entry);
    setShowDetailsDialog(true);
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

  const pendingEntries = accountingEntries.filter(e => e.status === 'pending');
  const approvedEntries = accountingEntries.filter(e => e.status === 'approved');

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'الرئيسية', path: '/dashboard' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'المحادثة الذكية', path: '/chat' },
    { icon: <FileText className="w-5 h-5" />, label: 'القيود المحاسبية', path: '/entries', active: true },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'التقارير', path: '/reports' },
  ];

  const EntryCard = ({ entry }: { entry: AccountingEntry }) => (
    <Card className={`border-slate-200 hover:shadow-md transition-shadow ${
      entry.status === 'pending' ? 'border-amber-300 bg-amber-50/30' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900">{entry.description}</h3>
              {entry.status === 'pending' ? (
                <Badge className="bg-amber-100 text-amber-700">قيد المراجعة</Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700">معتمد</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(entry.date)}
              </span>
              <span className="flex items-center gap-1">
                <Bot className="w-4 h-4" />
                {entry.source === 'ai' ? 'AI' : 'يدوي'}
              </span>
            </div>
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-900">{formatCurrency(entry.totalDebit)}</p>
          </div>
        </div>

        {/* Accounting Entries Preview */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-right py-2 px-3 text-xs text-slate-500">الحساب</th>
                <th className="text-right py-2 px-3 text-xs text-slate-500">مدين</th>
                <th className="text-right py-2 px-3 text-xs text-slate-500">دائن</th>
              </tr>
            </thead>
            <tbody>
              {entry.entries.map((e, idx) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="py-2 px-3">{e.account}</td>
                  <td className="py-2 px-3 text-emerald-600">
                    {e.debit > 0 ? formatCurrency(e.debit) : '-'}
                  </td>
                  <td className="py-2 px-3 text-rose-600">
                    {e.credit > 0 ? formatCurrency(e.credit) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewDetails(entry)}
          >
            <Eye className="w-4 h-4 ml-2" />
            التفاصيل
          </Button>
          
          {entry.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => handleReject(entry.id)}
                disabled={processingId === entry.id}
              >
                {processingId === entry.id ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 ml-2" />
                )}
                رفض
              </Button>
              <Button 
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(entry.id)}
                disabled={processingId === entry.id}
              >
                {processingId === entry.id ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 ml-2" />
                )}
                اعتماد
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-white border-l border-slate-200 hidden lg:flex flex-col">
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
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">القيود المحاسبية</span>
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
              <h2 className="text-2xl font-bold text-slate-900">القيود المحاسبية</h2>
              <p className="text-slate-600 mt-1">مراجعة واعتماد القيود المحاسبية</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </div>

          {/* Pending Alert */}
          {pendingCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-900">
                  لديك {pendingCount} قيد بانتظار المراجعة
                </p>
                <p className="text-sm text-amber-700">
                  يرجى مراجعة القيود أدناه والموافقة عليها أو رفضها
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="relative">
                قيد المراجعة
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">المعتمدة</TabsTrigger>
              <TabsTrigger value="all">الكل</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                  <p className="text-slate-500 mt-2">جاري التحميل...</p>
                </div>
              ) : pendingEntries.length > 0 ? (
                <div className="grid gap-4">
                  {pendingEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    لا توجد قيود قيد المراجعة
                  </h3>
                  <p className="text-slate-500 mb-4">
                    جميع القيود معتمدة. يمكنك إضافة قيد جديد من المحادثة الذكية.
                  </p>
                  <Button onClick={() => navigate('/chat')} className="bg-emerald-600 hover:bg-emerald-700">
                    <MessageSquare className="w-4 h-4 ml-2" />
                    محادثة جديدة
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                  <p className="text-slate-500 mt-2">جاري التحميل...</p>
                </div>
              ) : approvedEntries.length > 0 ? (
                <div className="grid gap-4">
                  {approvedEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                  <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    لا توجد قيود معتمدة
                  </h3>
                  <p className="text-slate-500">
                    ستظهر هنا القيود التي تم اعتمادها
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                  <p className="text-slate-500 mt-2">جاري التحميل...</p>
                </div>
              ) : accountingEntries.length > 0 ? (
                <div className="grid gap-4">
                  {accountingEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    لا توجد قيود محاسبية
                  </h3>
                  <p className="text-slate-500 mb-4">
                    ابدأ بإضافة قيد جديد من المحادثة الذكية
                  </p>
                  <Button onClick={() => navigate('/chat')} className="bg-emerald-600 hover:bg-emerald-700">
                    <MessageSquare className="w-4 h-4 ml-2" />
                    محادثة جديدة
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Entry Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل القيد المحاسبي</DialogTitle>
            <DialogDescription>
              مراجعة تفاصيل القيد قبل اتخاذ القرار
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-slate-500">الوصف</p>
                  <p className="font-medium">{selectedEntry.description}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">التاريخ</p>
                  <p className="font-medium">{formatDate(selectedEntry.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">المصدر</p>
                  <p className="font-medium">{selectedEntry.source === 'ai' ? 'المحاسب الذكي' : 'إدخال يدوي'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">الحالة</p>
                  <div>
                    {selectedEntry.status === 'pending' ? (
                      <Badge className="bg-amber-100 text-amber-700">قيد المراجعة</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700">معتمد</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Accounting Table */}
              <div>
                <p className="font-medium mb-3">القيد المحاسبي</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">الحساب</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">مدين</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">دائن</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEntry.entries.map((entry, idx) => (
                        <tr key={idx} className="border-t border-slate-100">
                          <td className="py-3 px-4">{entry.account}</td>
                          <td className="py-3 px-4 text-emerald-600 font-medium">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                          </td>
                          <td className="py-3 px-4 text-rose-600 font-medium">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-medium">
                      <tr>
                        <td className="py-3 px-4">الإجمالي</td>
                        <td className="py-3 px-4 text-emerald-600">{formatCurrency(selectedEntry.totalDebit)}</td>
                        <td className="py-3 px-4 text-rose-600">{formatCurrency(selectedEntry.totalCredit)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions */}
              {selectedEntry.status === 'pending' && (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => handleReject(selectedEntry.id)}
                    disabled={processingId === selectedEntry.id}
                  >
                    {processingId === selectedEntry.id ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 ml-2" />
                    )}
                    رفض القيد
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(selectedEntry.id)}
                    disabled={processingId === selectedEntry.id}
                  >
                    {processingId === selectedEntry.id ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 ml-2" />
                    )}
                    اعتماد القيد
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
