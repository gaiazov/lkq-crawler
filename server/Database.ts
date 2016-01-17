import mongodb = require('mongodb');

import {Car} from "./model/Car";

export class Database {
  public connect():Promise<mongodb.Db> {
    return new Promise<mongodb.Db>((resolve, reject) => {
    var server: mongodb.Server = new mongodb.Server('localhost', 27017);
    var db = new mongodb .Db('lkq_crawler', server, { w: 1 });
    db.open((err) => {
      console.log("connected " + err);
      resolve(db);
    });
  });
}

  public insert(db:mongodb.Db, car:Car):Promise<Car> {

    return new Promise<Car>((resolve, reject) => {
      db.collection("cars").insertOne(car, (err, result:Car) => {
        console.log("Inserted a document into the restaurants collection.");

        if (err) {
          reject(err);

        } else {
          resolve(result);
        }
      });
    });
  }
}
