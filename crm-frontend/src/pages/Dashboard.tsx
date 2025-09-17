import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCRM } from '@/context/CRMContext';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import {
  Users, UserPlus, Target, MessageSquare, TrendingUp, Calendar, ArrowRight, Activity, BarChart3, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { dashboardSummary, customers, interactions, getDashboardSummary, getCustomers, getAllInteractions, loading } = useCRM();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardSummary();
    getCustomers();
    // You could also call getAllInteractions() here if you want the "Recent Activity" to be fully populated on first load
  }, [getDashboardSummary, getCustomers]);

  const statsCards = [
    {
      title: 'Total Customers',
      value: dashboardSummary?.totalCustomers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Leads',
      value: dashboardSummary?.totalLeads || 0,
      icon: Target,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Converted',
      value: dashboardSummary?.convertedCustomers || 0,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Follow-ups',
      value: dashboardSummary?.pendingFollowUps || 0,
      icon: MessageSquare,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    }
  ];

  const recentCustomers = customers.slice(0, 5);
  const recentInteractions = interactions.slice(0, 5);

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

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
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <h1 className="font-heading font-bold text-3xl text-foreground">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your business today.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat) => (
              <motion.div key={stat.title} variants={fadeInUp}>
                <Card className="hover-lift border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => navigate('/customers?action=add')} className="bg-gradient-primary hover:shadow-primary justify-start h-12">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Customer
                  </Button>
                  <Button onClick={() => navigate('/interactions')} variant="outline" className="justify-start h-12 border-border">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Interactions
                  </Button>
                  <Button onClick={() => navigate('/reports')} variant="outline" className="justify-start h-12 border-border">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Data */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Customers */}
            <motion.div variants={fadeInUp}>
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Recent Customers</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="text-primary hover:text-primary/80">
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentCustomers.length > 0 ? (
                    recentCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border hover-lift cursor-pointer" onClick={() => navigate(`/customers/${customer.id}`)}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{customer.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.company}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border`}>{customer.status}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No customers yet</p>
                      <Button onClick={() => navigate('/customers?action=add')} variant="ghost" className="mt-2 text-primary">
                        Add your first customer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Interactions */}
            <motion.div variants={fadeInUp}>
               {/* This section can be built out similarly once you decide how to fetch all recent interactions */}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;