import { motion } from "framer-motion";

const ErrorMessage = ({
  title = "Đã xảy ra lỗi",
  message = "Vui lòng thử lại sau",
  icon = "🚫",
  onRetry,
  retryText = "Thử lại",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300 transform hover:scale-105"
        >
          {retryText}
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
