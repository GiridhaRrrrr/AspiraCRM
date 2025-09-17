// AspiraCRM Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer';
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  note: string;
  date: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalCustomers: number;
  totalLeads: number;
  convertedCustomers: number;
  pendingFollowUps: number;
}

// In your types file (e.g., src/types/index.ts)
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean; // <-- Add this line
   updateUser: (userData: { name: string; email: string }) => Promise<boolean>;
}

// In your types file (e.g., src/types/index.ts)
export interface CRMContextType {
  customers: Customer[];
  interactions: Interaction[];
  dashboardSummary: DashboardSummary | null;
  loading: boolean;
  
  getDashboardSummary: () => Promise<void>;
  getCustomers: () => Promise<void>;
  getCustomer: (id: string) => Customer | undefined;
  addCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, customerData: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id:string) => Promise<void>;
  
  getCustomerInteractions: (customerId: string) => Promise<void>;
  addInteraction: (customerId: string, interactionData: Omit<Interaction, 'id' | 'customerId' | 'createdAt'>) => Promise<void>;

  searchCustomers: (query: string) => Customer[];
  filterCustomersByStatus: (status: Customer['status']) => Customer[];
  getAllInteractions: () => Promise<void>;
}