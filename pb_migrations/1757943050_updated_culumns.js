/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cozsum64s1667rv")

  collection.name = "columns"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cozsum64s1667rv")

  collection.name = "culumns"

  return dao.saveCollection(collection)
})
