"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Repair, Customer, Part, Quote, DashboardStats, RepairStatus, CreateRepairData, CreateCustomerData } from './types';
import { getDashboardData } from '@/app/actions/dashboard-actions';
import * as repairActions from '@/app/actions/repair-actions';
import * as customerActions from '@/app/actions/customer-actions';
import * as partActions from '@/app/actions/part-actions';
import * as quoteActions from '@/app/actions/quote-actions';

interface AdminState {
  repairs: Repair[];
  customers: Customer[];
  parts: Part[];
  quotes: Quote[];
  stats: DashboardStats;
  loading: boolean;
  selectedRepair: Repair | null;
  operationLoading: { [key: string]: boolean };
}

interface AdminContextType {
  state: AdminState;
  actions: {
    loadData: () => Promise<void>;
    updateRepairStatus: (repairId: string, status: RepairStatus) => Promise<void>;
    addRepairNote: (repairId: string, note: string) => Promise<void>;
    createRepair: (repair: CreateRepairData) => Promise<void>;
    updateRepair: (repairId: string, repair: Partial<Repair>) => Promise<void>;
    deleteRepair: (repairId: string) => Promise<void>;
    updatePartStock: (partId: string, quantity: number, operation?: 'add' | 'subtract' | 'set') => Promise<void>;
    addCustomer: (customer: CreateCustomerData) => Promise<Customer>;
    updateCustomer: (customer: Customer) => Promise<void>;
    updateQuoteStatus: (quoteId: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
    createPart: (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updatePart: (partId: string, part: Partial<Part>) => Promise<void>;
    deletePart: (partId: string) => Promise<void>;
    setSelectedRepair: (repair: Repair | null) => void;
  };
}

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
    monthlyRevenue: [],
  },
  loading: true,
  selectedRepair: null,
  operationLoading: {},
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(initialState);

  // Helper functions for operation loading states
  const setOperationLoading = (operation: string, loading: boolean) => {
    setState(prev => ({
      ...prev,
      operationLoading: {
        ...prev.operationLoading,
        [operation]: loading
      }
    }));
  };

  // Load all dashboard data
  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const data = await getDashboardData();
      setState(prev => ({
        ...prev,
        repairs: data.repairs,
        customers: data.customers,
        parts: data.parts,
        quotes: data.quotes,
        stats: data.stats,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Repair actions
  const updateRepairStatus = async (repairId: string, status: RepairStatus) => {
    try {
      await repairActions.updateRepairStatus(repairId, status);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to update repair status:', error);
      throw error;
    }
  };

  const addRepairNote = async (repairId: string, note: string) => {
    try {
      await repairActions.addRepairNote(repairId, note);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to add repair note:', error);
      throw error;
    }
  };

  const createRepair = async (repair: CreateRepairData) => {
    try {
      setOperationLoading('create-repair', true);
      await repairActions.createRepair(repair);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to create repair:', error);
      throw error;
    } finally {
      setOperationLoading('create-repair', false);
    }
  };

  const updateRepair = async (repairId: string, repair: Partial<Repair>) => {
    const operationKey = `update-repair-${repairId}`;
    try {
      setOperationLoading(operationKey, true);
      await repairActions.updateRepair(repairId, repair);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to update repair:', error);
      throw error;
    } finally {
      setOperationLoading(operationKey, false);
    }
  };

  const deleteRepair = async (repairId: string) => {
    const operationKey = `delete-repair-${repairId}`;
    try {
      setOperationLoading(operationKey, true);
      await repairActions.deleteRepair(repairId);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to delete repair:', error);
      throw error;
    } finally {
      setOperationLoading(operationKey, false);
    }
  };

  // Part actions
  const updatePartStock = async (partId: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set') => {
    try {
      await partActions.updatePartStock(partId, quantity, operation);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to update part stock:', error);
      throw error;
    }
  };

  const createPart = async (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setOperationLoading('create-part', true);
      await partActions.createPart(part);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to create part:', error);
      throw error;
    } finally {
      setOperationLoading('create-part', false);
    }
  };

  const updatePart = async (partId: string, part: Partial<Part>) => {
    const operationKey = `update-part-${partId}`;
    try {
      setOperationLoading(operationKey, true);
      await partActions.updatePart(partId, part);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to update part:', error);
      throw error;
    } finally {
      setOperationLoading(operationKey, false);
    }
  };

  const deletePart = async (partId: string) => {
    const operationKey = `delete-part-${partId}`;
    try {
      setOperationLoading(operationKey, true);
      await partActions.deletePart(partId);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to delete part:', error);
      throw error;
    } finally {
      setOperationLoading(operationKey, false);
    }
  };

  // Customer actions
  const addCustomer = async (customer: CreateCustomerData): Promise<Customer> => {
    try {
      setOperationLoading('create-customer', true);
      const newCustomer = await customerActions.createCustomer(customer);
      await loadData(); // Reload data
      return newCustomer;
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    } finally {
      setOperationLoading('create-customer', false);
    }
  };

  const updateCustomer = async (customer: Customer) => {
    const operationKey = `update-customer-${customer.id}`;
    try {
      setOperationLoading(operationKey, true);
      await customerActions.updateCustomer(customer.id, customer);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    } finally {
      setOperationLoading(operationKey, false);
    }
  };

  // Quote actions
  const updateQuoteStatus = async (quoteId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await quoteActions.updateQuoteStatus(quoteId, status);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to update quote status:', error);
      throw error;
    }
  };

  // UI actions
  const setSelectedRepair = (repair: Repair | null) => {
    setState(prev => ({ ...prev, selectedRepair: repair }));
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const contextValue: AdminContextType = {
    state,
    actions: {
      loadData,
      updateRepairStatus,
      addRepairNote,
      createRepair,
      updateRepair,
      deleteRepair,
      updatePartStock,
      addCustomer,
      updateCustomer,
      updateQuoteStatus,
      createPart,
      updatePart,
      deletePart,
      setSelectedRepair,
    },
  };

  return (
    <AdminContext.Provider value={contextValue}>
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
