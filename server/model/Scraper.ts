import * as request from "request";
import * as underscore from "underscore";
import * as cheerio from "cheerio";

var URI = require('urijs');

import {Car} from "./Car";

export class Scraper {
  private static BASE_URL = "http://www.lkqpickyourpart.com/DesktopModules/pyp_vehicleInventory/getVehicleInventory.aspx";

  constructor(private page:number, private locationId:number) {
  }

  private buildUrl():string {
    var url = new URI(Scraper.BASE_URL).query({
      page: this.page,
      store: this.locationId,
      carbuyYardCode: "1" + this.locationId,
      pageSize: 100
    });

    return url.toString();
  }

  public scrape():Promise<Car[]> {
    var cars:Car[] = [];

    return new Promise<Car[]>((resolve, reject) => {

      var url = this.buildUrl();
      //console.log("scraping " + url);

      request(url, (error, response, html) => {
        if (error) {
          resolve(error);
        }

        var $ = cheerio.load(html);

        if ($(".dnnFormWarning").length > 0) {
          reject(null);
        }

        $("tr").each(function () {
          var $row = $(this);
          var model = $row.find(".pypvi_model").text();
          var year = parseInt($row.find(".pypvi_year").text());
          var dateString = $row.find(".pypvi_date").text();
          var date = new Date(dateString);
          var image = $row.find(".pypvi_image a").attr("href");
          if (image && image.indexOf("?") > 0) {
            image = image.substr(0, image.indexOf("?"));
          }

          var make = $row.find(".pypvi_make").first().contents().filter(function () {
            return this.nodeType == 3;
          }).text();

          var car = {
            Model: model,
            Make: make,
            Year: year,
            Date: date,
            Image: image
          };

          $row.find(".pypvi_notes p").each(function () {
            var $note = $(this);
            var noteArray = $note.text().split(":");
            car[noteArray[0].toLowerCase().replace(" ", "_")] = noteArray[1].trim();
          });

          cars.push(car);
        });

        resolve(cars);
      });
    });
  }
}
