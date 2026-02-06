import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  LogOut,
  Bot,
  ChevronRight,
  ChevronDown,
  Folder,
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  TreePine,
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentId?: string;
  balance: number;
  children?: Account[];
}

const defaultAccounts: Account[] = [
  {
    id: '1',
    code: '10',
    name: 'الأصول',
    type: 'asset',
    balance: 50000,
    children: [
      {
        id: '1-1',
        code: '11',
        name: 'الأصول المتداولة',
        type: 'asset',
        parentId: '1',
        balance: 30000,
        children: [
          { id: '1-1-1', code: '111', name: 'النقدية', type: 'asset', parentId: '1-1', balance: 15000 },
          { id: '1-1-2', code: '112', name: 'البنك', type: 'asset', parentId: '1-1', balance: 10000 },
          { id: '1-1-3', code: '113', name: 'العملاء', type: 'asset', parentId: '1-1', balance: 5000 },
        ]
      },
      {
        id: '1-2',
        code: '12',
        name: 'الأصول الثابتة',
        type: 'asset',
        parentId: '1',
        balance: 20000,
        children: [
          { id: '1-2-1', code: '121', name: 'المباني', type: 'asset', parentId: '1-2', balance: 15000 },
          { id: '1-2-2', code: '122', name: 'السيارات', type: 'asset', parentId: '1-2', balance: 5000 },
        ]
      }
    ]
  },
  {
    id: '2',
    code: '20',
    name: 'الخصوم',
    type: 'liability',
    balance: 20000,
    children: [
      { id: '2-1', code: '21', name: 'الموردون', type: 'liability', parentId: '2', balance: 10000 },
      { id: '2-2', code: '22', name: 'القروض', type: 'liability', parentId: '2', balance: 10000 },
    ]
  },
  {
    id: '3',
    code: '30',
    name: 'حقوق الملكية',
    type: 'equity',
    balance: 30000,
    children: [
      { id: '3-1', code: '31', name: 'رأس المال', type: 'equity', parentId: '3', balance: 25000 },
      { id: '3-2', code: '32', name: 'الأرباح المحتجزة', type: 'equity', parentId: '3', balance: 5000 },
    ]
  },
  {
    id: '4',
    code: '40',
    name: 'الإيرادات',
    type: 'income',
    balance: 80000,
    children: [
      { id: '4-1', code: '41', name: 'إيرادات المبيعات', type: 'income', parentId: '4', balance: 60000 },
      { id: '4-2', code: '42', name: 'إيرادات الخدمات', type: 'income', parentId: '4', balance: 20000 },
    ]
  },
  {
    id: '5',
    code: '50',
    name: 'المصروفات',
    type: 'expense',
    balance: 45000,
    children: [
      {
        id: '5-1',
        code: '51',
        name: 'مصروفات التشغيل',
        type: 'expense',
        parentId: '5',
        balance: 30000,
        children: [
          { id: '5-1-1', code: '511', name: 'الكهرباء', type: 'expense', parentId: '5-1', balance: 5000 },
          { id: '5-1-2', code: '512', name: 'الماء', type: 'expense', parentId: '5-1', balance: 2000 },
          { id: '5-1-3', code: '513', name: 'الإنترنت', type: 'expense', parentId: '5-1', balance: 3000 },
          { id: '5-1-4', code: '514', name: 'الاتصالات', type: 'expense', parentId: '5-1', balance: 4000 },
          { id: '5-1-5', code: '515', name: 'الإيجار', type: 'expense', parentId: '5-1', balance: 12000 },
          { id: '5-1-6', code: '516', name: 'الرواتب', type: 'expense', parentId: '5-1', balance: 4000 },
        ]
      },
      {
        id: '5-2',
        code: '52',
        name: 'مصروفات أخرى',
        type: 'expense',
        parentId: '5',
        balance: 15000,
        children: [
          { id: '5-2-1', code: '521', name: 'المواصلات', type: 'expense', parentId: '5-2', balance: 3000 },
          { id: '5-2-2', code: '522', name: 'المطاعم', type: 'expense', parentId: '5-2', balance: 4000 },
          { id: '5-2-3', code: '523', name: 'التسوق', type: 'expense', parentId: '5-2', balance: 5000 },
          { id: '5-2-4', code: '524', name: 'صيانة', type: 'expense', parentId: '5-2', balance: 3000 },
        ]
      }
    ]
  },
];

