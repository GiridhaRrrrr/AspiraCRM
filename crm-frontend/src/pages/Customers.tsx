import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Sidebar from '@/components/layout/Sidebar';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types';
import {
  Users, Plus, Search, Filter, Edit, Trash2, Mail, Phone, Building, Eye, Loader2
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Customers = () => {
  const { customers, getCustomers, addCustomer, updateCustomer, deleteCustomer, searchCustomers, loading } = useCRM();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', status: 'lead' as Customer['status']
  });

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = customers;
    if (searchQuery.trim()) {
      filtered = searchCustomers(searchQuery);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    setDisplayedCustomers(filtered);
  }, [searchQuery, statusFilter, customers, searchCustomers]);

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '', status: 'lead' });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.email) {
      toast({ title: "Missing Information", description: "Please fill in name and email fields.", variant: "destructive" });
      return;
    }
    try {
      await addCustomer(formData);
      toast({ title: "Customer Added", description: `${formData.name} has been added successfully.` });
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add customer.", variant: "destructive" });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company,
      status: customer.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCustomer) return;
    if (!formData.name || !formData.email) {
      toast({ title: "Missing Information", description: "Please fill in name and email fields.", variant: "destructive" });
      return;
    }
    try {
      await updateCustomer(editingCustomer.id, formData);
      toast({ title: "Customer Updated", description: `${formData.name} has been updated successfully.` });
      resetForm();
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update customer.", variant: "destructive" });
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
      try {
        await deleteCustomer(customer.id);
        toast({ title: "Customer Deleted", description: `${customer.name} has been deleted.` });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete customer.", variant: "destructive" });
      }
    }
  };

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'lead': return 'bg-warning/10 text-warning-foreground border-warning/20';
      case 'prospect': return 'bg-primary/10 text-primary-foreground border-primary/20';
      case 'customer': return 'bg-success/10 text-success-foreground border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  if (loading && customers.length === 0) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }} className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground">Customers</h1>
              <p className="text-muted-foreground text-lg">Manage your customer relationships.</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) resetForm(); setIsAddDialogOpen(isOpen); }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:shadow-primary"><Plus className="h-4 w-4 mr-2" />Add Customer</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Fill in the details below. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" /></div>
                  <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1-555-0123" /></div>
                  <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Company Name" /></div>
                  <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={formData.status} onValueChange={(value: Customer['status']) => setFormData({ ...formData, status: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="lead">Lead</SelectItem><SelectItem value="prospect">Prospect</SelectItem><SelectItem value="customer">Customer</SelectItem></SelectContent></Select></div>
                  <div className="flex space-x-2 pt-4"><Button onClick={handleAdd} className="flex-1 bg-gradient-primary">Add Customer</Button><Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button></div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeInUp}>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <div className="sm:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="lead">Leads</SelectItem>
                        <SelectItem value="prospect">Prospects</SelectItem>
                        <SelectItem value="customer">Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customers Table */}
          <motion.div variants={fadeInUp}>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Users className="h-5 w-5 text-primary" /><span>Customer List ({displayedCustomers.length})</span></CardTitle>
              </CardHeader>
              <CardContent>
                {displayedCustomers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Added</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedCustomers.map((customer) => (
                          <TableRow key={customer.id} className="hover:bg-muted/50">
                            <TableCell><div className="font-medium">{customer.name}</div></TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.company}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>{customer.status}</span>
                            </TableCell>
                            <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/${customer.id}`)} className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)} className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(customer)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No customers found</h3>
                    <p className="text-muted-foreground mb-4">{searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first customer.'}</p>
                    {!searchQuery && (
                      <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary"><Plus className="h-4 w-4 mr-2" />Add Customer</Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) resetForm(); setIsEditDialogOpen(isOpen); }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label htmlFor="edit-name">Name *</Label><Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="edit-email">Email *</Label><Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="edit-phone">Phone</Label><Input id="edit-phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="edit-company">Company</Label><Input id="edit-company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="edit-status">Status</Label><Select value={formData.status} onValueChange={(value: Customer['status']) => setFormData({ ...formData, status: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="lead">Lead</SelectItem><SelectItem value="prospect">Prospect</SelectItem><SelectItem value="customer">Customer</SelectItem></SelectContent></Select></div>
                <div className="flex space-x-2 pt-4"><Button onClick={handleUpdate} className="flex-1 bg-gradient-primary">Update Customer</Button><Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">Cancel</Button></div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>
  );
};

export default Customers;