import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'accent' }) => {
  const colorClasses = {
    accent: 'bg-accent/10 text-accent',
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
          {trend && <p className="text-xs text-green-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
