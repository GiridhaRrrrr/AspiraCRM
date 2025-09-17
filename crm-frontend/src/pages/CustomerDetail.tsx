import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import Sidebar from '@/components/layout/Sidebar';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/hooks/use-toast';
import { Customer, Interaction } from '@/types';
import {
  ArrowLeft, Mail, Phone, Building, Calendar, MessageSquare, Plus, Edit, User, Activity, Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, interactions, getCustomer, getCustomers, getCustomerInteractions, addInteraction, loading } = useCRM();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    type: 'call' as Interaction['type'],
    note: '',
    date: new Date().toISOString().slice(0, 10)
  });

  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);

  useEffect(() => {
    const findAndSetCustomer = () => {
      if (customers.length > 0 && id) {
        const foundCustomer = getCustomer(id);
        setCustomer(foundCustomer || null);
      }
    };

    if (customers.length === 0) {
      getCustomers();
    }
    
    findAndSetCustomer();

    if (id) {
      getCustomerInteractions(id);
    }
  }, [id, customers, getCustomers, getCustomerInteractions, getCustomer]);

  const handleAddInteraction = async () => {
    if (!customer) return;
    if (!interactionForm.note.trim()) {
      toast({ title: "Missing Information", description: "Please add a note for this interaction.", variant: "destructive" });
      return;
    }
    try {
      await addInteraction(customer.id, {
        type: interactionForm.type,
        note: interactionForm.note,
        date: interactionForm.date
      });
      toast({ title: "Interaction Added", description: "The interaction has been recorded successfully." });
      setInteractionForm({ type: 'call', note: '', date: new Date().toISOString().slice(0, 10) });
      setIsAddInteractionOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Could not add the interaction. Please try again.", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-warning/10 text-warning-foreground border-warning/20';
      case 'prospect': return 'bg-primary/10 text-primary-foreground border-primary/20';
      case 'customer': return 'bg-success/10 text-success-foreground border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getInteractionIcon = (type: Interaction['type']) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'note': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  if (customer === undefined) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (customer === null) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Customer Not Found</h1>
            <Button onClick={() => navigate('/customers')} variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Customers</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }} className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/customers')} className="text-muted-foreground hover:text-foreground h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground">{customer.name}</h1>
                <p className="text-muted-foreground text-lg">Customer Details & Interactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate(`/customers?edit=${customer.id}`)}><Edit className="h-4 w-4 mr-2" />Edit Customer</Button>
              <Dialog open={isAddInteractionOpen} onOpenChange={setIsAddInteractionOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:shadow-primary"><Plus className="h-4 w-4 mr-2" />Add Interaction</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Interaction</DialogTitle>
                    <DialogDescription>Log a new call, email, meeting, or note for {customer.name}.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={interactionForm.type} onValueChange={(value: Interaction['type']) => setInteractionForm({ ...interactionForm, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="note">Note</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={interactionForm.date} onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note">Note *</Label>
                      <Textarea id="note" value={interactionForm.note} onChange={(e) => setInteractionForm({ ...interactionForm, note: e.target.value })} placeholder="Describe the interaction..." rows={3} />
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={handleAddInteraction} className="flex-1 bg-gradient-primary">Add Interaction</Button>
                      <Button variant="outline" onClick={() => setIsAddInteractionOpen(false)} className="flex-1">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Info */}
            <motion.div variants={fadeInUp} className="lg:col-span-1">
              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="flex items-center space-x-2"><User className="h-5 w-5 text-primary" /><span>Customer Information</span></CardTitle></CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-white font-bold text-2xl">{customer.name.charAt(0)}</span></div>
                    <h3 className="font-heading font-bold text-xl text-foreground">{customer.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(customer.status)}`}>{customer.status}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"><Mail className="h-5 w-5 text-primary" /><div><p className="text-sm font-medium text-foreground">Email</p><p className="text-sm text-muted-foreground">{customer.email}</p></div></div>
                    {customer.phone && (<div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"><Phone className="h-5 w-5 text-primary" /><div><p className="text-sm font-medium text-foreground">Phone</p><p className="text-sm text-muted-foreground">{customer.phone}</p></div></div>)}
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"><Building className="h-5 w-5 text-primary" /><div><p className="text-sm font-medium text-foreground">Company</p><p className="text-sm text-muted-foreground">{customer.company}</p></div></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interactions */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="flex items-center space-x-2"><Activity className="h-5 w-5 text-primary" /><span>Interaction History ({interactions.length})</span></CardTitle></CardHeader>
                <CardContent>
                  {interactions.length > 0 ? (
                    <div className="space-y-4">
                      {interactions.map((interaction) => {
                        const IconComponent = getInteractionIcon(interaction.type);
                        return (
                          <div key={interaction.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 border border-border hover-lift">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0"><IconComponent className="h-5 w-5 text-white" /></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-foreground capitalize">{interaction.type}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {interaction.date ? new Date(interaction.date).toLocaleDateString() : 'No Date'}
                                </span>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">{interaction.note}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No interactions yet</h3>
                      <p className="text-muted-foreground mb-4">Start tracking your communications with this customer.</p>
                      <Button onClick={() => setIsAddInteractionOpen(true)} className="bg-gradient-primary"><Plus className="h-4 w-4 mr-2" />Add First Interaction</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CustomerDetail;