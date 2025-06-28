import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionAPI } from '../../services/api';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'payment' | 'cashout' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'flagged';
  timestamp: string;
  fromUser: string;
  toUser: string;
  location?: { lat: number; lng: number };
  riskScore: number;
  metadata: Record<string, any>;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  totalVolume: number;
  successRate: number;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  totalVolume: 0,
  successRate: 0,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const response = await transactionAPI.getTransactions();
    return response;
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData: Partial<Transaction>) => {
    const response = await transactionAPI.createTransaction(transactionData);
    return response;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTransactionStatus: (state, action) => {
      const { id, status } = action.payload;
      const transaction = state.transactions.find(t => t.id === id);
      if (transaction) {
        transaction.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.totalVolume = action.payload.totalVolume;
        state.successRate = action.payload.successRate;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      });
  },
});

export const { clearError, updateTransactionStatus } = transactionSlice.actions;
export default transactionSlice.reducer;