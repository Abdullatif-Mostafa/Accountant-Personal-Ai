import type { 
  User, 
  Transaction, 
  AccountingEntry, 
  ChatMessage, 
  ReportData, 
  ReportFilters,
  ExtractedTransactionData,
  ApiResponse,
  DashboardStats
} from '@/types';

// ==================== Mock Database (In-Memory) ====================
// This simulates a backend database - will be replaced with real API calls
class MockDatabase {
  private users: User[] = [
    {
      id: '1',
      email: 'demo@example.com',
      name: 'مستخدم تجريبي',
      createdAt: new Date().toISOString()
    }
  ];
  
  private transactions: Transaction[] = [
    {
      id: 't1',
      date: '2025-02-01',
      description: 'فاتورة كهرباء',
      amount: 250,
      type: 'expense',
      category: 'خدمات',
      account: 'البنك',
      status: 'approved',
      source: 'ai_chat',
      createdAt: new Date().toISOString()
    },
    {
      id: 't2',
      date: '2025-02-02',
      description: 'إيراد مبيعات',
      amount: 1500,
      type: 'income',
      category: 'مبيعات',
      account: 'الصندوق',
      status: 'approved',
      source: 'manual',
      createdAt: new Date().toISOString()
    },
    {
      id: 't3',
      date: '2025-02-03',
      description: 'فاتورة انترنت',
      amount: 200,
      type: 'expense',
      category: 'اتصالات',
      account: 'البنك',
      status: 'pending',
      source: 'ai_chat',
      createdAt: new Date().toISOString()
    }
  ];
  
  private accountingEntries: AccountingEntry[] = [
    {
      id: 'ae1',
      date: '2025-02-01',
      description: 'فاتورة كهرباء',
      entries: [
        { account: 'مصروفات الكهرباء', debit: 250, credit: 0 },
        { account: 'البنك', debit: 0, credit: 250 }
      ],
      totalDebit: 250,
      totalCredit: 250,
      status: 'approved',
      source: 'ai'
    },
    {
      id: 'ae2',
      date: '2025-02-02',
      description: 'إيراد مبيعات',
      entries: [
        { account: 'الصندوق', debit: 1500, credit: 0 },
        { account: 'إيرادات المبيعات', debit: 0, credit: 1500 }
      ],
      totalDebit: 1500,
      totalCredit: 1500,
      status: 'approved',
      source: 'ai'
    },
    {
      id: 'ae3',
      date: '2025-02-03',
      description: 'فاتورة انترنت',
      entries: [
        { account: 'مصروفات الاتصالات', debit: 200, credit: 0 },
        { account: 'البنك', debit: 0, credit: 200 }
      ],
      totalDebit: 200,
      totalCredit: 200,
      status: 'pending',
      source: 'ai'
    }
  ];
  
  private chatHistory: ChatMessage[] = [];
  
  // Getters
  getUsers() { return this.users; }
  getTransactions() { return this.transactions; }
  getAccountingEntries() { return this.accountingEntries; }
  getChatHistory() { return this.chatHistory; }
  
  // Setters
  addTransaction(transaction: Transaction) {
    this.transactions.unshift(transaction);
    return transaction;
  }
  
  addAccountingEntry(entry: AccountingEntry) {
    this.accountingEntries.unshift(entry);
    return entry;
  }
  
  updateTransactionStatus(id: string, status: Transaction['status']) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index].status = status;
      return this.transactions[index];
    }
    return null;
  }
  
  updateEntryStatus(id: string, status: AccountingEntry['status']) {
    const index = this.accountingEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      this.accountingEntries[index].status = status;
      return this.accountingEntries[index];
    }
    return null;
  }
  
  addChatMessage(message: ChatMessage) {
    this.chatHistory.push(message);
    return message;
  }
  
  deleteTransaction(id: string) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      return this.transactions.splice(index, 1)[0];
    }
    return null;
  }
  
  deleteEntry(id: string) {
    const index = this.accountingEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      return this.accountingEntries.splice(index, 1)[0];
    }
    return null;
  }
}

