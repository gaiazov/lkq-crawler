import * as express from "express";

import {Queue} from "./Queue";
import {Config} from "./model/Config";
import {ScrapeRequest} from "./model/ScrapeRequest";

var app = express();

var config = new Config();
var queue = new Queue(config.RABBITMQ_URL, config.SCRAPE_QUEUE);

app.get('/scrape/:locationId', (req, res) => {
  var locationId = parseInt(req.params.locationId);
  scrape(locationId);
  res.send("scraping of location " + locationId + " queued");
});

function scrape(locationId:number) {
  console.log("Scraping " + locationId);
  queue.publish(new ScrapeRequest(0, locationId));
}

/*
 <tr>
 <td class="pypvi_image"><a id="11-14" class="fancybox-thumb" rel="fancybox-thumb" data-fancybox-type="image" href="https://documents.ekeyconnect.com/CarBuy/1208-2803-276713.jpeg?w=800" caption="<p>1998 MERCEDES-BENZ E320</p><p><p>Section: Imports</p><p>Row: J</p><p>Space Number: 6</p><p>Color: Gold</p></p><p>Available On: 12/31/2015</p><script>viewImage('11-14');$('.pypvi_imageListItem').click(function () {showFancyImage($(this).attr('src'))});</script>"><img src="https://documents.ekeyconnect.com/CarBuy/1208-2803-276713.jpeg?w=110&h=110"></a></td>
 <td class="pypvi_make">
 MERCEDES-BENZ
 <div class="pypvi_notes">
 <p>Section: Imports</p>
 <p>Row: J</p>
 <p>Space Number: 6</p>
 <p>Color: Gold</p>
 </div>
 </td>
 <td class="pypvi_model">E320</td>
 <td class="pypvi_year">1998</td>
 <td class="pypvi_date">12/31/2015</td>
 </tr>
 */


app.set('json spaces', 2);
app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
