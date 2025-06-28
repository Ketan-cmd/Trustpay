import { createSlice } from '@reduxjs/toolkit';
import { Transaction } from './transactionSlice';

interface OfflineTransaction extends Partial<Transaction> {
  localId: string;
  encrypted: boolean;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

interface OfflineState {
  isOnline: boolean;
  pendingTransactions: OfflineTransaction[];
  lastSyncTime: string | null;
  syncProgress: number;
  smsEnabled: boolean;
  ussdEnabled: boolean;
}

const initialState: OfflineState = {
  isOnline: navigator.onLine,
  pendingTransactions: JSON.parse(localStorage.getItem('pendingTransactions') || '[]'),
  lastSyncTime: localStorage.getItem('lastSyncTime'),
  syncProgress: 0,
  smsEnabled: true,
  ussdEnabled: true,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    addPendingTransaction: (state, action) => {
      const transaction: OfflineTransaction = {
        ...action.payload,
        localId: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        encrypted: true,
        syncStatus: 'pending',
      };
      state.pendingTransactions.push(transaction);
      localStorage.setItem('pendingTransactions', JSON.stringify(state.pendingTransactions));
    },
    updateSyncStatus: (state, action) => {
      const { localId, status } = action.payload;
      const transaction = state.pendingTransactions.find(t => t.localId === localId);
      if (transaction) {
        transaction.syncStatus = status;
        localStorage.setItem('pendingTransactions', JSON.stringify(state.pendingTransactions));
      }
    },
    removeSyncedTransaction: (state, action) => {
      state.pendingTransactions = state.pendingTransactions.filter(
        t => t.localId !== action.payload
      );
      localStorage.setItem('pendingTransactions', JSON.stringify(state.pendingTransactions));
    },
    setSyncProgress: (state, action) => {
      state.syncProgress = action.payload;
    },
    setLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
      localStorage.setItem('lastSyncTime', action.payload);
    },
    toggleSmsEnabled: (state) => {
      state.smsEnabled = !state.smsEnabled;
    },
    toggleUssdEnabled: (state) => {
      state.ussdEnabled = !state.ussdEnabled;
    },
  },
});

export const {
  setOnlineStatus,
  addPendingTransaction,
  updateSyncStatus,
  removeSyncedTransaction,
  setSyncProgress,
  setLastSyncTime,
  toggleSmsEnabled,
  toggleUssdEnabled,
} = offlineSlice.actions;

export default offlineSlice.reducer;