import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-primary">
      <AdminSidebar />
      <motion.main
        className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default AdminLayout;
