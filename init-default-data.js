// Inicjalizacja domyślnych danych dla Kanban
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function initializeDefaultData() {
  try {
    console.log('🔧 Inicjalizacja domyślnych danych Kanban...\n');
    
    // Sprawdź czy kolumny już istnieją
    const existingColumns = await pb.collection('columns').getFullList({
      sort: 'order'
    });
    
    if (existingColumns.length === 0) {
      console.log('📋 Tworzenie domyślnych kolumn...');
      
      const todoColumn = await pb.collection('columns').create({
        title: 'Do zrobienia',
        order: 1
      });
      console.log('✅ Kolumna utworzona:', todoColumn.title);
      
      const inProgressColumn = await pb.collection('columns').create({
        title: 'W trakcie',
        order: 2
      });
      console.log('✅ Kolumna utworzona:', inProgressColumn.title);
      
      const doneColumn = await pb.collection('columns').create({
        title: 'Zrobione',
        order: 3
      });
      console.log('✅ Kolumna utworzona:', doneColumn.title);
      
      // Utwórz przykładowe karty
      console.log('\n🃏 Tworzenie przykładowych kart...');
      
      await pb.collection('cards').create({
        title: 'Przykładowe zadanie 1',
        column: todoColumn.id,
        order: 1
      });
      console.log('✅ Karta utworzona: Przykładowe zadanie 1');
      
      await pb.collection('cards').create({
        title: 'Przykładowe zadanie 2',
        column: todoColumn.id,
        order: 2
      });
      console.log('✅ Karta utworzona: Przykładowe zadanie 2');
      
      await pb.collection('cards').create({
        title: 'Zadanie w trakcie',
        column: inProgressColumn.id,
        order: 1
      });
      console.log('✅ Karta utworzona: Zadanie w trakcie');
      
      await pb.collection('cards').create({
        title: 'Ukończone zadanie',
        column: doneColumn.id,
        order: 1
      });
      console.log('✅ Karta utworzona: Ukończone zadanie');
      
      console.log('\n🎉 Domyślne dane zostały utworzone!');
      
    } else {
      console.log('ℹ️ Kolumny już istnieją:', existingColumns.map(c => c.title));
      
      // Sprawdź karty
      const existingCards = await pb.collection('cards').getFullList();
      console.log('ℹ️ Karty:', existingCards.length, 'znalezionych');
    }
    
    // Wyświetl podsumowanie
    console.log('\n📊 Podsumowanie:');
    const allColumns = await pb.collection('columns').getFullList({ sort: 'order' });
    const allCards = await pb.collection('cards').getFullList();
    
    console.log('📋 Kolumny:', allColumns.length);
    allColumns.forEach(col => {
      console.log(`   - ${col.title} (order: ${col.order})`);
    });
    
    console.log('🃏 Karty:', allCards.length);
    allCards.forEach(card => {
      console.log(`   - ${card.title} (column: ${card.column})`);
    });
    
    console.log('\n🌐 Panel administracyjny: http://localhost:8090/_/');
    console.log('🔗 API endpoint: http://localhost:8090/api/');
    
  } catch (error) {
    console.error('❌ Błąd podczas inicjalizacji:', error.message);
    console.log('\n💡 Upewnij się, że:');
    console.log('   1. PocketBase działa na http://localhost:8090');
    console.log('   2. Kolekcje "columns" i "cards" zostały utworzone');
    console.log('   3. Kolekcje mają ustawione uprawnienia publiczne');
    console.log('   4. Sprawdź instrukcje w POCKETBASE_SETUP.md');
  }
}

// Uruchom inicjalizację
initializeDefaultData();
