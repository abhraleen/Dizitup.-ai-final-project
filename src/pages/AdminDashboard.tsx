import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AnimatedWaveBackground from "@/components/AnimatedWaveBackground";
import PortfolioManager from "@/components/admin/PortfolioManager";
import { 
  LogOut, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Trash2,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon,
  Briefcase
} from "lucide-react";

interface ServiceRequest {
  id: string;
  enquiry_number: string;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  message: string | null;
  status: 'pending' | 'reviewed' | 'contacted' | 'approved' | 'disapproved';
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'contacted'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  // Fetch service requests
  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchRequests();
    }
  }, [user, isAdmin]);

  // Filter requests
  useEffect(() => {
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === filter));
    }
  }, [requests, filter]);

  const updateRequestStatus = async (id: string, status: 'reviewed' | 'contacted') => {
    setUpdatingId(id);
    
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          status,
          processed_by: user?.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === id 
            ? { ...req, status }
            : req
        )
      );

      toast({
        title: "Success",
        description: `Request ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    
    try {
      console.log('Attempting to delete request with ID:', id);
      
      const { error, data } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', id)
        .select(); // Add select() to see what was deleted

      console.log('Delete response:', { error, data });

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      // Update local state only if delete was successful
      setRequests(prev => prev.filter(req => req.id !== id));

      toast({
        title: "Success",
        description: "Booking deleted successfully.",
      });
      
      console.log('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: `Failed to delete booking: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleRequestStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'reviewed' ? 'contacted' : 'reviewed';
    await updateRequestStatus(id, newStatus as 'reviewed' | 'contacted');
  };

  const openWhatsApp = (request: ServiceRequest) => {
    try {
      const message = `Hello ${request.name},

Thank you for your enquiry with DizItUp (ID: ${request.enquiry_number}).
Service Requested: ${request.service}
Message from you: "${request.message || 'No message provided'}"

We'll review your request and get back to you shortly.

– Team DizItUp`;
      
      // Clean phone number (remove all non-numeric characters)
      const cleanPhone = request.whatsapp.replace(/[^0-9]/g, '');
      console.log('Opening WhatsApp for phone:', cleanPhone);
      
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      console.log('WhatsApp URL:', whatsappUrl);
      
      // Create a temporary link element and click it to avoid browser blocking
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast({
        title: "Error",
        description: "Failed to open WhatsApp. Please check the phone number format.",
        variant: "destructive",
      });
    }
  };

  const openEmail = (request: ServiceRequest) => {
    const subject = `Regarding your enquiry with DizItUp (ID: ${request.enquiry_number})`;
    const body = `Hi ${request.name},

Thank you for reaching out to DizItUp.
Service Requested: ${request.service}
Message from you: "${request.message || 'No message provided'}"

We have received your enquiry and will respond shortly.

Best regards,
Team DizItUp`;
    const mailtoUrl = `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reviewed':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Reviewed</Badge>;
      case 'contacted':
        return <Badge className="bg-green-600 hover:bg-green-700">Contacted</Badge>;
      case 'approved':
        return <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>;
      case 'disapproved':
        return <Badge variant="destructive">Disapproved</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getStatusCounts = () => {
    const all = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const reviewed = requests.filter(r => r.status === 'reviewed').length;
    const contacted = requests.filter(r => r.status === 'contacted').length;
    
    return { all, pending, reviewed, contacted };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center content-overlay-strong p-8 rounded-lg">
          <div className="glitch text-2xl font-display mb-4">Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen text-foreground relative">
      <AnimatedWaveBackground />
      {/* Header */}
      <div className="content-overlay-light border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-card-foreground">
              Admin Dashboard
            </h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="service-requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
            <TabsTrigger value="service-requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Service Requests
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Portfolio Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="service-requests" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-card border-border hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                      <p className="text-2xl font-bold text-card-foreground">{counts.all}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-card-foreground">{counts.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Reviewed</p>
                      <p className="text-2xl font-bold text-card-foreground">{counts.reviewed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Contacted</p>
                      <p className="text-2xl font-bold text-card-foreground">{counts.contacted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'reviewed', 'contacted'].map((filterOption) => (
                    <Button
                      key={filterOption}
                      variant={filter === filterOption ? "default" : "outline"}
                      onClick={() => setFilter(filterOption as any)}
                      className="capitalize"
                    >
                      {filterOption} 
                      {filterOption === 'all' && ` (${counts.all})`}
                      {filterOption === 'pending' && ` (${counts.pending})`}
                      {filterOption === 'reviewed' && ` (${counts.reviewed})`}
                      {filterOption === 'contacted' && ` (${counts.contacted})`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            <div className="space-y-6">
              {filteredRequests.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {filter === 'all' ? 'No service requests found.' : `No ${filter} requests found.`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="bg-card border-border hover-glow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-card-foreground">
                          {request.enquiry_number}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-card-foreground font-medium">{request.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="text-card-foreground">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="text-card-foreground">{request.whatsapp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-card-foreground">{request.service}</span>
                        </div>
                      </div>
                      
                      {request.message && (
                        <div className="bg-secondary/50 p-4 rounded-lg">
                          <p className="text-sm text-card-foreground">
                            <strong>Message:</strong> {request.message}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-4">
                        {/* Quick Contact Buttons */}
                        <Button
                          onClick={() => openEmail(request)}
                          variant="outline"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email User
                        </Button>

                        {/* Status Toggle - Only for reviewed/contacted status */}
                        {(request.status === 'reviewed' || request.status === 'contacted') && (
                          <Button
                            onClick={() => toggleRequestStatus(request.id, request.status)}
                            disabled={updatingId === request.id}
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            {request.status === 'reviewed' ? (
                              <ToggleRight className="h-4 w-4 mr-2" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 mr-2" />
                            )}
                            {updatingId === request.id ? 'Updating...' : 
                             request.status === 'reviewed' ? 'Switch to Contacted' : 'Switch to Reviewed'}
                          </Button>
                        )}

                        {/* Status Update Buttons - Only for pending */}
                        {request.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => updateRequestStatus(request.id, 'reviewed')}
                              disabled={updatingId === request.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {updatingId === request.id ? 'Processing...' : 'Mark as Reviewed'}
                            </Button>
                            <Button
                              onClick={() => updateRequestStatus(request.id, 'contacted')}
                              disabled={updatingId === request.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {updatingId === request.id ? 'Processing...' : 'Mark as Contacted'}
                            </Button>
                          </>
                        )}

                        {/* Delete Button */}
                        <Button
                          onClick={() => deleteRequest(request.id)}
                          disabled={deletingId === request.id}
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingId === request.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;