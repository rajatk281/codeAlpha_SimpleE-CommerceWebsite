import Input from '../common/Input';

const ShippingForm = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-display font-semibold mb-4">Shipping Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" id="name" placeholder="John Doe" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} error={errors.name?.message} />
        <Input label="Email" id="email" type="email" placeholder="john@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} error={errors.email?.message} />
      </div>
      <Input label="Phone" id="phone" placeholder="9876543210" {...register('phone', { required: 'Phone is required', minLength: { value: 10, message: 'Min 10 digits' } })} error={errors.phone?.message} />
      <Input label="Address" id="address" placeholder="123 Main Street, Apt 4B" {...register('address', { required: 'Address is required', minLength: { value: 5, message: 'Min 5 characters' } })} error={errors.address?.message} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="City" id="city" placeholder="Mumbai" {...register('city', { required: 'City is required' })} error={errors.city?.message} />
        <Input label="State" id="state" placeholder="Maharashtra" {...register('state', { required: 'State is required' })} error={errors.state?.message} />
        <Input label="Pincode" id="pincode" placeholder="400001" {...register('pincode', { required: 'Pincode is required', minLength: { value: 5, message: 'Min 5 digits' } })} error={errors.pincode?.message} />
      </div>
    </div>
  );
};

export default ShippingForm;
