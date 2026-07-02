import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import orderAPI from '../services/order.service';
import OrderCard from '../components/order/OrderCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrders({ page, limit: 10 });
        setOrders(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading && page === 1) return <LoadingSpinner fullScreen />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12">
      <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          message="You haven't placed any orders yet."
          action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default OrdersPage;
