import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api'; 
import { CRMContextType, Customer, Interaction, DashboardSummary } from '@/types';

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

interface CRMProviderProps {
  children: React.ReactNode;
}

export const CRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const getDashboardSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/summary');
      setDashboardSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
    // --> FIX: Dependency array must be empty to prevent infinite loops.
  }, []);

  const getAllInteractions = useCallback(async () => {
    setLoading(true);
    try {
      const customersResponse = await api.get('/customers');
      const allCustomers: Customer[] = customersResponse.data;
      const interactionPromises = allCustomers.map(customer =>
        api.get(`/customers/${customer.id}/interactions`)
      );
      const interactionResults = await Promise.all(interactionPromises);
      const allInteractions = interactionResults.flatMap(response => response.data);
      setInteractions(allInteractions);
    } catch (error) {
      console.error('Failed to fetch all interactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await api.post('/customers', customerData);
      await getCustomers();
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
    // --> FIX: Add getCustomers as a dependency.
  }, [getCustomers]);

  const updateCustomer = useCallback(async (id: string, customerData: Partial<Customer>) => {
    try {
      await api.put(`/customers/${id}`, customerData);
      await getCustomers();
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  }, [getCustomers]);

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      await api.delete(`/customers/${id}`);
      await getCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  }, [getCustomers]);

  // --> FIX: Wrap synchronous functions that are used in useEffect dependencies in useCallback as well.
  const getCustomer = useCallback((id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id);
  }, [customers]);

  const getCustomerInteractions = useCallback(async (customerId: string) => {
    setLoading(true);
    try {
        const response = await api.get(`/customers/${customerId}/interactions`);
        setInteractions(response.data);
    } catch (error) {
        console.error('Failed to get interactions:', error);
        setInteractions([]);
    } finally {
        setLoading(false);
    }
  }, []);

  const addInteraction = useCallback(async (customerId: string, interactionData: Omit<Interaction, 'id' | 'customerId' | 'createdAt'>) => {
    try {
        await api.post(`/customers/${customerId}/interactions`, interactionData);
        await getCustomerInteractions(customerId);
    } catch (error) {
        console.error('Failed to add interaction:', error);
        throw error;
    }
    // --> FIX: Add getCustomerInteractions as a dependency.
  }, [getCustomerInteractions]);

  const searchCustomers = useCallback((query: string): Customer[] => {
    if (!query.trim()) return customers;
    const lowercaseQuery = query.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.email.toLowerCase().includes(lowercaseQuery) ||
      customer.company.toLowerCase().includes(lowercaseQuery)
    );
  }, [customers]);
  
  const filterCustomersByStatus = useCallback((status: Customer['status']): Customer[] => {
    return customers.filter(customer => customer.status === status);
  }, [customers]);

  const value: CRMContextType = {
    customers,
    interactions,
    dashboardSummary,
    loading,
    getDashboardSummary,
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    addInteraction,
    getCustomerInteractions,
    searchCustomers,
    filterCustomersByStatus,
    getAllInteractions,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
};