import PocketBase from 'pocketbase';

// Konfiguracja PocketBase
const pb = new PocketBase('http://localhost:8090');

// Wyłącz automatyczne anulowanie żądań
pb.autoCancellation(false);

// Typy danych
export interface ColumnData {
  id: string;
  title: string;
  order: number;
  created: string;
  updated: string;
}

export interface CardData {
  id: string;
  title: string;
  column: string; // ID kolumny
  order: number;
  created: string;
  updated: string;
}

export interface CreateColumnData {
  title: string;
  order: number;
}

export interface UpdateColumnData {
  title?: string;
  order?: number;
}

export interface CreateCardData {
  title: string;
  column: string;
  order: number;
}

export interface UpdateCardData {
  title?: string;
  column?: string;
  order?: number;
}

// API dla kolumn
export const columnsApi = {
  // Pobierz wszystkie kolumny
  async getAll(): Promise<ColumnData[]> {
    try {
      const records = await pb.collection('columns').getFullList<ColumnData>({
        sort: 'order',
      });
      return records;
    } catch (error) {
      console.error('Błąd podczas pobierania kolumn:', error);
      throw error;
    }
  },

  // Pobierz kolumnę po ID
  async getById(id: string): Promise<ColumnData> {
    try {
      const record = await pb.collection('columns').getOne<ColumnData>(id);
      return record;
    } catch (error) {
      console.error('Błąd podczas pobierania kolumny:', error);
      throw error;
    }
  },

  // Utwórz nową kolumnę
  async create(data: CreateColumnData): Promise<ColumnData> {
    try {
      const record = await pb.collection('columns').create<ColumnData>(data);
      return record;
    } catch (error) {
      console.error('Błąd podczas tworzenia kolumny:', error);
      throw error;
    }
  },

  // Zaktualizuj kolumnę
  async update(id: string, data: UpdateColumnData): Promise<ColumnData> {
    try {
      const record = await pb.collection('columns').update<ColumnData>(id, data);
      return record;
    } catch (error) {
      console.error('Błąd podczas aktualizacji kolumny:', error);
      throw error;
    }
  },

  // Usuń kolumnę
  async delete(id: string): Promise<boolean> {
    try {
      await pb.collection('columns').delete(id);
      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania kolumny:', error);
      throw error;
    }
  },
};

// API dla kart
export const cardsApi = {
  // Pobierz wszystkie karty
  async getAll(): Promise<CardData[]> {
    try {
      const records = await pb.collection('cards').getFullList<CardData>({
        sort: 'order',
        expand: 'column',
      });
      return records;
    } catch (error) {
      console.error('Błąd podczas pobierania kart:', error);
      throw error;
    }
  },

  // Pobierz karty dla konkretnej kolumny
  async getByColumn(columnId: string): Promise<CardData[]> {
    try {
      const records = await pb.collection('cards').getFullList<CardData>({
        filter: `column = "${columnId}"`,
        sort: 'order',
      });
      return records;
    } catch (error) {
      console.error('Błąd podczas pobierania kart dla kolumny:', error);
      throw error;
    }
  },

  // Pobierz kartę po ID
  async getById(id: string): Promise<CardData> {
    try {
      const record = await pb.collection('cards').getOne<CardData>(id);
      return record;
    } catch (error) {
      console.error('Błąd podczas pobierania karty:', error);
      throw error;
    }
  },

  // Utwórz nową kartę
  async create(data: CreateCardData): Promise<CardData> {
    try {
      const record = await pb.collection('cards').create<CardData>(data);
      return record;
    } catch (error) {
      console.error('Błąd podczas tworzenia karty:', error);
      throw error;
    }
  },

  // Zaktualizuj kartę
  async update(id: string, data: UpdateCardData): Promise<CardData> {
    try {
      const record = await pb.collection('cards').update<CardData>(id, data);
      return record;
    } catch (error) {
      console.error('Błąd podczas aktualizacji karty:', error);
      throw error;
    }
  },

  // Usuń kartę
  async delete(id: string): Promise<boolean> {
    try {
      await pb.collection('cards').delete(id);
      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania karty:', error);
      throw error;
    }
  },
};

// Funkcja do inicjalizacji domyślnych danych
export const initializeDefaultData = async (): Promise<void> => {
  try {
    const existingColumns = await columnsApi.getAll();
    
    if (existingColumns.length === 0) {
      console.log('🔧 Tworzenie domyślnych kolumn...');
      
      await columnsApi.create({ title: 'Do zrobienia', order: 1 });
      await columnsApi.create({ title: 'W trakcie', order: 2 });
      await columnsApi.create({ title: 'Zrobione', order: 3 });
      
      console.log('✅ Domyślne kolumny utworzone');
    }
  } catch (error) {
    console.error('Błąd podczas inicjalizacji domyślnych danych:', error);
  }
};

export default pb;
