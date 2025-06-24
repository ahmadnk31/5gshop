"use client";

import React, { createContext, useReducer, ReactNode } from 'react';
import { Repair, Customer, Part, Quote, DashboardStats, RepairStatus, Priority, CreateRepairData, CreateCustomerData } from './types';
import { DatabaseService } from './database';
import { useContext, useEffect } from 'react';

interface AdminState {
  repairs: Repair[];
  customers: Customer[];
  parts: Part[];
  quotes: Quote[];
  stats: DashboardStats;
  loading: boolean;
  selectedRepair: Repair | null;
}

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: { repairs: Repair[]; customers: Customer[]; parts: Part[]; quotes: Quote[]; stats: DashboardStats } }
  | { type: 'SET_REPAIRS'; payload: Repair[] }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'SET_PARTS'; payload: Part[] }
  | { type: 'SET_QUOTES'; payload: Quote[] }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SELECT_REPAIR'; payload: Repair | null }
  | { type: 'UPDATE_PART_STOCK'; payload: { partId: string; quantity: number } };

const initialState: AdminState = {
  repairs: [],
  customers: [],
  parts: [],
  quotes: [],
  stats: {
    totalRepairs: 0,
    pendingRepairs: 0,
    completedRepairs: 0,
    totalRevenue: 0,
    averageRepairTime: 0,
    customerSatisfaction: 0,
    lowStockParts: 0,
    totalCustomers: 0,
    activeQuotes: 0,
    monthlyRevenue: []
  },
  loading: true,
  selectedRepair: null
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_DATA':
      return {
        ...state,
        repairs: action.payload.repairs,
        customers: action.payload.customers,
        parts: action.payload.parts,
        quotes: action.payload.quotes,
        stats: action.payload.stats,
        loading: false
      };

    case 'SET_REPAIRS':
      return { ...state, repairs: action.payload };

    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };

    case 'SET_PARTS':
      return { ...state, parts: action.payload };

    case 'SET_QUOTES':
      return { ...state, quotes: action.payload };

    case 'SET_STATS':
      return { ...state, stats: action.payload };

    case 'SELECT_REPAIR':
      return { ...state, selectedRepair: action.payload };

    case 'UPDATE_PART_STOCK':
      return {
        ...state,
        parts: state.parts.map(part => 
          part.id === action.payload.partId 
            ? { ...part, inStock: action.payload.quantity }
            : part
        )
      };

    default:
      return state;
  }
}

