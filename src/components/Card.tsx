import React from 'react';

interface CardProps {
  id: string;
  title: string;
  order: number;
  columnId: string;
}

const Card: React.FC<CardProps> = ({ id, title, order, columnId }) => {
  return (
    <div 
      className="bg-gray-700 rounded-lg shadow-md border border-gray-600 p-3 mb-3 cursor-pointer hover:shadow-lg hover:border-gray-500 hover:bg-gray-600 transition-all duration-200 group"
      data-card-id={id}
      data-column-id={columnId}
      data-order={order}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-white leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default Card;
