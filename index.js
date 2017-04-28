"use strict"

var MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017/testKAVlex';

const find = (collection, callback) => {
    collection.find().toArray((err, items) => {
        if (err) return console.error(err);
        console.log('===================={');
        console.log(items);
        console.log('====================}');
        callback();
    });
}

MongoClient.connect(url, function(err, db) {
    if (err)
        return console.error(`Не удалось установить соединение для ${url}. Ошибка - ${err}`);

    console.log(`Соединение установлено для ${url}`);

    var names = db.collection('names');
    var namesArr = [
        {name: 'Алексей',   nametoupdate: 0},
        {name: 'Василий',   nametoupdate: 0},
        {name: 'Николай',   nametoupdate: 0},
        {name: 'Татьяна',   nametoupdate: 0},
        {name: 'Светлана',  nametoupdate: 1},
        {name: 'Виктор',    nametoupdate: 1},
        {name: 'Юлиана',    nametoupdate: 1}
    ];

    //1
    names.insert(namesArr, function(err, result) {
        if (err) return console.error(err);
        console.log('Данные записаны');
        //2
        find(names, () => {
            //3
            names.update({nametoupdate: 1}, {$set: {name: 'Мультиобновление'}}, {multi: true}, function (err, result) {
                if (err) return console.error(err);
                //4
                find(names, () => {
                    //5
                    names.remove({nametoupdate: 1}, function(err, result) {
                        if (err) return console.error(err);
                        find(names, () => {
                            names.remove(); //зачистим все, для повторного тестировая
                            db.close();
                        });
                    });
                });
            });
        });
    });
});