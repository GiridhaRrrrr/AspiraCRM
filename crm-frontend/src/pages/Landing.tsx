import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/layout/Navbar';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  Target, 
  Shield, 
  Zap,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-crm.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for your interest. We'll get back to you soon.",
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Empowering Relationships
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 max-w-4xl"
            >
              <h1 className="font-heading font-bold text-5xl lg:text-7xl leading-tight">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AspiraCRM
                </span>
              </h1>
              <h2 className="font-heading font-bold text-3xl lg:text-5xl text-muted-foreground">
                Elevating Growth
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Empowering relationships, elevating growth. The modern CRM platform 
              designed to help you build meaningful connections and drive results.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6 text-white font-medium transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl lg:text-display text-foreground mb-6"
            >
              Everything you need to grow your business
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Comprehensive CRM features designed to streamline your sales process 
              and enhance customer relationships.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Users,
                title: 'Customer Management',
                description: 'Organize and track all your customer information in one centralized location with detailed profiles and interaction history.'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Get insights into your sales performance with comprehensive reports and data visualization tools.'
              },
              {
                icon: MessageSquare,
                title: 'Interaction Tracking',
                description: 'Log and monitor all customer interactions including calls, emails, meetings, and notes.'
              },
              {
                icon: Target,
                title: 'Lead Management',
                description: 'Convert prospects into customers with powerful lead tracking and nurturing tools.'
              },
              {
                icon: Shield,
                title: 'Data Security',
                description: 'Your customer data is protected with enterprise-grade security and privacy controls.'
              },
              {
                icon: Zap,
                title: 'Automation',
                description: 'Automate repetitive tasks and workflows to focus on what matters most - your customers.'
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover-lift border-border bg-card">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="font-heading font-bold text-3xl lg:text-display text-foreground">
                  Built for modern businesses
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  AspiraCRM was created to address the complex needs of today's 
                  customer-centric businesses. We believe that strong relationships 
                  are the foundation of sustainable growth.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: 'Intuitive Design',
                    description: 'Clean, modern interface that your team will love to use every day.'
                  },
                  {
                    title: 'Scalable Solution',
                    description: 'Grows with your business from startup to enterprise level.'
                  },
                  {
                    title: 'Expert Support',
                    description: '24/7 customer support to help you succeed at every step.'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="p-6 bg-gradient-card border-border">
                    <div className="text-2xl font-bold text-primary mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                  </Card>
                  <Card className="p-6 bg-gradient-card border-border">
                    <div className="text-2xl font-bold text-primary mb-2">50k+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="p-6 bg-gradient-card border-border">
                    <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Support Available</div>
                  </Card>
                  <Card className="p-6 bg-gradient-card border-border">
                    <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading font-bold text-3xl lg:text-display text-foreground mb-6">
                Get in touch
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions about AspiraCRM? We'd love to hear from you. 
                Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      title: 'Email',
                      content: 'hello@aspiracrm.com'
                    },
                    {
                      icon: Phone,
                      title: 'Phone',
                      content: '+1 (555) 123-4567'
                    },
                    {
                      icon: MapPin,
                      title: 'Office',
                      content: 'San Francisco, CA'
                    }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <contact.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{contact.title}</h3>
                        <p className="text-muted-foreground">{contact.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="border-border bg-card">
                  <CardContent className="p-8">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            First Name
                          </label>
                          <Input 
                            required 
                            className="border-border"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Last Name
                          </label>
                          <Input 
                            required 
                            className="border-border"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <Input 
                          type="email" 
                          required 
                          className="border-border"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <Textarea 
                          required 
                          rows={4} 
                          className="border-border"
                          placeholder="Tell us about your CRM needs..."
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-primary hover:shadow-primary py-6 text-lg"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                AspiraCRM
              </span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2025 AspiraCRM. Empowering relationships, elevating growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;