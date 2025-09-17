import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Sidebar from '@/components/layout/Sidebar';
import { useCRM } from '@/context/CRMContext';
import { MessageSquare, Search, Filter, Phone, Mail, Calendar, FileText, Loader2 } from 'lucide-react';

const Interactions = () => {
  const { interactions, customers, getCustomers, getAllInteractions, loading } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    getAllInteractions();
    getCustomers();
  }, [getAllInteractions, getCustomers]);

  const filteredInteractions = interactions.filter(interaction => {
    const customer = customers.find(c => c.id === interaction.customerId);
    const matchesSearch = searchQuery === '' || 
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || interaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'note': return FileText;
      default: return MessageSquare;
    }
  };

  if (loading && interactions.length === 0) {
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
            <h1 className="font-heading font-bold text-3xl text-foreground">Interactions</h1>
            <p className="text-muted-foreground text-lg">Track all customer communications</p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search interactions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="call">Calls</SelectItem>
                    <SelectItem value="email">Emails</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="note">Notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>All Interactions ({filteredInteractions.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInteractions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInteractions.map((interaction) => {
                      const customer = customers.find(c => c.id === interaction.customerId);
                      const Icon = getIcon(interaction.type);
                      return (
                        <TableRow key={interaction.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="capitalize">{interaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{customer?.name || 'Unknown'}</TableCell>
                          <TableCell className="max-w-sm truncate">{interaction.note}</TableCell>
                          <TableCell>{new Date(interaction.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No interactions found</h3>
                  <p className="text-muted-foreground">Add interactions via a customer's detail page.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Interactions;