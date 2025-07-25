import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Divider, Alert, Space, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { requestOtp } from '../services/api';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState<string>('');

  const handleOtpRequest = async () => {
    const email = form.getFieldValue('email');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email first');
      return;
    }
    
    try {
      setOtpLoading(true);
      setError('');
      await requestOtp(email);
      setShowOtpInput(true);
      alert('OTP sent to your email! Please check your inbox.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      setError('');
      
      // Only send required fields to backend
      const registerData = {
        email: values.email,
        password: values.password,
        username: values.username,
        otp: values.otp,
      };
      
      await register(registerData);
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '500px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
            Create Your Account
          </Title>
          <Text type="secondary">
            Or{' '}
            <Link to="/login" style={{ color: '#1890ff' }}>
              sign in to your existing account
            </Link>
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
            closable
            onClose={() => setError('')}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Required Fields Section */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px', color: '#262626' }}>
              Required Information
            </Title>
            
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please enter your username!' },
                { min: 3, message: 'Username must be at least 3 characters!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter your username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirm your password"
                size="large"
              />
            </Form.Item>
          </div>

          {/* Optional Fields Section */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px', color: '#262626' }}>
              Optional Information
            </Title>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstname"
                  label="First Name"
                >
                  <Input 
                    placeholder="John"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastname"
                  label="Last Name"
                >
                  <Input 
                    placeholder="Doe"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="phone"
              label="Phone Number"
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="+1234567890"
                size="large"
              />
            </Form.Item>
          </div>

          {/* OTP Section */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px', color: '#262626' }}>
              Email Verification
            </Title>
            
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name="otp"
                style={{ flex: 1 }}
                rules={[
                  { required: true, message: 'Please enter OTP!' },
                  { len: 6, message: 'OTP must be 6 digits!' }
                ]}
              >
                <Input 
                  prefix={<KeyOutlined />} 
                  placeholder="Enter 6-digit OTP"
                  size="large"
                  disabled={!showOtpInput}
                  maxLength={6}
                />
              </Form.Item>
              <Button
                onClick={handleOtpRequest}
                loading={otpLoading}
                disabled={otpLoading || showOtpInput}
                size="large"
                type="default"
              >
                {showOtpInput ? 'Sent' : 'Request OTP'}
              </Button>
            </Space.Compact>
            
            {showOtpInput && (
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                OTP sent to <strong>{form.getFieldValue('email')}</strong>
              </Text>
            )}
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!showOtpInput}
              size="large"
              block
              style={{ 
                height: '48px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage; 