import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CreditCard, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface CreditPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const CreditSystem = () => {
  const [credits, setCredits] = useState(850);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const plans: CreditPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 2999,
      credits: 1000,
      features: [
        '1,000 AI credits per month',
        'Basic AI services',
        'Email support',
        'Standard delivery speed'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 4999,
      credits: 2500,
      features: [
        '2,500 AI credits per month',
        'All AI services',
        'Priority support',
        'Faster delivery speed',
        'Custom AI models'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 9999,
      credits: 5000,
      features: [
        '5,000 AI credits per month',
        'All AI services',
        '24/7 dedicated support',
        'Fastest delivery speed',
        'Custom AI models',
        'Dedicated project manager'
      ]
    }
  ];

  // Check for low credit notifications
  useEffect(() => {
    if (credits <= 200 && credits > 100) {
      setNotification({
        id: 'low-credits',
        type: 'warning',
        title: 'Low Credits',
        message: 'You have only ' + credits + ' credits remaining. Consider upgrading your plan.',
        timestamp: new Date(),
        action: {
          label: 'Upgrade Now',
          onClick: () => setIsUpgradeModalOpen(true)
        }
      });
      setShowNotification(true);
    } else if (credits <= 100 && credits > 0) {
      setNotification({
        id: 'very-low-credits',
        type: 'warning',
        title: 'Very Low Credits',
        message: 'You have only ' + credits + ' credits remaining. Services will pause when credits run out.',
        timestamp: new Date(),
        action: {
          label: 'Add Credits',
          onClick: () => setIsUpgradeModalOpen(true)
        }
      });
      setShowNotification(true);
    } else if (credits <= 0) {
      setNotification({
        id: 'no-credits',
        type: 'warning',
        title: 'No Credits Remaining',
        message: 'Your AI services are paused. Please add credits to continue.',
        timestamp: new Date(),
        action: {
          label: 'Recharge Credits',
          onClick: () => setIsUpgradeModalOpen(true)
        }
      });
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [credits]);

  const handleUpgrade = (planId: string) => {
    // In a real app, this would process payment
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setCredits(prev => prev + plan.credits);
      setNotification({
        id: 'upgrade-success',
        type: 'success',
        title: 'Upgrade Successful!',
        message: `Added ${plan.credits} credits to your account.`,
        timestamp: new Date()
      });
      setShowNotification(true);
      setIsUpgradeModalOpen(false);
      
      // Hide success notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Zap className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'success': return 'bg-green-500/10 border-green-500/30';
      default: return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="relative">
      {/* Credit Display */}
      <div className="flex items-center bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
        <div className="flex items-center">
          <div className="p-3 bg-red-500/10 rounded-xl mr-4">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">AI Credits</p>
            <p className="text-3xl font-bold text-white">{credits}</p>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (credits / 5000) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="ml-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Add Credits
        </button>
      </div>

      {/* Smart Notification */}
      <AnimatePresence>
        {showNotification && notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 z-50 max-w-sm w-full ${getNotificationBg(notification.type)} border rounded-2xl p-4 shadow-2xl`}
          >
            <div className="flex items-start">
              {getNotificationIcon(notification.type)}
              <div className="ml-3 flex-1">
                <h4 className="font-bold text-white">{notification.title}</h4>
                <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-white ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Upgrade Your Plan</h3>
                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-400 mb-8">
                Choose a plan that fits your business needs. All plans include our full suite of AI services.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="bg-gradient-to-b from-red-900/20 to-red-800/20 border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all"
                  >
                    <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-red-400">₹{plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <div className="mb-6">
                      <span className="text-2xl font-bold text-white">{plan.credits.toLocaleString()}</span>
                      <span className="text-gray-400"> credits</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-red-500/20">
                <div className="flex items-center text-gray-400">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-sm">Free Trial: 100 credits for 3 days</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreditSystem;