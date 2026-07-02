import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '../../hooks/useProducts';
import adminAPI from '../../services/admin.service';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatCurrency } from '../../utils/formatCurrency';
import Pagination from '../../components/common/Pagination';

const AdminProductsPage = () => {
  const { products, pagination, loading, fetchProducts } = useProducts();
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await adminAPI.deleteProduct(deleteId);
      toast.success('Product deleted');
      fetchProducts();
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !products.length) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold">Products</h1>
        <Link to="/admin/products/new" className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-text-secondary bg-surface/50">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" loading="lazy" />
                      <span className="font-medium max-w-[200px] truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category?.name}</td>
                  <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/${product.id}/edit`} className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-accent transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(product.id)} className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={(page) => fetchProducts({ page })} />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminProductsPage;
