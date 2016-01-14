import * as express from "express";

import {Queue} from "./Queue";
import {Config} from "./model/Config";
import {ScrapeRequest} from "./model/ScrapeRequest";
import {Scraper} from "./model/Scraper";

var config = new Config();
var queue = new Queue(config.RABBITMQ_URL, config.SCRAPE_QUEUE);

queue.consume(consume);

function consume(data:ScrapeRequest) {
  console.log("scraping " + data.locationId + "; page " + data.page);
  new Scraper(data.page, data.locationId).scrape().then(cars => {
    console.log(cars.length + " cars scraped");
    queue.publish(new ScrapeRequest(data.page + 1, data.locationId));
  },
  error => {
    console.warn(error);
  });
}
