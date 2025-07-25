import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, createUserProfile } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setFormData({
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        phone: userProfile.phone,
      });
    } catch (error) {
      setError('Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      const profileData = {
        userId: user.id,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
      };

      await createUserProfile(profileData);
      await loadProfile(); // Reload profile
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <div className="flex space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
            >
              Back to Shop
            </Button>
            <Button
              onClick={handleLogout}
              variant="danger"
            >
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="small"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>

          <div className="px-6 py-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstname}
                    onChange={(value) => setFormData({ ...formData, firstname: value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastname}
                    onChange={(value) => setFormData({ ...formData, lastname: value })}
                    required
                  />
                </div>
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  required
                />
                
                <div className="flex space-x-4">
                  <Button
                    onClick={handleSave}
                    loading={saving}
                    disabled={saving}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstname: profile?.firstname || '',
                        lastname: profile?.lastname || '',
                        phone: profile?.phone || '',
                      });
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.firstname || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.lastname || 'Not set'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not set'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
          </div>
          
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-sm text-gray-900">{profile?.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Status</label>
              <p className="mt-1 text-sm text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 