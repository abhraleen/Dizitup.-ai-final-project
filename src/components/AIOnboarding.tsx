import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Target, Zap } from 'lucide-react';

interface OnboardingQuestion {
  id: number;
  question: string;
  type: 'text' | 'choice' | 'multiple';
  options?: string[];
  placeholder?: string;
}

interface BusinessAnalysis {
  industry: string;
  website: string;
  goals: string[];
  services: string[];
}

const AIOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const questions: OnboardingQuestion[] = [
    {
      id: 1,
      question: "What do you do?",
      type: 'text',
      placeholder: "E.g., I run a digital marketing agency specializing in e-commerce"
    },
    {
      id: 2,
      question: "Do you have a website or social presence?",
      type: 'choice',
      options: [
        "Yes, I have a website",
        "Yes, I have social media profiles",
        "I have both a website and social presence",
        "No, I don't have either yet"
      ]
    },
    {
      id: 3,
      question: "What's your biggest business goal?",
      type: 'multiple',
      options: [
        "Increase brand awareness",
        "Generate more leads/sales",
        "Improve customer engagement",
        "Automate business processes",
        "Enhance online presence",
        "Scale operations efficiently"
      ]
    }
  ];

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: answer
    }));

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - start analysis
      setIsAnalyzing(true);
      simulateAnalysis();
    }
  };

  const simulateAnalysis = () => {
    // Simulate AI analysis process
    setTimeout(() => {
      const businessAnalysis: BusinessAnalysis = {
        industry: answers[1] || "Digital Business",
        website: answers[2] || "Not specified",
        goals: Array.isArray(answers[3]) ? answers[3] : [answers[3]],
        services: [
          "AI-Powered Marketing Strategy",
          "Automated Content Creation",
          "Intelligent Customer Engagement",
          "Predictive Analytics Dashboard"
        ]
      };
      
      setAnalysis(businessAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleStartJourney = () => {
    setIsVisible(false);
    // In a real app, this would navigate to the dashboard
    setTimeout(() => {
      window.location.href = '/ai';
    }, 500);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(185,28,28,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(185,28,28,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!isAnalyzing && !analysis ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                  <Brain className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">AI Business Analysis</h2>
                <p className="text-gray-400">
                  Let's understand your business to provide personalized AI solutions
                </p>
              </div>

              <div className="mb-2 flex justify-between text-sm text-gray-500">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
              </div>
              
              <div className="h-2 bg-gray-800 rounded-full mb-8">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  {questions[currentStep].question}
                </h3>

                {questions[currentStep].type === 'text' && (
                  <textarea
                    value={answers[questions[currentStep].id] || ''}
                    onChange={(e) => setAnswers(prev => ({
                      ...prev,
                      [questions[currentStep].id]: e.target.value
                    }))}
                    placeholder={questions[currentStep].placeholder}
                    className="w-full bg-black/50 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[120px] resize-none"
                  />
                )}

                {questions[currentStep].type === 'choice' && (
                  <div className="space-y-3">
                    {questions[currentStep].options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="w-full text-left p-4 bg-black/30 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 group-hover:text-white">{option}</span>
                          <ArrowRight className="w-5 h-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {questions[currentStep].type === 'multiple' && (
                  <div className="space-y-3">
                    {questions[currentStep].options?.map((option, index) => (
                      <label 
                        key={index}
                        className="flex items-start p-4 bg-black/30 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={Array.isArray(answers[questions[currentStep].id]) 
                            ? answers[questions[currentStep].id].includes(option) 
                            : false}
                          onChange={(e) => {
                            const currentAnswers = Array.isArray(answers[questions[currentStep].id]) 
                              ? [...answers[questions[currentStep].id]] 
                              : [];
                            
                            if (e.target.checked) {
                              setAnswers(prev => ({
                                ...prev,
                                [questions[currentStep].id]: [...currentAnswers, option]
                              }));
                            } else {
                              setAnswers(prev => ({
                                ...prev,
                                [questions[currentStep].id]: currentAnswers.filter(item => item !== option)
                              }));
                            }
                          }}
                          className="mt-1 h-5 w-5 rounded bg-black/50 border-red-500/50 text-red-500 focus:ring-red-500/50"
                        />
                        <span className="ml-3 text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 0}
                  className="px-6 py-3 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Back
                </button>
                
                {questions[currentStep].type === 'text' ? (
                  <button
                    onClick={() => answers[questions[currentStep].id] && handleAnswer(answers[questions[currentStep].id])}
                    disabled={!answers[questions[currentStep].id]}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                ) : null}
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-red-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping"></div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Business</h2>
              <p className="text-gray-400 mb-8">
                Our AI is processing your information to create personalized recommendations
              </p>
              
              <div className="flex justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </motion.div>
          ) : analysis ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                  <Target className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">AI Analysis Complete</h2>
                <p className="text-gray-400">
                  Here's what we've discovered about your business
                </p>
              </div>

              <div className="mb-8">
                <div className="bg-black/50 border border-red-500/20 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Business Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Industry</p>
                      <p className="text-white">{analysis.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Digital Presence</p>
                      <p className="text-white">{analysis.website}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-500 text-sm">Business Goals</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.goals.map((goal, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 border border-red-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recommended AI Services</h3>
                  <div className="space-y-4">
                    {analysis.services.map((service, index) => (
                      <div 
                        key={index}
                        className="flex items-start p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-lg"
                      >
                        <Zap className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-white">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartJourney}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center"
                >
                  Activate AI Services
                  <Zap className="ml-2 w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => {
                      window.location.href = '/';
                    }, 500);
                  }}
                  className="px-6 py-4 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                >
                  Explore Website
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes pulse-slow {
          0% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
          100% { opacity: 0.1; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIOnboarding;