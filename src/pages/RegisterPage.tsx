import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { requestOtp } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstname: '',
    lastname: '',
    phone: '',
    otp: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.firstname) {
      newErrors.firstname = 'First name is required';
    }
    
    if (!formData.lastname) {
      newErrors.lastname = 'Last name is required';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await register(formData);
      navigate('/');
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email first' });
      return;
    }
    
    try {
      setOtpLoading(true);
      await requestOtp(formData.email);
      setOtpSent(true);
      setErrors({});
      alert('OTP sent to your email!');
    } catch (error) {
      setErrors({ otp: error instanceof Error ? error.message : 'Failed to send OTP' });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
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
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstname}
                onChange={(value) => setFormData({ ...formData, firstname: value })}
                placeholder="John"
                required
                error={errors.firstname}
              />
              
              <Input
                label="Last Name"
                value={formData.lastname}
                onChange={(value) => setFormData({ ...formData, lastname: value })}
                placeholder="Doe"
                required
                error={errors.lastname}
              />
            </div>
            
            <Input
              label="Username"
              value={formData.username}
              onChange={(value) => setFormData({ ...formData, username: value })}
              placeholder="johndoe"
              required
              error={errors.username}
            />
            
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="john@example.com"
              required
              error={errors.email}
            />
            
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="+1234567890"
              required
              error={errors.phone}
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
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword}
            />
            
            <div className="flex gap-2">
              <Input
                label="OTP Code"
                value={formData.otp}
                onChange={(value) => setFormData({ ...formData, otp: value })}
                placeholder="123456"
                required
                error={errors.otp}
                className="flex-1"
              />
              <div className="flex flex-col justify-end">
                <Button
                  onClick={handleOtpRequest}
                  loading={otpLoading}
                  disabled={otpLoading || otpSent}
                  size="small"
                  variant="outline"
                >
                  {otpSent ? 'Sent' : 'Send OTP'}
                </Button>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !otpSent}
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 