// Singleton instance
const db = new MockDatabase();

// ==================== API Service ====================

// ----- Authentication API -----
export const authApi = {
  login: async (email: string, _password: string): Promise<ApiResponse<User>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = db.getUsers().find(u => u.email === email);
    if (user) {
      return { success: true, data: user, message: 'تم تسجيل الدخول بنجاح' };
    }
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  },
  
  register: async (email: string, _password: string, name: string): Promise<ApiResponse<User>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = db.getUsers().find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString()
    };
    
    db.getUsers().push(newUser);
    return { success: true, data: newUser, message: 'تم إنشاء الحساب بنجاح' };
  },
  
  logout: async (): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: 'تم تسجيل الخروج بنجاح' };
  }
};

// ----- Transactions API -----
export const transactionsApi = {
  getAll: async (): Promise<ApiResponse<Transaction[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: db.getTransactions() };
  },
  
  getById: async (id: string): Promise<ApiResponse<Transaction>> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const transaction = db.getTransactions().find(t => t.id === id);
    if (transaction) {
      return { success: true, data: transaction };
    }
    return { success: false, error: 'المعاملة غير موجودة' };
  },
  
  getPending: async (): Promise<ApiResponse<Transaction[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const pending = db.getTransactions().filter(t => t.status === 'pending');
    return { success: true, data: pending };
  },
  
  create: async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<ApiResponse<Transaction>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTransaction: Transaction = {
      ...transaction,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    db.addTransaction(newTransaction);
    return { success: true, data: newTransaction, message: 'تم إنشاء المعاملة بنجاح' };
  },
  
  updateStatus: async (id: string, status: Transaction['status']): Promise<ApiResponse<Transaction>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const updated = db.updateTransactionStatus(id, status);
    if (updated) {
      return { success: true, data: updated, message: 'تم تحديث الحالة بنجاح' };
    }
    return { success: false, error: 'المعاملة غير موجودة' };
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const deleted = db.deleteTransaction(id);
    if (deleted) {
      return { success: true, message: 'تم حذف المعاملة بنجاح' };
    }
    return { success: false, error: 'المعاملة غير موجودة' };
  }
};

// ----- Accounting Entries API -----
export const entriesApi = {
  getAll: async (): Promise<ApiResponse<AccountingEntry[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: db.getAccountingEntries() };
  },
  
  getPending: async (): Promise<ApiResponse<AccountingEntry[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const pending = db.getAccountingEntries().filter(e => e.status === 'pending');
    return { success: true, data: pending };
  },
  
  create: async (entry: Omit<AccountingEntry, 'id'>): Promise<ApiResponse<AccountingEntry>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newEntry: AccountingEntry = {
      ...entry,
      id: `ae${Date.now()}`
    };
    
    db.addAccountingEntry(newEntry);
    return { success: true, data: newEntry, message: 'تم إنشاء القيد بنجاح' };
  },
  
  approve: async (id: string): Promise<ApiResponse<AccountingEntry>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const updated = db.updateEntryStatus(id, 'approved');
    if (updated) {
      return { success: true, data: updated, message: 'تم اعتماد القيد بنجاح' };
    }
    return { success: false, error: 'القيد غير موجود' };
  },
  
  reject: async (id: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const deleted = db.deleteEntry(id);
    if (deleted) {
      return { success: true, message: 'تم رفض وحذف القيد' };
    }
    return { success: false, error: 'القيد غير موجود' };
  }
};

