import * as express from "express";

import {Queue} from "./Queue";
import {Database} from "./Database";
import {Config} from "./model/Config";
import {ScrapeRequest} from "./model/ScrapeRequest";
import {Scraper} from "./model/Scraper";

var config = new Config();
var queue = new Queue(config.RABBITMQ_URL, config.SCRAPE_QUEUE);

queue.consume(consume);

function consume(data: ScrapeRequest) {
    console.log("scraping " + data.locationId + "; page " + data.page);
    new Scraper(data.page, data.locationId).scrape().then(
        cars => {

            var context = new Database();
            var db = context.connect().then(db => context.insert(db, cars[0]).then(() => {
              db.close();
              queue.publish(new ScrapeRequest(data.page + 1, data.locationId));
            },
          err => {
            console.log(err);
          }));

        },
        error => {
            if (error) {
                console.warn(error);
            }
        });
}
