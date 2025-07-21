import React from 'react';
import { motion } from 'framer-motion';

interface InterviewCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface CategoryCardProps {
  category: InterviewCategory;
  onClick: (category: InterviewCategory) => void;
  isSelected: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, isSelected }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
      className={`
        cursor-pointer p-6 rounded-xl border transition-all duration-300
        ${isSelected 
          ? 'bg-primary-200/20 border-primary-200 shadow-lg shadow-primary-200/20' 
          : 'bg-dark-200/50 border-dark-200 hover:bg-dark-200/80 hover:border-primary-200/50'
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{category.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">{category.name}</h3>
          <p className="text-light-100 text-sm mt-1">{category.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
