import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  FileText, 
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
import { useData } from '@/contexts/DataContext';
import type { AccountingEntry } from '@/types';

export default function EntriesPage() {
  const navigate = useNavigate();
  const { accountingEntries, pendingCount, isLoading, approveEntry, rejectEntry } = useData();
  
  const [selectedEntry, setSelectedEntry] = useState<AccountingEntry | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

 

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

  const EntryCard = ({ entry }: { entry: AccountingEntry }) => (
    <Card className={`border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow ${
      entry.status === 'pending' ? 'border-amber-300 bg-amber-50/30 dark:bg-amber-900/20' : 'bg-white dark:bg-slate-800'
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
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-right py-2 px-3 text-md text-slate-500">الحساب</th>
                <th className="text-right py-2 px-3 text-md text-slate-500">مدين</th>
                <th className="text-right py-2 px-3 text-md text-slate-500">دائن</th>
              </tr>
            </thead>
            <tbody>
              {entry.entries.map((e, idx) => (
                <tr key={idx} className="border-t border-slate-100 dark:border-slate-800">
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
    <div className="p-6" dir="rtl">
    

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">القيود المحاسبية</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">مراجعة واعتماد القيود المحاسبية</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة للرئيسية
        </Button>
      </div>
      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-200">
              لديك {pendingCount} قيد بانتظار المراجعة
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-200">
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
                  <span className="absolute -top-4 -left-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
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
                  <p className="text-slate-500 dark:text-slate-400 mt-2">جاري التحميل...</p>
                </div>
              ) : pendingEntries.length > 0 ? (
                <div className="grid gap-4">
                  {pendingEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    لا توجد قيود قيد المراجعة
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
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
                  <p className="text-slate-500 dark:text-slate-400 mt-2">جاري التحميل...</p>
                </div>
              ) : approvedEntries.length > 0 ? (
                <div className="grid gap-4">
                  {approvedEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    لا توجد قيود معتمدة
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    ستظهر هنا القيود التي تم اعتمادها
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400 mt-2">جاري التحميل...</p>
                </div>
              ) : accountingEntries.length > 0 ? (
                <div className="grid gap-4">
                  {accountingEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    لا توجد قيود محاسبية
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
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
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
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
                <p className="font-medium mb-3 text-white">القيد المحاسبي</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
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
    </div>
  )
  
}