const AdminContext = createContext<{
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  actions: {
    loadData: () => Promise<void>;
    updateRepairStatus: (repairId: string, status: RepairStatus) => Promise<void>;
    addRepairNote: (repairId: string, note: string) => Promise<void>;
    createRepair: (repair: CreateRepairData) => Promise<void>;
    updateRepair: (repairId: string, repair: Partial<Repair>) => Promise<void>;
    deleteRepair: (repairId: string) => Promise<void>;
    updatePartStock: (partId: string, quantity: number) => Promise<void>;
    addCustomer: (customer: CreateCustomerData) => Promise<Customer>;
    updateQuoteStatus: (quoteId: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
    createPart: (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updatePart: (partId: string, part: Partial<Part>) => Promise<void>;
    deletePart: (partId: string) => Promise<void>;
  };
} | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Helper function to calculate stats from data
  const calculateStats = (repairs: Repair[], customers: Customer[], parts: Part[], quotes: Quote[]): DashboardStats => {
    const totalRepairs = repairs.length;
    const pendingRepairs = repairs.filter(r => r.status === 'PENDING').length;
    const completedRepairs = repairs.filter(r => r.status === 'COMPLETED').length;
    const totalRevenue = repairs.filter(r => r.status === 'COMPLETED').reduce((sum, r) => sum + r.cost, 0);
    const lowStockParts = parts.filter(p => p.inStock <= p.minStock).length;
    const totalCustomers = customers.length;
    const activeQuotes = quotes.filter(q => q.status === 'PENDING' || q.status === 'SENT').length;

    // Calculate average repair time (mock calculation)
    const avgRepairTime = completedRepairs > 0 ? 3.5 : 0;

    // Mock monthly revenue data
    const monthlyRevenue = [
      { month: 'Jan', revenue: Math.floor(totalRevenue * 0.1) },
      { month: 'Feb', revenue: Math.floor(totalRevenue * 0.12) },
      { month: 'Mar', revenue: Math.floor(totalRevenue * 0.15) },
      { month: 'Apr', revenue: Math.floor(totalRevenue * 0.18) },
      { month: 'May', revenue: Math.floor(totalRevenue * 0.22) },
      { month: 'Jun', revenue: Math.floor(totalRevenue * 0.23) },
    ];

    return {
      totalRepairs,
      pendingRepairs,
      completedRepairs,
      totalRevenue,
      averageRepairTime: avgRepairTime,
      customerSatisfaction: 4.8,
      lowStockParts,
      totalCustomers,
      activeQuotes,
      monthlyRevenue
    };
  };

  // Load all data from database
  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [repairsResult, customersResult, partsResult, quotesResult] = await Promise.all([
        DatabaseService.getRepairs(),
        DatabaseService.getCustomers(),
        DatabaseService.getParts(),
        DatabaseService.getQuotes()
      ]);

      // Extract arrays from paginated results if present
      const repairs = repairsResult?.data ?? repairsResult;
      const customers = customersResult?.data ?? customersResult;
      const parts = partsResult?.data ?? partsResult;
      const quotes = quotesResult?.data ?? quotesResult;

      const stats = calculateStats(repairs, customers, parts, quotes);

      dispatch({
        type: 'SET_DATA',
        payload: { repairs, customers, parts, quotes, stats }
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update repair status
  const updateRepairStatus = async (repairId: string, status: RepairStatus) => {
    try {
      const updateData: Partial<Repair> =
        status === 'COMPLETED'
          ? { status, completedAt: new Date().toISOString() }
          : { status };

      await DatabaseService.updateRepair(repairId, updateData);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to update repair status:', error);
    }
  };

  // Add repair note
  const addRepairNote = async (repairId: string, note: string) => {
    try {
      await DatabaseService.addRepairNote(repairId, note);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to add repair note:', error);
    }
  };

  // Create repair
  const createRepair = async (repairData: CreateRepairData) => {
    try {
      await DatabaseService.createRepair(repairData);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to create repair:', error);
    }
  };

  // Update repair
  const updateRepair = async (repairId: string, repairData: Partial<Repair>) => {
    try {
      await DatabaseService.updateRepair(repairId, repairData);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to update repair:', error);
    }
  };

  // Delete repair
  const deleteRepair = async (repairId: string) => {
    try {
      await DatabaseService.deleteRepair(repairId);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to delete repair:', error);
    }
  };

  // Update part stock
  const updatePartStock = async (partId: string, quantity: number) => {
    try {
      await DatabaseService.updatePart(partId, { inStock: quantity });
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to update part stock:', error);
    }
  };

  // Add customer
  const addCustomer = async (customerData: CreateCustomerData): Promise<Customer> => {
    try {
      const customer = await DatabaseService.createCustomer(customerData);
      await loadData(); // Refresh all data
      return customer;
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
  };

  // Update quote status
  const updateQuoteStatus = async (quoteId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await DatabaseService.updateQuote(quoteId, { status });
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to update quote status:', error);
    }
  };

  // Create part
  const createPart = async (partData: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await DatabaseService.createPart(partData);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to create part:', error);
    }
  };

  // Update part
  const updatePart = async (partId: string, partData: Partial<Part>) => {
    try {
      await DatabaseService.updatePart(partId, partData);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to update part:', error);
    }
  };

  // Delete part
  const deletePart = async (partId: string) => {
    try {
      await DatabaseService.deletePart(partId);
      await loadData(); // Refresh all data
    } catch (error) {
      console.error('Failed to delete part:', error);
    }
  };

  const actions = {
    loadData,
    updateRepairStatus,
    addRepairNote,
    createRepair,
    updateRepair,
    deleteRepair,
    updatePartStock,
    addCustomer,
    updateQuoteStatus,
    createPart,
    updatePart,
    deletePart
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
