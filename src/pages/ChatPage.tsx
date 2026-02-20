import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  // LayoutDashboard, 
  // MessageSquare, 
  // FileText, 
  // BarChart3,
  LogOut,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText as FileIcon,
  X,
  Bot,
  User,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { entriesApi, transactionsApi } from '@/services/api';
import { sendToN8n, parseUserMessage } from '@/services/n8n';
import type { ChatMessage, ExtractedTransactionData } from '@/types';

export default function ChatPage() {
  const navigate = useNavigate();
  const {  logout } = useAuth();
  const {  refreshData } = useData();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingData, setPendingData] = useState<ExtractedTransactionData | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } catch {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [messages]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: 'مرحباً! 👋\n\nأنا مساعدك المحاسبي الذكي. يمكنك إرسال لي:\n\n📝 **نصوص** مثل: "دفعت 250 ريال فاتورة كهرباء"\n📸 **صور** (فواتير، إيصالات...)\n📄 **ملفات** (PDF، اكسل، Word...)\n📊 **تقارير** أو أي محتوى محاسبي آخر\n\nسأعالج المحتوى وأرسله للنظام تلقائياً 📤',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage || (selectedFile ? `مرفق: ${selectedFile.name}` : ''),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let fileContent = inputMessage;

      if (selectedFile) {
        // Handle different file types
        if (selectedFile.type.startsWith('image/')) {
          // For images, try to extract text using OCR (using local parsing for now)
          fileContent = `📸 صورة: ${selectedFile.name}\n\nملاحظة: تم رفع صورة، يرجى التأكد من وضوح البيانات المالية في الصورة.`;
        } else if (selectedFile.type === 'application/pdf') {
          fileContent = `📄 ملف PDF: ${selectedFile.name}\n\nملاحظة: تم رفع ملف PDF.`;
        } else {
          fileContent = `📎 ملف: ${selectedFile.name}\n\nنوع الملف: ${selectedFile.type || 'غير معروف'}`;
        }
        setSelectedFile(null);
      }
      // Parse the text message or file content locally
      const extractedData = parseUserMessage(fileContent || userMessage.content);

      // Send to n8n webhook (even if amount is 0 for general content)
      const response = await sendToN8n(userMessage.content, extractedData);
      console.log(" response ",response)      
      if (response.success) {
        const amount = extractedData.amount ?? 0;
        const amountText = amount > 0 
          ? `💰 **المبلغ:** ${amount} ريال\n`
          : ''
        const aiResponse: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: `✅ **تم معالجة المحتوى بنجاح!**\n\n📋 **الوصف:** ${extractedData.description}\n${amountText}📂 **التصنيف:** ${extractedData.category}\n📅 **التاريخ:** ${extractedData.date}\n🎯 **الدقة:** ${Math.round(((extractedData.confidence ?? 0) * 100))}%\n\n${amount > 0 ? 'هل تريد مراجعة القيد المحاسبي قبل الحفظ؟' : 'تم حفظ المحتوى بنجاح!'}`,
          timestamp: new Date().toISOString(),
          extractedData
        };

        setMessages(prev => [...prev, aiResponse]);
        
        // Only show review modal if there's an amount to verify
        if (amount > 0) {
          setPendingData(extractedData);
          setShowReviewModal(true);
        }
      } else {
        setMessages(prev => [...prev, {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `❌ حدث خطأ أثناء معالجة المحتوى:\n\n${response.error || 'الرجاء المحاولة مرة أخرى'}\n\n💡 **نصيحة:**\n• يمكنك إرسال نص أو صورة أو ملف\n• إذا كان فاتورة، تأكد من وضوح المبلغ\n• يمكنك أيضاً إرسال تقارير أو ملاحظات عامة`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '❌ عذراً، حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleApproveEntry = async () => {
    if (!pendingData) return;

    try {
      // Create accounting entry
      const entryData = {
        date: pendingData.date || new Date().toISOString().split('T')[0],
        description: pendingData.description || '',
        entries: pendingData.entries || [],
        totalDebit: pendingData.entries?.reduce((sum, e) => sum + e.debit, 0) || 0,
        totalCredit: pendingData.entries?.reduce((sum, e) => sum + e.credit, 0) || 0,
        status: 'pending' as const,
        source: 'ai' as const
      };

      await entriesApi.create(entryData);

      // Also create transaction record
      const isExpense = pendingData.entries?.some(e => e.account.includes('مصروف'));
      await transactionsApi.create({
        date: pendingData.date || new Date().toISOString().split('T')[0],
        description: pendingData.description || '',
        amount: pendingData.amount || 0,
        type: isExpense ? 'expense' : 'income',
        category: pendingData.category || 'عام',
        account: 'النقدية',
        status: 'pending',
        source: 'ai_chat'
      });

      // Add confirmation message
      setMessages(prev => [...prev, {
        id: `confirm-${Date.now()}`,
        role: 'assistant',
        content: '✅ **تم إرسال القيد للمراجعة!**\n\nيمكنك مراجعة القيد في صفحة "القيود المحاسبية" والموافقة عليه.',
        timestamp: new Date().toISOString()
      }]);

      await refreshData();
    } catch (error) {
      console.error('Error creating entry:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '❌ حدث خطأ أثناء حفظ القيد. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setShowReviewModal(false);
      setPendingData(null);
    }
  };

  const handleRejectEntry = () => {
    setMessages(prev => [...prev, {
      id: `reject-${Date.now()}`,
      role: 'assistant',
      content: 'تم إلغاء القيد. يمكنك إعادة إرسال المعاملة مع التعديلات المطلوبة.',
      timestamp: new Date().toISOString()
    }]);
    setShowReviewModal(false);
    setPendingData(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // const navItems = [
  //   { icon: <LayoutDashboard className="w-5 h-5" />, label: 'الرئيسية', path: '/dashboard' },
  //   { icon: <MessageSquare className="w-5 h-5" />, label: 'المحادثة الذكية', path: '/chat', active: true },
  //   { icon: <FileText className="w-5 h-5" />, label: 'القيود المحاسبية', path: '/entries' },
  //   { icon: <BarChart3 className="w-5 h-5" />, label: 'التقارير', path: '/reports' },
  // ];

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex" dir="rtl">    
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">المحادثة الذكية</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 p-4 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">المحاسب الذكي</h2>
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs">
                  <Sparkles className="w-3 h-3 ml-1" />
                  n8n
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                متصل بـ n8n Workflow
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 overflow-scroll" ref={scrollRef}>
          <div className="space-y-4 max-w-3xl ">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.role === 'user' 
                      ? 'bg-slate-200 dark:bg-slate-700' 
                      : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  }`}>
                    {message.role === 'user' 
                      ? <User className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                      : <Bot className="w-5 h-5 text-white" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-2xl px-5 py-4 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-br-none border border-slate-200 dark:border-slate-700'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-bl-none'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((att) => (
                            <div key={att.id} className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
                              {att.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileIcon className="w-4 h-4" />}
                              <span className="text-sm truncate">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 flex-row max-w-[85%]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span className="text-white text-sm">جاري التحليل...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="max-w-3xl mx-auto">
            {selectedFile && (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 mb-3 border border-slate-200 dark:border-slate-700">
                {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-emerald-500" /> : <FileIcon className="w-5 h-5 text-blue-500" />}
                <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt,.xlsx"
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="rounded-xl h-12 w-12"
                title="إرفع صورة أو ملف"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="اكتب رسالة، فاتورة، ملاحظة... أو أرفع ملف"
                className="flex-1 rounded-xl h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl h-12 w-12 p-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              يمكنك إرسال نصوص أو صور أو ملفات (PDF، اكسل، كلمات...)</p>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {showReviewModal && pendingData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-auto border-0 shadow-2xl">
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">مراجعة القيد المحاسبي</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">راجع البيانات قبل الحفظ</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">الوصف</p>
                      <p className="font-medium text-slate-900 dark:text-white">{pendingData.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">المبلغ</p>
                      <p className="font-bold text-emerald-600 text-lg">{pendingData.amount} ريال</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">التصنيف</p>
                      <Badge className="mt-1">{pendingData.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">التاريخ</p>
                      <p className="font-medium text-slate-900 dark:text-white">{pendingData.date}</p>
                    </div>
                  </div>
                </div>

                {pendingData.entries && pendingData.entries.length > 0 && (
                  <div>
                    <p className="font-medium mb-2 text-slate-900 dark:text-white">القيد المحاسبي المقترح:</p>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="text-right py-3 px-4 font-medium">الحساب</th>
                            <th className="text-right py-3 px-4 font-medium">مدين</th>
                            <th className="text-right py-3 px-4 font-medium">دائن</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingData.entries.map((entry, idx) => (
                            <tr key={idx} className="border-t border-slate-100 dark:border-slate-700">
                              <td className="py-3 px-4">{entry.account}</td>
                              <td className="py-3 px-4 text-emerald-600 font-medium">{entry.debit > 0 ? entry.debit : '-'}</td>
                              <td className="py-3 px-4 text-rose-600 font-medium">{entry.credit > 0 ? entry.credit : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-900/20 p-1 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>سيتم إرسال القيد للمراجعة قبل الحفظ النهائي</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl h-12"
                  onClick={handleRejectEntry}
                >
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl h-12"
                  onClick={handleApproveEntry}
                >
                  <CheckCircle className="w-4 h-4 ml-2" />
                  إرسال للمراجعة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Navigation */}
      {/* <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-2 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                item.active ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
}