// ----- AI Chat API -----
export const aiChatApi = {
  sendMessage: async (content: string, _attachments?: File[]): Promise<ApiResponse<ChatMessage>> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing
    
    // Simulate AI response based on message content
    let aiResponse: ChatMessage;
    let extractedData: ExtractedTransactionData | undefined;
    
    // Check if message contains transaction-like content
    const amountMatch = content.match(/(\d+(?:\.\d+)?)\s*(ريال|ر.س|SAR)?/);
    const hasExpenseKeywords = /(دفعت|اشتريت|فاتورة|مصروف|شراء)/i.test(content);
    const hasIncomeKeywords = /(استلمت|تحصيل|إيراد|مبيعات)/i.test(content);
    
    if (amountMatch && (hasExpenseKeywords || hasIncomeKeywords)) {
      const amount = parseFloat(amountMatch[1]);
      const isExpense = hasExpenseKeywords;
      
      // Determine category based on keywords
      let category = 'عام';
      if (/كهرباء/i.test(content)) category = 'خدمات';
      else if (/انترنت|اتصالات|STC|موبايلي/i.test(content)) category = 'اتصالات';
      else if (/بنزين|مواصلات/i.test(content)) category = 'مواصلات';
      else if (/مطعم|أكل|طعام/i.test(content)) category = 'مطاعم';
      else if (/مبيعات|إيراد/i.test(content)) category = 'مبيعات';
      
      extractedData = {
        description: content,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        category: category,
        confidence: 0.85,
        entries: isExpense ? [
          { account: `مصروفات ${category}`, debit: amount, credit: 0 },
          { account: 'البنك', debit: 0, credit: amount }
        ] : [
          { account: 'الصندوق', debit: amount, credit: 0 },
          { account: `إيرادات ${category}`, debit: 0, credit: amount }
        ]
      };
      
      aiResponse = {
        id: `ai${Date.now()}`,
        role: 'assistant',
        content: `تم استخراج البيانات التالية:\n\n📋 **الوصف:** ${content}\n💰 **المبلغ:** ${amount} ريال\n📂 **التصنيف:** ${category}\n📅 **التاريخ:** ${new Date().toLocaleDateString('ar-SA')}\n\nهل تريد مراجعة القيد المحاسبي قبل الحفظ؟`,
        timestamp: new Date().toISOString(),
        extractedData
      };
    } else {
      aiResponse = {
        id: `ai${Date.now()}`,
        role: 'assistant',
        content: 'مرحباً! أنا مساعدك المحاسبي الذكي. يمكنك إرسال لي:\n\n📝 نص مثل: "دفعت 250 ريال فاتورة كهرباء"\n📸 صورة فاتورة\n📄 ملف PDF\n\nوسأساعدك في تحويلها إلى قيود محاسبية منظمة.',
        timestamp: new Date().toISOString()
      };
    }
    
    db.addChatMessage({
      id: `user${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    });
    
    db.addChatMessage(aiResponse);
    return { success: true, data: aiResponse };
  },
  
  uploadFile: async (file: File): Promise<ApiResponse<ChatMessage>> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate file processing
    
    // Simulate extracted data from file
    const extractedData: ExtractedTransactionData = {
      description: `فاتورة ${file.name.split('.')[0]}`,
      amount: Math.floor(Math.random() * 500) + 100,
      date: new Date().toISOString().split('T')[0],
      vendor: 'شركة تجريبية',
      category: 'خدمات',
      confidence: 0.92,
      entries: [
        { account: 'مصروفات الخدمات', debit: 300, credit: 0 },
        { account: 'البنك', debit: 0, credit: 300 }
      ]
    };
    
    const aiResponse: ChatMessage = {
      id: `ai${Date.now()}`,
      role: 'assistant',
      content: `✅ تم معالجة الملف: **${file.name}**\n\n📋 **الوصف:** ${extractedData.description}\n🏢 **البائع:** ${extractedData.vendor}\n💰 **المبلغ:** ${extractedData.amount} ريال\n📂 **التصنيف:** ${extractedData.category}\n📅 **التاريخ:** ${new Date().toLocaleDateString('ar-SA')}\n\nهل تريد مراجعة القيد المحاسبي قبل الحفظ؟`,
      timestamp: new Date().toISOString(),
      attachments: [{
        id: `att${Date.now()}`,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      }],
      extractedData
    };
    
    db.addChatMessage(aiResponse);
    return { success: true, data: aiResponse };
  },
  
  getHistory: async (): Promise<ApiResponse<ChatMessage[]>> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true, data: db.getChatHistory() };
  },
  
  clearHistory: async (): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    db.getChatHistory().length = 0;
    return { success: true, message: 'تم مسح المحادثة' };
  }
};

// ----- Reports API -----
export const reportsApi = {
  generate: async (filters: ReportFilters): Promise<ApiResponse<ReportData>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const transactions = db.getTransactions().filter(t => {
      const tDate = new Date(t.date);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      const dateMatch = tDate >= startDate && tDate <= endDate;
      const typeMatch = filters.type === 'all' || t.type === filters.type;
      const categoryMatch = !filters.category || t.category === filters.category;
      
      return dateMatch && typeMatch && categoryMatch && t.status === 'approved';
    });
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate category breakdown
    const categoryMap = new Map<string, { amount: number; count: number }>();
    transactions.forEach(t => {
      const existing = categoryMap.get(t.category);
      if (existing) {
        existing.amount += t.amount;
        existing.count += 1;
      } else {
        categoryMap.set(t.category, { amount: t.amount, count: 1 });
      }
    });
    
    const totalAmount = totalIncome + totalExpense;
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
      count: data.count
    })).sort((a, b) => b.amount - a.amount);
    
    // Generate daily data
    const dailyMap = new Map<string, { income: number; expense: number }>();
    transactions.forEach(t => {
      const existing = dailyMap.get(t.date);
      if (existing) {
        if (t.type === 'income') existing.income += t.amount;
        else existing.expense += t.amount;
      } else {
        dailyMap.set(t.date, {
          income: t.type === 'income' ? t.amount : 0,
          expense: t.type === 'expense' ? t.amount : 0
        });
      }
    });
    
    const dailyData = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netAmount: totalIncome - totalExpense,
        transactionCount: transactions.length,
        categoryBreakdown,
        dailyData
      }
    };
  }
};

// ----- Dashboard API -----
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const transactions = db.getTransactions();
    const approvedTransactions = transactions.filter(t => t.status === 'approved');
    
    const totalIncome = approvedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = approvedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingReviewCount = transactions.filter(t => t.status === 'pending').length;
    
    return {
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        transactionCount: approvedTransactions.length,
        pendingReviewCount,
        recentTransactions: transactions.slice(0, 5)
      }
    };
  }
};

// ==================== Webhook Ready Functions ====================
// These functions are ready to be connected to n8n webhooks

export const webhookApi = {
  // Send transaction to n8n for AI processing
  sendToAI: async (data: { message?: string; fileUrl?: string }): Promise<ApiResponse<any>> => {
    // TODO: Replace with actual n8n webhook URL
    // const response = await fetch('https://n8n.your-domain.com/webhook/ai-process', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
    
    // For now, use mock AI
    return aiChatApi.sendMessage(data.message || '');
  },
  
  // Save to Google Sheets
  saveToSheets: async (entry: AccountingEntry): Promise<ApiResponse<any>> => {
    // TODO: Replace with actual Google Sheets webhook
    // const response = await fetch('https://n8n.your-domain.com/webhook/save-to-sheets', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry)
    // });
    // return response.json();
    
    console.log('Saving to Google Sheets:', entry);
    return { success: true, message: 'تم الإرسال إلى Google Sheets' };
  }
};

export default {
  auth: authApi,
  transactions: transactionsApi,
  entries: entriesApi,
  aiChat: aiChatApi,
  reports: reportsApi,
  dashboard: dashboardApi,
  webhook: webhookApi
};
