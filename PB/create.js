import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// example create data
const data = {
    "title": "test",
    "column": "RELATION_RECORD_ID",
    "order": 123
};

const record = await pb.collection('cards').create(data);
