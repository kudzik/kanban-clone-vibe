import React from 'react';
import Card from './Card';

interface CardData {
  id: string;
  title: string;
  order: number;
  column: string;
}

interface ColumnProps {
  id: string;
  title: string;
  order: number;
  cards: CardData[];
}

const Column: React.FC<ColumnProps> = ({ id, title, order, cards }) => {
  // Sortuj karty według kolejności
  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  // Kolor kolumny na podstawie tytułu - ciemny motyw
  const getColumnColor = (title: string) => {
    switch (title.toLowerCase()) {
      case 'to do':
      case 'do zrobienia':
        return {
          bg: 'bg-gray-800',
          header: 'text-white',
          button: 'text-gray-400 hover:text-white'
        };
      case 'in progress':
      case 'w trakcie':
        return {
          bg: 'bg-gray-800',
          header: 'text-white',
          button: 'text-gray-400 hover:text-white'
        };
      case 'done':
      case 'zrobione':
        return {
          bg: 'bg-gray-800',
          header: 'text-white',
          button: 'text-gray-400 hover:text-white'
        };
      default:
        return {
          bg: 'bg-gray-800',
          header: 'text-white',
          button: 'text-gray-400 hover:text-white'
        };
    }
  };

  const colors = getColumnColor(title);

  return (
    <div 
      className={`${colors.bg} rounded-xl shadow-xl p-4 min-h-96 w-80 flex-shrink-0 flex flex-col border border-gray-700`}
      data-column-id={id}
      data-order={order}
    >
      {/* Nagłówek kolumny */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${colors.header}`}>
          {title}
        </h2>
        <button className="text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Lista kart */}
      <div className="flex-1 space-y-3 min-h-0">
        {sortedCards.length > 0 ? (
          sortedCards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              order={card.order}
              columnId={card.column}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-sm font-medium">Brak zadań</p>
            <p className="text-xs text-gray-500 mt-1">Dodaj nowe zadanie poniżej</p>
          </div>
        )}
      </div>

      {/* Przycisk dodawania nowej karty */}
      <button 
        className={`mt-4 w-full py-2 text-sm ${colors.button} border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group`}
        onClick={() => {
          // TODO: Implementować dodawanie nowej karty
          console.log('Dodaj nową kartę do kolumny:', title);
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add a card
      </button>
    </div>
  );
};

export default Column;
