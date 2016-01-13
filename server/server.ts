import * as express from "express";
import * as underscore from "underscore";

import {Scraper} from "./model/Scraper";

var app = express();

app.get('/scrape', (req, res) => {

    var baseUrl = "http://www.lkqpickyourpart.com/DesktopModules/pyp_vehicleInventory/getVehicleInventory.aspx";

    //"?store=207&page=10&filter=&sp=&cl=&carbuyYardCode=1208&pageSize=15";
    var url = baseUrl + "?store=207&filter=&sp=&cl=&carbuyYardCode=1208&pageSize=100";
    var scraper = new Scraper(0, 208).Scrape().then(cars => {
      new Scraper(1, 208).Scrape().then(cars2 => {
        res.json(cars.concat(cars2));
      })
    });
});

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
