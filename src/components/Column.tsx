import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card';
import { columnsApi, cardsApi } from '../services/pocketbase';
import type { CardData, CreateCardData } from '../services/pocketbase';

interface ColumnProps {
  id: string;
  title: string;
  order: number;
  cards: CardData[];
  onColumnUpdate: () => void;
  onCardUpdate: () => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, order, cards, onColumnUpdate, onCardUpdate }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Konfiguracja sortable dla kolumny
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Konfiguracja droppable dla kolumny (aby karty mogły być upuszczane)
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  // Obsługa edycji tytułu kolumny
  const handleEditTitle = async () => {
    if (!editedTitle.trim() || editedTitle.trim() === title) {
      setEditedTitle(title);
      setIsEditingTitle(false);
      return;
    }

    try {
      await columnsApi.update(id, { title: editedTitle.trim() });
      setIsEditingTitle(false);
      onColumnUpdate();
    } catch (error) {
      console.error('Błąd podczas aktualizacji tytułu kolumny:', error);
      setEditedTitle(title); // Przywróć poprzedni tytuł
    }
  };

  const handleCancelEditTitle = () => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  };

  // Obsługa usuwania kolumny
  const handleDeleteColumn = async () => {
    try {
      // Najpierw usuń wszystkie karty w kolumnie
      const columnCards = cards.filter(card => card.column === id);
      for (const card of columnCards) {
        await cardsApi.delete(card.id);
      }
      
      // Następnie usuń kolumnę
      await columnsApi.delete(id);
      onColumnUpdate();
    } catch (error) {
      console.error('Błąd podczas usuwania kolumny:', error);
    }
  };

  // Obsługa dodawania nowej karty
  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    try {
      const newCardData: CreateCardData = {
        title: newCardTitle.trim(),
        column: id,
        order: cards.length
      };

      await cardsApi.create(newCardData);
      setNewCardTitle('');
      setIsAddingCard(false);
      onCardUpdate();
    } catch (error) {
      console.error('Błąd podczas dodawania karty:', error);
    }
  };

  const handleCancelAddCard = () => {
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
      }}
      style={style}
      className={`${colors.bg} rounded-xl shadow-xl p-3 sm:p-4 min-h-80 sm:min-h-96 w-full sm:w-80 flex-shrink-0 flex flex-col border border-gray-700 snap-center ${
        isDragging ? 'opacity-50 shadow-2xl' : ''
      } ${
        isOver ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
      }`}
      data-column-id={id}
      data-order={order}
      data-testid={`column-${id}`}
      {...attributes}
      {...listeners}
    >
      {/* Nagłówek kolumny */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          {/* Drag handle */}
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors flex-shrink-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>
          
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className={`bg-transparent border-b-2 border-purple-500 text-base sm:text-lg font-semibold ${colors.header} focus:outline-none flex-1 min-w-0`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditTitle();
                } else if (e.key === 'Escape') {
                  handleCancelEditTitle();
                }
              }}
              onBlur={handleEditTitle}
            />
          ) : (
            <h2 
              className={`text-base sm:text-lg font-semibold ${colors.header} cursor-pointer hover:text-purple-300 transition-colors flex-1 min-w-0 truncate`}
              onClick={() => setIsEditingTitle(true)}
              title="Kliknij aby edytować tytuł"
            >
              {title}
            </h2>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {!isEditingTitle && (
            <button 
              onClick={() => setIsEditingTitle(true)}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              title="Edytuj tytuł"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
              title="Usuń kolumnę"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            {showDeleteConfirm && (
              <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg z-10 min-w-48">
                <p className="text-sm text-white mb-3">
                  Czy na pewno chcesz usunąć kolumnę "{title}"?
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Ta akcja usunie również wszystkie karty w tej kolumnie.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteColumn}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Usuń
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista kart */}
      <div className="flex-1 space-y-3 min-h-0">
        <SortableContext
          items={sortedCards.map(card => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.length > 0 ? (
            sortedCards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                order={card.order}
                columnId={card.column}
                onCardUpdate={onCardUpdate}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-8 sm:py-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium">Brak zadań</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">Dodaj nowe zadanie poniżej</p>
            </div>
          )}
        </SortableContext>
      </div>

      {/* Przycisk dodawania nowej karty */}
      {isAddingCard ? (
        <div className="mt-3 sm:mt-4">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Wprowadź tytuł karty..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3 resize-none text-sm sm:text-base"
            rows={3}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddCard();
              } else if (e.key === 'Escape') {
                handleCancelAddCard();
              }
            }}
          />
          <div className="flex gap-2 flex-col sm:flex-row">
            <button
              onClick={handleAddCard}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200 flex-1 sm:flex-none"
            >
              Dodaj kartę
            </button>
            <button
              onClick={handleCancelAddCard}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200 flex-1 sm:flex-none"
            >
              Anuluj
            </button>
          </div>
        </div>
      ) : (
        <button 
          className={`mt-3 sm:mt-4 w-full py-2 text-xs sm:text-sm ${colors.button} border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group`}
          onClick={() => setIsAddingCard(true)}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden sm:inline">Dodaj kartę</span>
          <span className="sm:hidden">Dodaj</span>
        </button>
      )}
    </div>
  );
};

export default Column;
