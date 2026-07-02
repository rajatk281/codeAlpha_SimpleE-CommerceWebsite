import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import userAPI from '../services/user.service';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: errorsProfile } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
    }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword }, reset: resetPassword } = useForm();

  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await userAPI.updateProfile(data);
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      setLoading(true);
      await userAPI.changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12 max-w-4xl">
      <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="glass-card p-2 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'password' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 glass-card p-6 md:p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
              <h2 className="text-xl font-display font-semibold">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" {...registerProfile('name', { required: 'Name is required' })} error={errorsProfile.name?.message} />
                <Input label="Email" value={user?.email} disabled className="opacity-50 cursor-not-allowed" />
              </div>
              <Input label="Phone" {...registerProfile('phone')} error={errorsProfile.phone?.message} />

              <h2 className="text-xl font-display font-semibold pt-4 border-t border-white/5">Address</h2>
              <Input label="Street Address" {...registerProfile('address')} error={errorsProfile.address?.message} />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="City" {...registerProfile('city')} error={errorsProfile.city?.message} />
                <Input label="State" {...registerProfile('state')} error={errorsProfile.state?.message} />
                <Input label="Pincode" {...registerProfile('pincode')} error={errorsProfile.pincode?.message} />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading}>Save Changes</Button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
              <h2 className="text-xl font-display font-semibold">Change Password</h2>
              <Input label="Current Password" type="password" {...registerPassword('oldPassword', { required: 'Required' })} error={errorsPassword.oldPassword?.message} />
              <Input label="New Password" type="password" {...registerPassword('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errorsPassword.newPassword?.message} />
              <Input label="Confirm New Password" type="password" {...registerPassword('confirmPassword', { required: 'Required' })} error={errorsPassword.confirmPassword?.message} />
              <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading}>Update Password</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
