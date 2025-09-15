import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cardsApi } from '../services/pocketbase';

interface CardProps {
  id: string;
  title: string;
  order: number;
  columnId: string;
  onCardUpdate: () => void;
}

const Card: React.FC<CardProps> = ({ id, title, order, columnId, onCardUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Konfiguracja sortable dla karty
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Obsługa edycji tytułu karty
  const handleEditTitle = async () => {
    if (!editedTitle.trim() || editedTitle.trim() === title) {
      setEditedTitle(title);
      setIsEditing(false);
      return;
    }

    try {
      await cardsApi.update(id, { title: editedTitle.trim() });
      setIsEditing(false);
      onCardUpdate();
    } catch (error) {
      console.error('Błąd podczas aktualizacji tytułu karty:', error);
      setEditedTitle(title); // Przywróć poprzedni tytuł
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  // Obsługa usuwania karty
  const handleDeleteCard = async () => {
    try {
      await cardsApi.delete(id);
      onCardUpdate();
    } catch (error) {
      console.error('Błąd podczas usuwania karty:', error);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-gray-700 rounded-lg shadow-md border border-gray-600 p-2 sm:p-3 mb-2 sm:mb-3 cursor-pointer hover:shadow-lg hover:border-gray-500 hover:bg-gray-600 transition-all duration-200 group relative ${
        isDragging ? 'opacity-50 shadow-2xl' : ''
      }`}
      data-card-id={id}
      data-column-id={columnId}
      data-order={order}
      data-testid={`card-${id}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between">
        {isEditing ? (
          <textarea
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="bg-transparent border-b-2 border-purple-500 text-xs sm:text-sm font-medium text-white leading-tight focus:outline-none resize-none flex-1 min-w-0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleEditTitle();
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            onBlur={handleEditTitle}
            rows={Math.max(1, editedTitle.split('\n').length)}
          />
        ) : (
          <h3 
            className="text-xs sm:text-sm font-medium text-white leading-tight cursor-pointer hover:text-purple-300 transition-colors flex-1 min-w-0 break-words"
            onClick={() => setIsEditing(true)}
            title="Kliknij aby edytować"
          >
            {title}
          </h3>
        )}
        
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              title="Edytuj kartę"
            >
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                title="Usuń kartę"
              >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              {showDeleteConfirm && (
                <div className="absolute right-0 top-6 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-10 min-w-32 sm:min-w-40">
                  <p className="text-xs text-white mb-2">
                    Usunąć kartę?
                  </p>
                  <div className="flex gap-1 flex-col sm:flex-row">
                    <button
                      onClick={handleDeleteCard}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors flex-1 sm:flex-none"
                    >
                      Usuń
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors flex-1 sm:flex-none"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
