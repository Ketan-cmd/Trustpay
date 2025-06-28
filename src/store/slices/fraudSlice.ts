import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fraudAPI } from '../../services/api';

interface FraudAlert {
  id: string;
  transactionId: string;
  type: 'velocity' | 'location' | 'amount' | 'pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  metadata: Record<string, any>;
}

interface FraudState {
  alerts: FraudAlert[];
  loading: boolean;
  error: string | null;
  riskScore: number;
  blockedTransactions: number;
  totalSaved: number;
}

const initialState: FraudState = {
  alerts: [],
  loading: false,
  error: null,
  riskScore: 0,
  blockedTransactions: 0,
  totalSaved: 0,
};

export const fetchFraudAlerts = createAsyncThunk(
  'fraud/fetchAlerts',
  async () => {
    const response = await fraudAPI.getAlerts();
    return response;
  }
);

export const analyzeTransaction = createAsyncThunk(
  'fraud/analyzeTransaction',
  async (transactionId: string) => {
    const response = await fraudAPI.analyzeTransaction(transactionId);
    return response;
  }
);

const fraudSlice = createSlice({
  name: 'fraud',
  initialState,
  reducers: {
    updateAlertStatus: (state, action) => {
      const { id, status } = action.payload;
      const alert = state.alerts.find(a => a.id === id);
      if (alert) {
        alert.status = status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFraudAlerts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFraudAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload.alerts;
        state.riskScore = action.payload.riskScore;
        state.blockedTransactions = action.payload.blockedTransactions;
        state.totalSaved = action.payload.totalSaved;
      })
      .addCase(fetchFraudAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch fraud alerts';
      })
      .addCase(analyzeTransaction.fulfilled, (state, action) => {
        if (action.payload.alert) {
          state.alerts.unshift(action.payload.alert);
        }
      });
  },
});

export const { updateAlertStatus, clearError } = fraudSlice.actions;
export default fraudSlice.reducer;