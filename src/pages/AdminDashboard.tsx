import { useState, useEffect } from "react";
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Zap,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  users: number;
  status: 'active' | 'inactive';
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      plan: 'Enterprise',
      credits: 4250,
      status: 'active',
      joinDate: '2025-09-15',
      lastActive: '2025-10-15'
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      plan: 'Professional',
      credits: 1800,
      status: 'active',
      joinDate: '2025-09-22',
      lastActive: '2025-10-14'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      plan: 'Starter',
      credits: 350,
      status: 'active',
      joinDate: '2025-10-01',
      lastActive: '2025-10-15'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      plan: 'Enterprise',
      credits: 0,
      status: 'suspended',
      joinDate: '2025-08-30',
      lastActive: '2025-10-10'
    }
  ]);

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'starter',
      name: 'Starter',
      price: 2999,
      credits: 1000,
      users: 12,
      status: 'active'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 4999,
      credits: 2500,
      users: 8,
      status: 'active'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 9999,
      credits: 5000,
      users: 5,
      status: 'active'
    }
  ]);

  const [stats, setStats] = useState({
    totalUsers: 1242,
    activeUsers: 987,
    revenue: 245680,
    creditsUsed: 124500
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Starter': return 'bg-blue-500/20 text-blue-400';
      case 'Professional': return 'bg-purple-500/20 text-purple-400';
      case 'Enterprise': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage users, credits, and plans</p>
          </div>
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
            <Plus className="w-5 h-5 mr-2" />
            Add New
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-500/10 rounded-xl mr-4">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/10 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/10 rounded-xl mr-4">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Credits Used</p>
                <p className="text-2xl font-bold text-white">{stats.creditsUsed.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-red-500/30 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium relative ${
              activeTab === 'users'
                ? 'text-red-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Users
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-6 py-3 font-medium relative ${
              activeTab === 'plans'
                ? 'text-red-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Plans
            {activeTab === 'plans' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium relative ${
              activeTab === 'analytics'
                ? 'text-red-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Analytics
            {activeTab === 'analytics' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-red-500/30">
                      <th className="pb-4">User</th>
                      <th className="pb-4">Plan</th>
                      <th className="pb-4">Credits</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Last Active</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-red-500/20 hover:bg-red-500/5">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${getPlanColor(user.plan)}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 text-red-400 mr-2" />
                            <span className="text-white">{user.credits.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {user.lastActive}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-gradient-to-b from-red-900/20 to-red-800/20 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-3xl font-bold text-red-400 mt-2">₹{plan.price}<span className="text-lg text-gray-400">/month</span></p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${plan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {plan.status}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center text-gray-300 mb-2">
                        <Zap className="w-5 h-5 mr-2 text-red-400" />
                        <span>{plan.credits.toLocaleString()} credits</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="w-5 h-5 mr-2 text-red-400" />
                        <span>{plan.users} active users</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Plan
                </Button>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-black/50 border border-red-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Revenue Overview</h3>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">Revenue chart visualization</p>
                  </div>
                </div>
                
                <div className="bg-black/50 border border-red-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">User Growth</h3>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">User growth chart visualization</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 border border-red-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { user: 'Alex Johnson', action: 'Upgraded to Enterprise plan', time: '2 hours ago' },
                    { user: 'Sarah Williams', action: 'Purchased 1000 additional credits', time: '5 hours ago' },
                    { user: 'Michael Chen', action: 'Completed video editing project', time: '1 day ago' },
                    { user: 'Emma Davis', action: 'Account suspended due to low credits', time: '2 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center p-4 bg-black/30 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
                        <Users className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.user}</p>
                        <p className="text-gray-400 text-sm">{activity.action}</p>
                      </div>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes pulse-slow {
          0% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.1); }
          100% { opacity: 0.05; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;