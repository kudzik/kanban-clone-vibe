// Test API PocketBase - wersja dla publicznych kolekcji
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function testPublicApi() {
  try {
    console.log('🧪 Testowanie publicznego API PocketBase...\n');
    
    // Test 1: Sprawdź połączenie
    console.log('1️⃣ Test połączenia...');
    const health = await pb.health.check();
    console.log('✅ Połączenie działa:', health);
    
    // Test 2: Pobierz kolumny (publiczne)
    console.log('\n2️⃣ Test pobierania kolumn...');
    try {
      const columns = await pb.collection('columns').getFullList({
        sort: 'order'
      });
      console.log('📋 Kolumny:', columns.map(c => `${c.title} (order: ${c.order})`));
    } catch (error) {
      console.log('⚠️ Kolekcja "columns" nie istnieje lub nie jest publiczna');
      console.log('   Sprawdź konfigurację w panelu administracyjnym: http://localhost:8090/_/');
    }
    
    // Test 3: Pobierz karty (publiczne)
    console.log('\n3️⃣ Test pobierania kart...');
    try {
      const cards = await pb.collection('cards').getFullList({
        sort: 'order'
      });
      console.log('🃏 Karty:', cards.map(c => `${c.title} (column: ${c.column})`));
    } catch (error) {
      console.log('⚠️ Kolekcja "cards" nie istnieje lub nie jest publiczna');
      console.log('   Sprawdź konfigurację w panelu administracyjnym: http://localhost:8090/_/');
    }
    
    // Test 4: Utwórz testową kolumnę (jeśli kolekcja istnieje)
    console.log('\n4️⃣ Test tworzenia kolumny...');
    try {
      const testColumn = await pb.collection('columns').create({
        title: 'Test Kolumna API',
        order: 999
      });
      console.log('✅ Kolumna utworzona:', testColumn.title);
      
      // Usuń testową kolumnę
      await pb.collection('columns').delete(testColumn.id);
      console.log('🗑️ Testowa kolumna usunięta');
      
    } catch (error) {
      console.log('⚠️ Nie można utworzyć kolumny:', error.message);
    }
    
    console.log('\n📊 Panel administracyjny: http://localhost:8090/_/');
    console.log('🔗 API endpoint: http://localhost:8090/api/');
    console.log('📖 Instrukcje konfiguracji: POCKETBASE_SETUP.md');
    
  } catch (error) {
    console.error('❌ Błąd podczas testowania API:', error.message);
  }
}

// Uruchom testy
testPublicApi();
