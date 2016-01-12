var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var underscore = require("underscore");
var app     = express();

app.get('/scrape', function(req, res) {

    var baseUrl = "http://www.lkqpickyourpart.com/DesktopModules/pyp_vehicleInventory/getVehicleInventory.aspx";

    //"?store=207&page=10&filter=&sp=&cl=&carbuyYardCode=1208&pageSize=15";
    var url = baseUrl + "?store=207&filter=&sp=&cl=&carbuyYardCode=1208&pageSize=100";


    scrape(url + "&page=0", function(cars) {
        res.json(cars);
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

function scrape(url, callback) {
    var cars = [];

    request(url, function (error, response, html) {
        if (error) {
            console.error(error);
            callback(null);
        }

        var $ = cheerio.load(html);

        if ($(".dnnFormWarning").length > 0) {
            callback(null);
        }

        $("tr").each(function () {
            var $row = $(this);
            var model = $row.find(".pypvi_model").text();
            var year = $row.find(".pypvi_year").text();
            var date = $row.find(".pypvi_date").text();
            var image = $row.find(".pypvi_image a").attr("href");
            image = image.substr(0, image.indexOf("?"));

            var make = $row.find(".pypvi_make").first().contents().filter(function () {
                return this.nodeType == 3;
            }).text();

            var car = {
                model: model,
                make: make,
                year: year,
                date: date,
                image: image
            };

            $row.find(".pypvi_notes p").each(function() {
                var $note = $(this);
                var noteArray = $note.text().split(":");
                car[noteArray[0].toLowerCase().replace(" ", "_")] = noteArray[1];
            });


            cars.push(car);

        });


        callback(cars);
    });
}

app.set('json spaces', 2);
app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;