import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/layout/Sidebar';
import { useCRM } from '@/context/CRMContext';
import { BarChart3, TrendingUp, Users, Target, Loader2 } from 'lucide-react';

const Reports = () => {
  const { 
    customers, 
    interactions, 
    dashboardSummary, 
    getCustomers, 
    getAllInteractions, 
    getDashboardSummary, 
    loading 
  } = useCRM();

  useEffect(() => {
    getCustomers();
    getAllInteractions();
    getDashboardSummary();
  }, [getCustomers, getAllInteractions, getDashboardSummary]);

  const statusData = [
    { name: 'Leads', value: customers.filter(c => c.status === 'lead').length, color: 'bg-warning' },
    { name: 'Prospects', value: customers.filter(c => c.status === 'prospect').length, color: 'bg-primary' },
    { name: 'Customers', value: customers.filter(c => c.status === 'customer').length, color: 'bg-success' }
  ];

  const interactionTypes = [
    { name: 'Calls', value: interactions.filter(i => i.type === 'call').length },
    { name: 'Emails', value: interactions.filter(i => i.type === 'email').length },
    { name: 'Meetings', value: interactions.filter(i => i.type === 'meeting').length },
    { name: 'Notes', value: interactions.filter(i => i.type === 'note').length }
  ];

  if (loading && !dashboardSummary) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Reports</h1>
            <p className="text-muted-foreground text-lg">Analyze your business performance</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Customer Status Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-2xl font-bold">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Interaction Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {interactionTypes.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-2xl font-bold">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Key Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">{dashboardSummary?.totalCustomers || 0}</div>
                  <div className="text-muted-foreground">Total Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-warning mb-2">{dashboardSummary?.totalLeads || 0}</div>
                  <div className="text-muted-foreground">Active Leads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success mb-2">{dashboardSummary?.convertedCustomers || 0}</div>
                  <div className="text-muted-foreground">Converted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">{interactions.length}</div>
                  <div className="text-muted-foreground">Total Interactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Reports;