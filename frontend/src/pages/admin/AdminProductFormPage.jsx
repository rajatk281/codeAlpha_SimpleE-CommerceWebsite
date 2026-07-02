import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import adminAPI from '../../services/admin.service';
import productAPI from '../../services/product.service';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: { isActive: true, featured: false, images: '' }
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await adminAPI.getCategories();
        setCategories(res.data.data);
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCats();

    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await productAPI.getProductBySlug(id); // backend handles both id/slug for fetching, assume it works if we use admin API or just modify
          // Actually, our public route gets by slug. For admin edit, we might need a specific getById or just let it fetch
          const p = res.data.data;
          reset({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            compareAtPrice: p.compareAtPrice || '',
            image: p.image,
            images: p.images?.join(', ') || '',
            categoryId: p.categoryId,
            stock: p.stock,
            isActive: p.isActive,
            featured: p.featured
          });
        } catch (err) {
          toast.error('Failed to load product');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        price: Number(data.price),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
        stock: Number(data.stock),
        images: data.images ? data.images.split(',').map(s => s.trim()) : [],
      };

      if (isEdit) {
        await adminAPI.updateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await adminAPI.createProduct(payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </Link>

      <h1 className="text-2xl font-display font-bold mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold mb-2">Basic Info</h2>
          <Input label="Product Name" {...register('name', { required: 'Required' })} error={errors.name?.message} />
          <Input label="Slug (URL friendly)" {...register('slug', { required: 'Required' })} error={errors.slug?.message} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Description</label>
            <textarea
              {...register('description', { required: 'Required' })}
              className="input-field min-h-[100px]"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold mb-2">Pricing & Inventory</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹)" type="number" step="0.01" {...register('price', { required: 'Required', min: 0 })} error={errors.price?.message} />
            <Input label="Compare At Price (₹)" type="number" step="0.01" {...register('compareAtPrice')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Category</label>
              <select {...register('categoryId', { required: 'Required' })} className="input-field py-2.5">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-red-400 mt-1">{errors.categoryId.message}</p>}
            </div>
            <Input label="Stock" type="number" {...register('stock', { required: 'Required', min: 0 })} error={errors.stock?.message} />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold mb-2">Images</h2>
          <Input label="Main Image URL" {...register('image', { required: 'Required' })} error={errors.image?.message} />
          <Input label="Additional Images (Comma separated URLs)" {...register('images')} />
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold mb-2">Visibility</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-surface" />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-surface" />
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link to="/admin/products" className="btn-secondary py-2.5 px-6">Cancel</Link>
          <Button type="submit" loading={saving}>{isEdit ? 'Update Product' : 'Create Product'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
