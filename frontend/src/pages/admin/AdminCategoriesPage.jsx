import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import adminAPI from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    try {
      const res = await adminAPI.getCategories();
      setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenModal = (cat = null) => {
    setEditCat(cat);
    reset(cat ? { name: cat.name, description: cat.description, image: cat.image, slug: cat.slug } : { name: '', description: '', image: '', slug: '' });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editCat) {
        await adminAPI.updateCategory(editCat.id, data);
        toast.success('Category updated');
      } else {
        await adminAPI.createCategory(data);
        toast.success('Category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteCategory(deleteId);
      toast.success('Category deleted');
      fetchCategories();
      setDeleteId(null);
    } catch (err) {
      toast.error('Cannot delete category with associated products');
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold">Categories</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2 py-2">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img src={cat.image || 'https://via.placeholder.com/150'} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(cat)} className="p-2 text-text-secondary hover:text-accent transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(cat.id)} className="p-2 text-text-secondary hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-display font-semibold mb-1">{cat.name}</h3>
            <p className="text-xs text-text-secondary mb-4 line-clamp-2">{cat.description}</p>
            <div className="mt-auto pt-4 border-t border-white/5 text-xs text-accent font-medium">
              {cat._count?.products || 0} Products
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editCat ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register('name', { required: 'Required' })} error={errors.name?.message} />
          <Input label="Slug" {...register('slug', { required: 'Required' })} error={errors.slug?.message} />
          <Input label="Image URL" {...register('image')} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Description</label>
            <textarea {...register('description')} className="input-field min-h-[80px]" />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">{editCat ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Ensure there are no products associated with it."
      />
    </div>
  );
};

export default AdminCategoriesPage;
