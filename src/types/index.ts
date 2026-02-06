// ==================== User Types ====================
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==================== Transaction Types ====================
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  account: string;
  status: 'pending' | 'approved' | 'rejected';
  source: 'manual' | 'ai_chat' | 'file_upload';
  rawData?: string;
  createdAt: string;
}

export interface TransactionEntry {
  account: string;
  debit: number;
  credit: number;
}

export interface AccountingEntry {
  id: string;
  date: string;
  description: string;
  entries: TransactionEntry[];
  totalDebit: number;
  totalCredit: number;
  status: 'pending' | 'approved';
  source: 'ai' | 'manual';
}

// ==================== AI Chat Types ====================
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  extractedData?: ExtractedTransactionData;
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf';
  name: string;
  url: string;
  size: number;
}

export interface ExtractedTransactionData {
  description?: string;
  amount?: number;
  date?: string;
  vendor?: string;
  category?: string;
  confidence?: number;
  entries?: TransactionEntry[];
}

// ==================== Report Types ====================
export interface ReportFilters {
  startDate: string;
  endDate: string;
  type: 'all' | 'expense' | 'income';
  category?: string;
}

export interface ReportData {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdown[];
  dailyData: DailyDataPoint[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface DailyDataPoint {
  date: string;
  income: number;
  expense: number;
}

// ==================== Dashboard Types ====================
export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  pendingReviewCount: number;
  recentTransactions: Transaction[];
}

// ==================== API Response Types ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==================== App State ====================
export interface AppState {
  transactions: Transaction[];
  accountingEntries: AccountingEntry[];
  chatHistory: ChatMessage[];
  currentUser: User | null;
}
