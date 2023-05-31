db.entities.dropIndexes();
db.entities.createIndex( {"_id.servicePath": 1, "_id.id": 1, "_id.type": 1} );
db.entities.createIndex( {"creDate": 1} );
db.entities.reIndex();
