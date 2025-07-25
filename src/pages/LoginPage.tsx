import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { requestOtp } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async () => {
    if (!otpEmail || !/\S+@\S+\.\S+/.test(otpEmail)) {
      setErrors({ otpEmail: 'Please enter a valid email' });
      return;
    }
    
    try {
      setOtpLoading(true);
      await requestOtp(otpEmail);
      setErrors({});
      alert('OTP sent to your email!');
    } catch (error) {
      setErrors({ otpEmail: error instanceof Error ? error.message : 'Failed to send OTP' });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}
            
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="Enter your email"
              required
              error={errors.email}
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              placeholder="Enter your password"
              required
              error={errors.password}
            />
            
            <div>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShowOtpForm(!showOtpForm)}
                className="w-full"
              >
                {showOtpForm ? 'Hide OTP Request' : 'Request OTP'}
              </Button>
            </div>

            {showOtpForm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Request OTP</h3>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={otpEmail}
                    onChange={setOtpEmail}
                    placeholder="Enter email for OTP"
                    error={errors.otpEmail}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleOtpRequest}
                    loading={otpLoading}
                    disabled={otpLoading}
                    size="small"
                  >
                    Send OTP
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 