import React, { useState } from 'react';
import { 
  Smartphone, 
  WifiOff, 
  MessageSquare, 
  Shield, 
  Users, 
  MapPin, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Leaf,
  Clock,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface UseCase {
  id: string;
  title: string;
  description: string;
  scenario: string;
  steps: Step[];
  benefits: string[];
  icon: React.ComponentType<any>;
  color: string;
}

interface Step {
  title: string;
  description: string;
  action: string;
  screenshot?: string;
  tip?: string;
}

const HowToUse: React.FC = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>('street-vendor');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const useCases: UseCase[] = [
    {
      id: 'street-vendor',
      title: 'Street Vendor Payments',
      description: 'Accept payments from customers without internet',
      scenario: 'Maria sells fruits in Lagos. Her customers want to pay digitally, but internet is unreliable.',
      steps: [
        {
          title: 'Customer wants to pay',
          description: 'Customer approaches Maria\'s fruit stand',
          action: 'Customer says: "I want to pay $5 for these oranges"',
          tip: 'No internet needed - TrustPay works offline!'
        },
        {
          title: 'Maria opens TrustPay',
          description: 'Maria opens the app on her basic smartphone',
          action: 'Tap the TrustPay app icon',
          tip: 'Works on any Android phone, even older models'
        },
        {
          title: 'App detects offline mode',
          description: 'TrustPay automatically switches to SMS mode',
          action: 'App shows "Offline Mode - SMS payments available"',
          tip: 'Automatic detection - no manual switching needed'
        },
        {
          title: 'Enter payment details',
          description: 'Maria enters the payment amount',
          action: 'Tap "Send Money" → Enter $5.00 → Enter customer\'s phone',
          tip: 'SMS fee is only 1¢ - clearly displayed'
        },
        {
          title: 'Payment sent via SMS',
          description: 'TrustPay sends payment request via SMS',
          action: 'Customer receives SMS: "Pay $5 to Maria? Reply YES"',
          tip: 'Works on any phone - even feature phones!'
        },
        {
          title: 'Customer confirms',
          description: 'Customer replies to confirm payment',
          action: 'Customer texts back "YES"',
          tip: 'Simple one-word confirmation'
        },
        {
          title: 'Payment complete',
          description: 'Both receive confirmation SMS',
          action: 'Both phones get: "Payment successful! $5 sent to Maria"',
          tip: 'Instant confirmation for both parties'
        }
      ],
      benefits: [
        'Works without internet connection',
        'Accepts payments from any phone',
        'Only 1¢ SMS fee',
        'Instant confirmation',
        'Secure encrypted transactions'
      ],
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'rural-farmer',
      title: 'Rural Farmer Sales',
      description: 'Sell crops and receive payments in remote areas',
      scenario: 'John is a farmer in rural Kenya. He needs to sell his harvest to buyers in the city.',
      steps: [
        {
          title: 'Harvest ready for sale',
          description: 'John has 100kg of maize to sell',
          action: 'John contacts city buyer: "I have maize ready - $200"',
          tip: 'TrustPay enables remote business transactions'
        },
        {
          title: 'Buyer agrees to purchase',
          description: 'City buyer wants to pay immediately',
          action: 'Buyer says: "I\'ll pay now via TrustPay"',
          tip: 'Builds trust between rural and urban traders'
        },
        {
          title: 'No internet in rural area',
          description: 'John\'s village has no reliable internet',
          action: 'TrustPay automatically switches to SMS mode',
          tip: 'Rural areas often lack internet - SMS works everywhere'
        },
        {
          title: 'Buyer sends payment',
          description: 'Buyer initiates $200 payment from the city',
          action: 'Buyer uses TrustPay online to send money to John\'s phone',
          tip: 'Online users can send to offline users seamlessly'
        },
        {
          title: 'John receives SMS notification',
          description: 'Payment notification arrives via SMS',
          action: 'John gets SMS: "You received $200 from CityBuyer"',
          tip: 'No smartphone needed - works on basic phones'
        },
        {
          title: 'Fraud protection active',
          description: 'AI checks the large transaction amount',
          action: 'System verifies: "Large amount for farmer - checking patterns"',
          tip: 'AI protects against fraud even in offline transactions'
        },
        {
          title: 'Payment confirmed safe',
          description: 'Transaction approved and money available',
          action: 'John can now cash out at local agent or mobile money',
          tip: 'Connects to existing cash-out networks'
        }
      ],
      benefits: [
        'Connects rural sellers to urban buyers',
        'Works with basic phones',
        'AI fraud protection',
        'Immediate payment confirmation',
        'Integrates with local cash-out agents'
      ],
      icon: MapPin,
      color: 'bg-blue-500'
    },
    {
      id: 'domestic-worker',
      title: 'Domestic Worker Wages',
      description: 'Receive salary payments safely and securely',
      scenario: 'Grace works as a house cleaner in Nairobi. Her employer wants to pay her monthly salary digitally.',
      steps: [
        {
          title: 'Salary payment due',
          description: 'End of month - Grace\'s $300 salary is due',
          action: 'Employer opens TrustPay to pay Grace',
          tip: 'Digital payments create employment records'
        },
        {
          title: 'Large amount triggers AI check',
          description: 'TrustPay AI analyzes the $300 payment',
          action: 'System checks: "Large payment to Grace - analyzing patterns"',
          tip: 'AI protects workers from payment fraud'
        },
        {
          title: 'AI verifies legitimate salary',
          description: 'System recognizes monthly salary pattern',
          action: 'AI approves: "Regular monthly payment pattern - approved"',
          tip: 'Smart AI learns legitimate payment patterns'
        },
        {
          title: 'Grace receives payment notification',
          description: 'Payment arrives with fraud protection',
          action: 'Grace gets notification: "$300 salary received safely"',
          tip: 'Workers protected from fake payment scams'
        },
        {
          title: 'Grace cashes out safely',
          description: 'Grace converts digital money to cash',
          action: 'Grace taps "Cash Out" → Selects local agent',
          tip: 'Network of trusted cash-out agents available'
        },
        {
          title: 'Transaction history saved',
          description: 'Digital record of employment payments',
          action: 'Grace can show payment history for loans/credit',
          tip: 'Digital records help build financial history'
        }
      ],
      benefits: [
        'Safe salary payments',
        'Protection from payment fraud',
        'Digital employment records',
        'Easy cash-out options',
        'Builds credit history'
      ],
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      id: 'small-business',
      title: 'Small Business Operations',
      description: 'Manage business payments and cash flow',
      scenario: 'Ahmed runs a small electronics repair shop. He needs to pay suppliers and receive customer payments.',
      steps: [
        {
          title: 'Customer brings broken phone',
          description: 'Repair costs $25 - customer wants to pay digitally',
          action: 'Ahmed quotes: "$25 for screen replacement"',
          tip: 'Digital payments look more professional'
        },
        {
          title: 'Customer pays via TrustPay',
          description: 'Quick digital payment for services',
          action: 'Customer sends $25 → Ahmed receives instantly',
          tip: 'No cash handling - safer for business'
        },
        {
          title: 'Ahmed needs to pay supplier',
          description: 'Ordering new phone screens - $150 payment',
          action: 'Ahmed sends $150 to supplier via TrustPay',
          tip: 'Digital payments to suppliers build business relationships'
        },
        {
          title: 'Large payment triggers review',
          description: 'AI checks Ahmed\'s $150 business payment',
          action: 'System analyzes: "Business payment pattern - checking"',
          tip: 'AI learns business vs personal payment patterns'
        },
        {
          title: 'Business pattern recognized',
          description: 'AI approves legitimate business transaction',
          action: 'AI confirms: "Regular supplier payment - approved"',
          tip: 'Smart fraud detection understands business needs'
        },
        {
          title: 'Supplier receives payment',
          description: 'Supplier confirms order and ships screens',
          action: 'Supplier: "Payment received - shipping screens today"',
          tip: 'Fast payments improve supplier relationships'
        },
        {
          title: 'Business records tracked',
          description: 'All transactions automatically recorded',
          action: 'Ahmed reviews monthly business transactions',
          tip: 'Digital records help with taxes and business planning'
        }
      ],
      benefits: [
        'Professional payment processing',
        'Automated business records',
        'Supplier relationship management',
        'Cash flow tracking',
        'Tax record keeping'
      ],
      icon: DollarSign,
      color: 'bg-orange-500'
    },
    {
      id: 'emergency-payment',
      title: 'Emergency Situations',
      description: 'Send urgent money when internet is down',
      scenario: 'Sarah\'s mother is sick and needs $100 for medicine. The hospital has no internet, but needs payment now.',
      steps: [
        {
          title: 'Medical emergency occurs',
          description: 'Mother needs urgent medication costing $100',
          action: 'Hospital says: "We need $100 payment for medicine"',
          tip: 'Medical emergencies can\'t wait for internet'
        },
        {
          title: 'Hospital has no internet',
          description: 'Power outage has knocked out internet connection',
          action: 'Sarah tries to pay but sees "No internet connection"',
          tip: 'Infrastructure problems are common in emerging markets'
        },
        {
          title: 'TrustPay switches to SMS mode',
          description: 'App automatically detects offline situation',
          action: 'TrustPay shows: "Offline mode - SMS payments available"',
          tip: 'Automatic failover ensures payments always work'
        },
        {
          title: 'Sarah sends emergency payment',
          description: 'Urgent $100 payment sent via SMS',
          action: 'Sarah sends $100 to hospital\'s phone number',
          tip: 'SMS works even when internet is down'
        },
        {
          title: 'Large amount triggers security check',
          description: 'AI analyzes emergency payment for fraud',
          action: 'System checks: "Large urgent payment - analyzing"',
          tip: 'Even emergency payments are protected from fraud'
        },
        {
          title: 'Emergency pattern recognized',
          description: 'AI approves legitimate emergency payment',
          action: 'AI confirms: "Emergency medical payment - approved"',
          tip: 'AI understands different types of legitimate payments'
        },
        {
          title: 'Hospital receives payment',
          description: 'Medicine can be dispensed immediately',
          action: 'Hospital confirms: "Payment received - dispensing medicine"',
          tip: 'Lives can be saved with reliable payment systems'
        }
      ],
      benefits: [
        'Works during infrastructure failures',
        'Emergency payment processing',
        'Life-saving reliability',
        'Fraud protection even offline',
        'Immediate confirmation'
      ],
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const selectedCase = useCases.find(uc => uc.id === selectedUseCase) || useCases[0];

  const nextStep = () => {
    if (currentStep < selectedCase.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const playDemo = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= selectedCase.steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-bolt-green-600 to-bolt-green-700 rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          How to Use TrustPay
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Real-world examples of banking the unbanked
        </p>
      </div>

      {/* Use Case Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Choose Your Scenario
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => {
                setSelectedUseCase(useCase.id);
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className={`p-4 text-left rounded-lg border-2 transition-all ${
                selectedUseCase === useCase.id 
                  ? 'border-bolt-green-500 bg-bolt-green-50 dark:bg-bolt-green-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${useCase.color} rounded-full flex items-center justify-center`}>
                  <useCase.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {useCase.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Scenario */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 ${selectedCase.color} rounded-full flex items-center justify-center`}>
            <selectedCase.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedCase.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCase.description}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</h4>
          <p className="text-gray-700 dark:text-gray-300">{selectedCase.scenario}</p>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={playDemo}
            disabled={isPlaying}
            className="flex items-center space-x-2 px-4 py-2 bg-bolt-green-600 text-white rounded-lg hover:bg-bolt-green-700 disabled:opacity-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Play Demo</span>
          </button>
          
          <button
            onClick={resetDemo}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <div className="flex-1 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {selectedCase.steps.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-6">
          <div 
            className="bg-bolt-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / selectedCase.steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step */}
        <div className="bg-bolt-green-50 dark:bg-bolt-green-900/20 border border-bolt-green-200 dark:border-bolt-green-800 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-bolt-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {currentStep + 1}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-bolt-green-800 dark:text-bolt-green-200 mb-2">
                {selectedCase.steps[currentStep].title}
              </h4>
              <p className="text-bolt-green-700 dark:text-bolt-green-300 mb-3">
                {selectedCase.steps[currentStep].description}
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                <p className="font-medium text-gray-900 dark:text-white">
                  Action: {selectedCase.steps[currentStep].action}
                </p>
              </div>
              {selectedCase.steps[currentStep].tip && (
                <div className="flex items-start space-x-2 text-sm text-bolt-green-600 dark:text-bolt-green-400">
                  <Zap className="w-4 h-4 mt-0.5" />
                  <p><strong>Tip:</strong> {selectedCase.steps[currentStep].tip}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <span>Previous</span>
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === selectedCase.steps.length - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-bolt-green-600 text-white rounded-lg hover:bg-bolt-green-700 disabled:opacity-50 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-bolt-green-600" />
          <span>Key Benefits</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedCase.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <CheckCircle className="w-5 h-5 text-bolt-green-600 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why TrustPay Works */}
      <div className="bg-gradient-to-r from-bolt-green-600 to-bolt-green-700 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Why TrustPay Works for Everyone</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <WifiOff className="w-6 h-6 text-bolt-green-200 mt-1" />
              <div>
                <h4 className="font-semibold text-bolt-green-100">Offline-First Design</h4>
                <p className="text-bolt-green-200 text-sm">
                  Works without internet using SMS. Perfect for areas with poor connectivity.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Smartphone className="w-6 h-6 text-bolt-green-200 mt-1" />
              <div>
                <h4 className="font-semibold text-bolt-green-100">Any Phone Works</h4>
                <p className="text-bolt-green-200 text-sm">
                  From smartphones to basic feature phones - everyone can participate.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-bolt-green-200 mt-1" />
              <div>
                <h4 className="font-semibold text-bolt-green-100">AI Fraud Protection</h4>
                <p className="text-bolt-green-200 text-sm">
                  Advanced AI protects every transaction, even offline payments.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <DollarSign className="w-6 h-6 text-bolt-green-200 mt-1" />
              <div>
                <h4 className="font-semibold text-bolt-green-100">Low Cost</h4>
                <p className="text-bolt-green-200 text-sm">
                  Only 1¢ for SMS payments. Much cheaper than traditional banking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ready to Get Started?
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-6 h-6 bg-bolt-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-gray-700 dark:text-gray-300">Download TrustPay on any smartphone</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-6 h-6 bg-bolt-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-gray-700 dark:text-gray-300">Sign up with your phone number</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-6 h-6 bg-bolt-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-gray-700 dark:text-gray-300">Start sending and receiving money - online or offline!</span>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Join millions banking the unbanked with TrustPay
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Leaf className="w-5 h-5 text-bolt-green-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Bank the unbanked. Simply. Securely.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;