const getAccountTypeColor = (type: string) => {
  switch (type) {
    case 'asset':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'liability':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
    case 'equity':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'income':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'expense':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
};

const getAccountTypeLabel = (type: string) => {
  switch (type) {
    case 'asset':
      return 'أصل';
    case 'liability':
      return 'خضو';
    case 'equity':
      return 'حقوق ملكية';
    case 'income':
      return 'إيراد';
    case 'expense':
      return 'مصروف';
    default:
      return type;
  }
};

const getAccountTypeIcon = (type: string) => {
  switch (type) {
    case 'asset':
      return <Wallet className="w-4 h-4" />;
    case 'liability':
      return <TrendingDown className="w-4 h-4" />;
    case 'equity':
      return <Building2 className="w-4 h-4" />;
    case 'income':
      return <TrendingUp className="w-4 h-4" />;
    case 'expense':
      return <TrendingDown className="w-4 h-4" />;
    default:
      return <Folder className="w-4 h-4" />;
  }
};

function AccountTreeItem({ 
  account, 
  level = 0, 
  expandedIds, 
  toggleExpand,
  onSelect 
}: { 
  account: Account; 
  level?: number; 
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  onSelect: (account: Account) => void;
}) {
  const isExpanded = expandedIds.has(account.id);
  const hasChildren = account.children && account.children.length > 0;

  return (
    <div>
      <div 
        className={`flex items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
          level > 0 ? 'mr-6' : ''
        }`}
        style={{ paddingRight: `${level * 12 + 12}px` }}
      >
        {hasChildren && (
          <button 
            onClick={(e) => { e.stopPropagation(); toggleExpand(account.id); }}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAccountTypeColor(account.type)}`}>
          {getAccountTypeIcon(account.type)}
        </div>
        
        <div className="flex-1" onClick={() => onSelect(account)}>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-500 dark:text-slate-400">{account.code}</span>
            <span className="font-medium text-slate-900 dark:text-white">{account.name}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className={getAccountTypeColor(account.type)}>
            {getAccountTypeLabel(account.type)}
          </Badge>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {account.balance.toLocaleString('ar-SA')} ر.س
          </span>
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="mt-1">
          {account.children!.map((child) => (
            <AccountTreeItem 
              key={child.id} 
              account={child} 
              level={level + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pendingCount } = useData();
  
  const [accounts] = useState<Account[]>(defaultAccounts);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '5']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showAccountDialog, setShowAccountDialog] = useState(false);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setShowAccountDialog(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Filter accounts based on search
  const filterAccounts = (accounts: Account[]): Account[] => {
    if (!searchQuery) return accounts;
    
    return accounts.filter(account => {
      const matchesSearch = 
        account.name.includes(searchQuery) || 
        account.code.includes(searchQuery);
      
      const hasMatchingChildren = account.children?.some(child => 
        child.name.includes(searchQuery) || 
        child.code.includes(searchQuery)
      );
      
      return matchesSearch || hasMatchingChildren;
    });
  };

  const filteredAccounts = filterAccounts(accounts);

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'الرئيسية', path: '/dashboard' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'المحادثة الذكية', path: '/chat' },
    { icon: <FileText className="w-5 h-5" />, label: 'القيود المحاسبية', path: '/entries' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'التقارير', path: '/reports' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-lg">المحاسب الذكي</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI Accountant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
              <span className="text-slate-700 dark:text-slate-200 font-bold">
                {user?.name?.charAt(0) || 'م'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate">{user?.name || 'مستخدم'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" className="flex-1" onClick={handleLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">شجرة الحسابات</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TreePine className="w-7 h-7 text-emerald-500" />
                شجرة الحسابات
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">إدارة وعرض شجرة الحسابات المحاسبية</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                <Plus className="w-4 h-4 ml-2" />
                حساب جديد
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="البحث في الحسابات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Accounts Tree */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">الحسابات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {filteredAccounts.map((account) => (
                  <AccountTreeItem 
                    key={account.id} 
                    account={account}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                    onSelect={handleSelectAccount}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Account Details Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحساب</DialogTitle>
            <DialogDescription>
              معلومات الحساب والحركات المرتبطة به
            </DialogDescription>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getAccountTypeColor(selectedAccount.type)}`}>
                  {getAccountTypeIcon(selectedAccount.type)}
                </div>
                <div>
                  <p className="font-mono text-sm text-slate-500">{selectedAccount.code}</p>
                  <p className="font-bold text-lg">{selectedAccount.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">النوع</p>
                  <Badge className={getAccountTypeColor(selectedAccount.type)}>
                    {getAccountTypeLabel(selectedAccount.type)}
                  </Badge>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">الرصيد</p>
                  <p className="font-bold text-lg">{selectedAccount.balance.toLocaleString('ar-SA')} ر.س</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Edit2 className="w-4 h-4 ml-2" />
                  تعديل
                </Button>
                <Button variant="outline" className="flex-1 text-rose-600">
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-2 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-slate-500 dark:text-slate-400"
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
