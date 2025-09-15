import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from './Column';
import { columnsApi, cardsApi } from '../services/pocketbase';
import type { ColumnData, CardData } from '../services/pocketbase';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [activeColumn, setActiveColumn] = useState<ColumnData | null>(null);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  // Konfiguracja sensorów dla drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Pobierz dane z API
  const fetchData = async () => {
    try {
      console.log('🔄 Rozpoczynam pobieranie danych...');
      setLoading(true);
      setError(null);

      // Test połączenia z PocketBase
      console.log('🔍 Testuję połączenie z PocketBase...');
      const healthCheck = await fetch('http://localhost:8090/api/health');
      console.log('🏥 Health check:', healthCheck.status);

      // Pobierz kolumny i karty równolegle
      const [columnsData, cardsData] = await Promise.all([
        columnsApi.getAll(),
        cardsApi.getAll()
      ]);

      console.log('📋 Pobrane kolumny:', columnsData);
      console.log('🃏 Pobrane karty:', cardsData);

      setColumns(columnsData);
      setCards(cardsData);
      
      console.log('✅ Dane zostały załadowane pomyślnie');
    } catch (err: unknown) {
      console.error('❌ Błąd podczas pobierania danych:', err);
      console.error('Szczegóły błędu:', err);
      
      // Sprawdź czy błąd jest wynikiem anulowania
      if (err && typeof err === 'object' && 'isAbort' in err && err.isAbort) {
        console.log('⚠️ Żądanie zostało anulowane, ignoruję błąd');
        return; // Nie ustawiaj błędu dla anulowanych żądań
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Nie udało się załadować danych. Błąd: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Pobierz dane przy pierwszym renderowaniu
  useEffect(() => {
    fetchData();
  }, []);

  // Grupuj karty według kolumn
  const getCardsForColumn = (columnId: string): CardData[] => {
    return cards.filter(card => card.column === columnId);
  };

  // Obsługa dodawania nowej kolumny
  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;

    try {
      const newColumn = await columnsApi.create({
        title: newColumnTitle.trim(),
        order: columns.length
      });

      setColumns(prev => [...prev, newColumn]);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    } catch (err) {
      console.error('Błąd podczas dodawania kolumny:', err);
    }
  };

  const handleCancelAddColumn = () => {
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  // Obsługa rozpoczęcia przeciągania
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Sprawdź czy przeciągana jest kolumna
    const column = columns.find(col => col.id === active.id);
    if (column) {
      setActiveColumn(column);
      return;
    }
    
    // Sprawdź czy przeciągana jest karta
    const card = cards.find(card => card.id === active.id);
    if (card) {
      setActiveCard(card);
      return;
    }
  };

  // Obsługa przeciągania nad elementami (dla kart między kolumnami)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Jeśli przeciągana jest karta
    const activeCard = cards.find(card => card.id === activeId);
    if (!activeCard) return;
    
    // Sprawdź czy upuszczamy na kolumnę
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      // Przenieś kartę do nowej kolumny
      if (activeCard.column !== overColumn.id) {
        setCards(cards => {
          const newCards = cards.map(card => {
            if (card.id === activeId) {
              return { ...card, column: overColumn.id };
            }
            return card;
          });
          return newCards;
        });
      }
      return;
    }
    
    // Sprawdź czy upuszczamy na inną kartę
    const overCard = cards.find(card => card.id === overId);
    if (overCard) {
      // Przenieś kartę do kolumny docelowej karty
      if (activeCard.column !== overCard.column) {
        setCards(cards => {
          const newCards = cards.map(card => {
            if (card.id === activeId) {
              return { ...card, column: overCard.column };
            }
            return card;
          });
          return newCards;
        });
      }
    }
  };

  // Obsługa zakończenia przeciągania
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveCard(null);

    if (!over || active.id === over.id) {
      return;
    }

    // Obsługa przeciągania kolumn
    const activeColumn = columns.find(col => col.id === active.id);
    if (activeColumn) {
      const overColumn = columns.find(col => col.id === over.id);
      if (!overColumn) return;

      const oldIndex = columns.findIndex(col => col.id === active.id);
      const newIndex = columns.findIndex(col => col.id === over.id);

      if (oldIndex === newIndex) return;

      const newColumns = [...columns];
      const [movedColumn] = newColumns.splice(oldIndex, 1);
      newColumns.splice(newIndex, 0, movedColumn);

      try {
        const updatePromises = newColumns.map((column, index) => 
          columnsApi.update(column.id, { order: index })
        );
        
        await Promise.all(updatePromises);
        
        setColumns(newColumns.map((column, index) => ({
          ...column,
          order: index
        })));
      } catch (error) {
        console.error('Błąd podczas aktualizacji kolejności kolumn:', error);
        fetchData();
      }
      return;
    }

    // Obsługa przeciągania kart
    const activeCard = cards.find(card => card.id === active.id);
    if (!activeCard) return;

    const overId = over.id;
    
    // Sprawdź czy upuszczamy na kolumnę
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      // Przenieś kartę do nowej kolumny na koniec
      const columnCards = cards.filter(card => card.column === overColumn.id);
      const newOrder = columnCards.length;
      
      try {
        await cardsApi.update(activeCard.id, {
          column: overColumn.id,
          order: newOrder
        });
        fetchData();
      } catch (error) {
        console.error('Błąd podczas przenoszenia karty:', error);
        fetchData();
      }
      return;
    }
    
    // Sprawdź czy upuszczamy na inną kartę
    const overCard = cards.find(card => card.id === overId);
    if (overCard) {
      const isOverSameColumn = activeCard.column === overCard.column;
      
      if (isOverSameColumn) {
        // Przesuń kartę w tej samej kolumnie
        const columnCards = cards
          .filter(card => card.column === activeCard.column)
          .sort((a, b) => a.order - b.order);
        
        const oldIndex = columnCards.findIndex(card => card.id === active.id);
        const newIndex = columnCards.findIndex(card => card.id === over.id);
        
        if (oldIndex === newIndex) return;
        
        const newCards = [...columnCards];
        const [movedCard] = newCards.splice(oldIndex, 1);
        newCards.splice(newIndex, 0, movedCard);
        
        try {
          const updatePromises = newCards.map((card, index) => 
            cardsApi.update(card.id, { order: index })
          );
          
          await Promise.all(updatePromises);
          fetchData();
        } catch (error) {
          console.error('Błąd podczas aktualizacji kolejności kart:', error);
          fetchData();
        }
      } else {
        // Przenieś kartę do innej kolumny
        const targetColumnCards = cards
          .filter(card => card.column === overCard.column)
          .sort((a, b) => a.order - b.order);
        
        const overIndex = targetColumnCards.findIndex(card => card.id === over.id);
        
        try {
          // Zaktualizuj kolejność kart w kolumnie docelowej
          const updatePromises = targetColumnCards.map((card, index) => {
            const newOrder = index >= overIndex ? index + 1 : index;
            return cardsApi.update(card.id, { order: newOrder });
          });
          
          await Promise.all(updatePromises);
          
          // Przenieś aktywną kartę
          await cardsApi.update(activeCard.id, {
            column: overCard.column,
            order: overIndex
          });
          
          fetchData();
        } catch (error) {
          console.error('Błąd podczas przenoszenia karty między kolumnami:', error);
          fetchData();
        }
      }
    }
  };

  // Obsługa błędów
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Błąd połączenia
            </h2>
            <p className="text-gray-300 mb-4">
              {error}
            </p>
            <button
              onClick={fetchData}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stan ładowania
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Ładowanie tablicy Kanban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800" data-testid="kanban-board">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Nagłówek */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 text-center sm:text-left">
            Kanban Board
          </h1>
          <p className="text-sm sm:text-base text-gray-300 text-center sm:text-left">
            Zarządzaj swoimi zadaniami w prosty i intuicyjny sposób
          </p>
        </div>

        {/* Tablica z kolumnami */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 sm:pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory">
            <SortableContext
              items={columns.map(col => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.length > 0 ? (
                columns
                  .sort((a, b) => a.order - b.order)
                  .map((column) => (
                    <Column
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      order={column.order}
                      cards={getCardsForColumn(column.id)}
                      onColumnUpdate={fetchData}
                      onCardUpdate={fetchData}
                    />
                  ))
              ) : (
            <div className="w-full text-center py-8 lg:py-16 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-300 mb-2">Brak kolumn do wyświetlenia</p>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                Sprawdź czy PocketBase działa i czy dane zostały załadowane
              </p>
            </div>
              )}
            </SortableContext>
          </div>
          
          {/* Drag Overlay dla wizualnego feedback podczas przeciągania */}
          <DragOverlay>
            {activeColumn ? (
              <div className="bg-gray-800 rounded-xl shadow-2xl p-4 min-h-96 w-80 flex-shrink-0 flex flex-col border border-gray-700 opacity-90 rotate-3 transform">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    {activeColumn.title}
                  </h2>
                </div>
                <div className="flex-1 space-y-3 min-h-0">
                  <div className="text-center text-gray-400 py-12">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Przeciąganie kolumny...</p>
                  </div>
                </div>
              </div>
            ) : activeCard ? (
              <div className="bg-gray-700 rounded-lg shadow-2xl border border-gray-600 p-3 opacity-90 rotate-2 transform">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium text-white leading-tight">
                    {activeCard.title}
                  </h3>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Przycisk dodawania nowej kolumny */}
        <div className="mt-4 sm:mt-6 flex justify-center sm:justify-start">
          {isAddingColumn ? (
            <div className="bg-gray-800 rounded-xl shadow-xl p-3 sm:p-4 w-full max-w-sm sm:w-80 flex-shrink-0 border border-gray-700">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Wprowadź tytuł listy..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddColumn();
                  } else if (e.key === 'Escape') {
                    handleCancelAddColumn();
                  }
                }}
              />
              <div className="flex gap-2 flex-col sm:flex-row">
                <button
                  onClick={handleAddColumn}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200 flex-1 sm:flex-none"
                >
                  Dodaj listę
                </button>
                <button
                  onClick={handleCancelAddColumn}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200 flex-1 sm:flex-none"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingColumn(true)}
              className="bg-purple-700 hover:bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 border border-purple-600 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add another list</span>
              <span className="sm:hidden">Dodaj listę</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
