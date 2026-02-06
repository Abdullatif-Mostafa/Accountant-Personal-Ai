import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { transactionsApi, entriesApi, dashboardApi } from '@/services/api';
import type { Transaction, AccountingEntry, DashboardStats } from '@/types';

interface DataContextType {
  // Data
  transactions: Transaction[];
  accountingEntries: AccountingEntry[];
  dashboardStats: DashboardStats | null;
  pendingCount: number;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  approveEntry: (id: string) => Promise<boolean>;
  rejectEntry: (id: string) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [transactionsRes, entriesRes] = await Promise.all([
        transactionsApi.getAll(),
        entriesApi.getAll()
      ]);
      
      if (transactionsRes.success && transactionsRes.data) {
        setTransactions(transactionsRes.data);
      }
      
      if (entriesRes.success && entriesRes.data) {
        setAccountingEntries(entriesRes.data);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    try {
      const response = await dashboardApi.getStats();
      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    }
  }, []);

  const approveEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await entriesApi.approve(id);
      if (response.success) {
        // Update local state
        setAccountingEntries(prev => 
          prev.map(entry => 
            entry.id === id ? { ...entry, status: 'approved' as const } : entry
          )
        );
        // Also update the corresponding transaction
        const entry = accountingEntries.find(e => e.id === id);
        if (entry) {
          const transaction = transactions.find(t => 
            t.description === entry.description && t.status === 'pending'
          );
          if (transaction) {
            await transactionsApi.updateStatus(transaction.id, 'approved');
            setTransactions(prev =>
              prev.map(t =>
                t.id === transaction.id ? { ...t, status: 'approved' as const } : t
              )
            );
          }
        }
        await refreshDashboard();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error approving entry:', error);
      return false;
    }
  }, [accountingEntries, transactions, refreshDashboard]);

  const rejectEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await entriesApi.reject(id);
      if (response.success) {
        // Remove from local state
        setAccountingEntries(prev => prev.filter(entry => entry.id !== id));
        // Also remove corresponding transaction
        const entry = accountingEntries.find(e => e.id === id);
        if (entry) {
          const transaction = transactions.find(t => 
            t.description === entry.description && t.status === 'pending'
          );
          if (transaction) {
            await transactionsApi.delete(transaction.id);
            setTransactions(prev => prev.filter(t => t.id !== transaction.id));
          }
        }
        await refreshDashboard();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error rejecting entry:', error);
      return false;
    }
  }, [accountingEntries, transactions, refreshDashboard]);

  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await transactionsApi.delete(id);
      if (response.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        await refreshDashboard();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }, [refreshDashboard]);

  // Initial load
  useEffect(() => {
    refreshData();
    refreshDashboard();
  }, [refreshData, refreshDashboard]);

  const pendingCount = accountingEntries.filter(e => e.status === 'pending').length;

  return (
    <DataContext.Provider value={{
      transactions,
      accountingEntries,
      dashboardStats,
      pendingCount,
      isLoading,
      isRefreshing,
      refreshData,
      refreshDashboard,
      approveEntry,
      rejectEntry,
      deleteTransaction
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
