import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {Icon && (
        <div className="w-20 h-20 rounded-2xl bg-surface/60 flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-text-secondary/50" />
        </div>
      )}
      <h3 className="text-xl font-display font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm text-center max-w-md mb-6">{message}</p>
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
