import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Package, DollarSign } from 'lucide-react';
import adminAPI from '../../services/admin.service';
import StatsCard from '../../components/admin/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminAPI.getDashboard();
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const { stats, recentOrders, monthlySales, lowStockProducts } = data;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-display font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} color="accent" />
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={Package} color="blue" />
        <StatsCard title="Active Users" value={stats.totalUsers} icon={Users} color="green" />
        <StatsCard title="Products" value={stats.totalProducts} icon={ShoppingBag} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary border-b border-white/5">
                <tr>
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3">{order.orderNumber}</td>
                    <td className="py-3">{order.user.name}</td>
                    <td className="py-3">{formatDate(order.createdAt)}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full bg-surface text-xs">{order.status}</span>
                    </td>
                    <td className="py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <img src={product.image} alt="" className="w-10 h-10 rounded object-cover bg-surface" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                  <p className="text-xs text-red-400">{product.stock} remaining</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-sm text-text-secondary">All products are adequately stocked.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
