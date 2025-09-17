// Mock data for AspiraCRM

import { Customer, Interaction, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    createdAt: '2025-01-02T00:00:00Z'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Alice Johnson',
    email: 'alice@techcorp.com',
    phone: '+1-555-0101',
    company: 'TechCorp Inc.',
    status: 'lead',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-16T14:30:00Z'
  },
  {
    id: 'c2',
    name: 'Bob Wilson',
    email: 'bob@startup.io',
    phone: '+1-555-0102',
    company: 'Startup.io',
    status: 'customer',
    createdAt: '2025-01-10T09:15:00Z',
    updatedAt: '2025-01-17T11:20:00Z'
  },
  {
    id: 'c3',
    name: 'Carol Martinez',
    email: 'carol@enterprise.com',
    phone: '+1-555-0103',
    company: 'Enterprise Solutions',
    status: 'prospect',
    createdAt: '2025-01-12T16:45:00Z',
    updatedAt: '2025-01-17T09:10:00Z'
  },
  {
    id: 'c4',
    name: 'David Chen',
    email: 'david@innovate.co',
    phone: '+1-555-0104',
    company: 'Innovate Co.',
    status: 'lead',
    createdAt: '2025-01-14T13:20:00Z',
    updatedAt: '2025-01-16T15:45:00Z'
  },
  {
    id: 'c5',
    name: 'Emma Thompson',
    email: 'emma@growthlab.com',
    phone: '+1-555-0105',
    company: 'Growth Lab',
    status: 'customer',
    createdAt: '2025-01-08T11:30:00Z',
    updatedAt: '2025-01-17T10:15:00Z'
  },
  {
    id: 'c6',
    name: 'Frank Rodriguez',
    email: 'frank@scaleme.net',
    phone: '+1-555-0106',
    company: 'ScaleMe Networks',
    status: 'prospect',
    createdAt: '2025-01-11T14:00:00Z',
    updatedAt: '2025-01-16T12:30:00Z'
  },
  {
    id: 'c7',
    name: 'Grace Kim',
    email: 'grace@futuretech.ai',
    phone: '+1-555-0107',
    company: 'FutureTech AI',
    status: 'lead',
    createdAt: '2025-01-13T08:45:00Z',
    updatedAt: '2025-01-17T13:20:00Z'
  },
  {
    id: 'c8',
    name: 'Henry Baker',
    email: 'henry@cloudways.com',
    phone: '+1-555-0108',
    company: 'CloudWays',
    status: 'customer',
    createdAt: '2025-01-09T15:20:00Z',
    updatedAt: '2025-01-16T16:40:00Z'
  }
];

export const mockInteractions: Interaction[] = [
  {
    id: 'i1',
    customerId: 'c1',
    type: 'email',
    note: 'Sent initial proposal and pricing information',
    date: '2025-01-16',
    createdAt: '2025-01-16T14:30:00Z'
  },
  {
    id: 'i2',
    customerId: 'c1',
    type: 'call',
    note: 'Follow-up call to discuss requirements',
    date: '2025-01-17',
    createdAt: '2025-01-17T10:15:00Z'
  },
  {
    id: 'i3',
    customerId: 'c2',
    type: 'meeting',
    note: 'Product demo and contract signing',
    date: '2025-01-17',
    createdAt: '2025-01-17T11:20:00Z'
  },
  {
    id: 'i4',
    customerId: 'c3',
    type: 'email',
    note: 'Shared case studies and success stories',
    date: '2025-01-17',
    createdAt: '2025-01-17T09:10:00Z'
  },
  {
    id: 'i5',
    customerId: 'c4',
    type: 'call',
    note: 'Initial discovery call completed',
    date: '2025-01-16',
    createdAt: '2025-01-16T15:45:00Z'
  },
  {
    id: 'i6',
    customerId: 'c5',
    type: 'meeting',
    note: 'Quarterly business review',
    date: '2025-01-17',
    createdAt: '2025-01-17T10:15:00Z'
  },
  {
    id: 'i7',
    customerId: 'c6',
    type: 'note',
    note: 'Interested in enterprise package, needs budget approval',
    date: '2025-01-16',
    createdAt: '2025-01-16T12:30:00Z'
  },
  {
    id: 'i8',
    customerId: 'c7',
    type: 'email',
    note: 'Requested technical specifications',
    date: '2025-01-17',
    createdAt: '2025-01-17T13:20:00Z'
  },
  {
    id: 'i9',
    customerId: 'c8',
    type: 'call',
    note: 'Support call for onboarding questions',
    date: '2025-01-16',
    createdAt: '2025-01-16T16:40:00Z'
  }
];