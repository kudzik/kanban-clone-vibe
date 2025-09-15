import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      <div className="container mx-auto px-4 py-8">
        {/* Nagłówek */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Kanban Board
          </h1>
        </div>

        {/* Tablica z kolumnami */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                />
              ))
          ) : (
            <div className="w-full text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-300 mb-2">Brak kolumn do wyświetlenia</p>
              <p className="text-sm text-gray-400">
                Sprawdź czy PocketBase działa i czy dane zostały załadowane
              </p>
            </div>
          )}
        </div>

        {/* Przycisk dodawania nowej kolumny */}
        <div className="mt-6">
          {isAddingColumn ? (
            <div className="bg-gray-800 rounded-xl shadow-xl p-4 w-80 flex-shrink-0 border border-gray-700">
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
              <div className="flex gap-2">
                <button
                  onClick={handleAddColumn}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                >
                  Dodaj listę
                </button>
                <button
                  onClick={handleCancelAddColumn}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingColumn(true)}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 border border-purple-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add another list
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
