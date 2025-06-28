import React, { useState } from 'react';
import { 
  UserCheck, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wallet,
  Car,
  Shield,
  MapPin,
  Phone
} from 'lucide-react';
import { boltAPI } from '../services/api';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
  };
  location: string;
  status: 'pending' | 'verified' | 'rejected';
  walletAddress?: string;
  documentsUploaded: boolean;
  verificationDate?: string;
}

const DriverVerification: React.FC = () => {
  const [drivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      licenseNumber: 'DL123456',
      vehicleDetails: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        plateNumber: 'ABC-123',
      },
      location: 'Lagos, Nigeria',
      status: 'pending',
      documentsUploaded: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      licenseNumber: 'DL789012',
      vehicleDetails: {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        plateNumber: 'XYZ-789',
      },
      location: 'Nairobi, Kenya',
      status: 'verified',
      walletAddress: 'bolt_wallet_abc123',
      documentsUploaded: true,
      verificationDate: '2024-01-15',
    },
  ]);

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [processingCashout, setProcessingCashout] = useState<string | null>(null);

  const handleVerifyDriver = async (driver: Driver) => {
    setVerifying(driver.id);
    try {
      const result = await boltAPI.verifyDriver({
        id: driver.id,
        licenseNumber: driver.licenseNumber,
        vehicleDetails: driver.vehicleDetails,
      });
      
      // Update driver status based on verification result
      driver.status = result.verified ? 'verified' : 'rejected';
      if (result.verified) {
        driver.walletAddress = result.walletAddress;
        driver.verificationDate = new Date().toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifying(null);
    }
  };

  const handleCashout = async (driver: Driver) => {
    if (!cashoutAmount || !driver.walletAddress) return;
    
    setProcessingCashout(driver.id);
    try {
      const result = await boltAPI.processCashout(
        parseFloat(cashoutAmount),
        driver.walletAddress
      );
      
      alert(`Cashout initiated! Transaction ID: ${result.transactionId}`);
      setCashoutAmount('');
    } catch (error) {
      console.error('Cashout failed:', error);
      alert('Cashout failed. Please try again.');
    } finally {
      setProcessingCashout(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const pendingCount = drivers.filter(d => d.status === 'pending').length;
  const verifiedCount = drivers.filter(d => d.status === 'verified').length;
  const rejectedCount = drivers.filter(d => d.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Verification</h1>
        <p className="text-gray-600">Verify drivers and manage Bolt wallet integrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pending Verification</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Verified Drivers</p>
                <p className="text-2xl font-semibold text-gray-900">{verifiedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers List */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Driver Applications</h3>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {drivers.map((driver) => (
            <li key={driver.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">{driver.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(driver.status)}`}>
                        {driver.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {driver.phone}
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1" />
                        {driver.licenseNumber}
                      </div>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-1" />
                        {driver.vehicleDetails.make} {driver.vehicleDetails.model}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {driver.location}
                      </div>
                    </div>

                    {driver.walletAddress && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <Wallet className="h-4 w-4 mr-1" />
                        Wallet: {driver.walletAddress}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {driver.status === 'pending' && (
                    <button
                      onClick={() => handleVerifyDriver(driver)}
                      disabled={verifying === driver.id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {verifying === driver.id ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verify
                        </>
                      )}
                    </button>
                  )}
                  
                  {driver.status === 'verified' && (
                    <button
                      onClick={() => setSelectedDriver(driver)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Wallet className="h-3 w-3 mr-1" />
                      Cashout
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Vehicle Details</h5>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>{driver.vehicleDetails.year} {driver.vehicleDetails.make} {driver.vehicleDetails.model}</p>
                    <p>Plate: {driver.vehicleDetails.plateNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Documents Status</h5>
                  <div className="mt-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      {driver.documentsUploaded ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          Documents uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-gray-400 mr-1" />
                          Pending documents
                        </>
                      )}
                    </div>
                    {driver.verificationDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Verified on {new Date(driver.verificationDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Cashout Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Process Cashout for {selectedDriver.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Wallet Address
                  </label>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                    {selectedDriver.walletAddress}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashoutAmount}
                    onChange={(e) => setCashoutAmount(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setSelectedDriver(null);
                      setCashoutAmount('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCashout(selectedDriver)}
                    disabled={!cashoutAmount || processingCashout === selectedDriver.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processingCashout === selectedDriver.id ? 'Processing...' : 'Process Cashout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverVerification;