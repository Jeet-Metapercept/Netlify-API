delete process.env["DEBUG_FD"];
const express = require('express');

const serverless = require('serverless-http');

const app = express();

const router = express.Router();

const axios = require('axios');

const request = require('request');

const cors = require('cors');

const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Initialize the client
var client = require('smartsheet');
var smartsheet = client.createClient({
    accessToken: '26ewfyvoncsebvkpke6bne8o95',
    logLevel: 'info'
});

// The `smartsheet` variable now contains access to all of the APIs

// Set queryParameters for `include` and pagination
var options = {
    queryParameters: {
        include: "attachments",
        includeAll: true
    }
};


router.get('/', (req, res) => {
    res.json({
        'hello': 'hi'
    });
});

router.get('/test', (req, res) => {
    res.json({
        'hello': 'texting'
    });
});

router.get('/fetch', (req, res) => {
    axios.get('https://confluence-cab62.firebaseio.com/data.json')
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    message: "Not found!"
                })
            }
            res.status(200).json({
                message: "success",
                data: data.data,
            })
        })
        .catch(err => {
            res.json({
                message: "Unable to fetch data " + err,
            })
            console.log(err.message)
        })
})

router.get('/smartsheet', (req, res) => {
    smartsheet.sheets.getSheet({
            id: 6051615279998852
        })
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    message: "Not found!"
                })
            }
            res.status(200).json({
                message: "success",
                data: data,
            })
        })
        .catch(err => {
            res.json({
                message: "Unable to fetch data " + err,
            })
            console.log(err.message)
        })
})



// var countryName = 'US';
router.get('/smartsheet/:country', (req, res) => {


    var countryName = req.params.country;


    CountryDataNames = [{
            "id": "tt0110357",
            "name": "The Lion King",
            "genre": "animation",
            "country": "US"
        },
        {
            "id": "tt0068646",
            "name": "The Godfather",
            "genre": "crime",
            "country": "IN"
        },
        {
            "id": "tt0468569",
            "name": "The Dark Knight",
            "genre": "action",
            "country": "Japan"
        },
    ]
    const itemfind = CountryDataNames.find(i => i.country === countryName);

    function givedata() {
        return CountryDataNames.find(i => i.country === countryName)
    }

    if (itemfind) {
        res.status(200).json({
            message: "success",
            data: itemfind
        })
    } else {
        res.json({
            message: `Country ${countryName} doesn't exist`
        })
    }

})


// Confulence Create page 
router.get('/confluence/:countryName/:countryCode', (req, res) => {

    var templateId = 83263539;
    //getting template with id
    var options = {
        method: 'GET',
        url: 'https://strykercpib.atlassian.net/wiki/rest/api/template/' + templateId,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic cmF5QGFwcG1haXN0ZXJzLmNvbTpqcXpFcWlRVEl2MTlKSDBXeHdrczNGOTE='
        }
    }

    request(options, function (error, response, body) {

        if (error) {
            res.json({
                message: "error : ",
                error
            })
        }

        // console.log(body);

        const templateData = JSON.parse(body); //to access inside object
        var temp = JSON.stringify(templateData.body.storage.value);

        // changing Variable
        var resbody = temp.replace(/uniquecountrycode/g, req.params.countryCode);
        resbody = resbody.replace(/uniquecountryname/g, req.params.countryName);

        var bodyData = `{
                "title":"${req.params.countryName}",
                "type":"page",
                "space":{"key":"PS"},
                "status":"current",
                "ancestors": [{
                    "id": "20611175"
                  }],
                "body":{
                    "storage":{
                        "representation":"storage",
                        "value": ${resbody}
                    }
                }
            }`;

        // create page with template body
        var options_for_page = {
            method: 'POST',
            url: 'https://strykercpib.atlassian.net/wiki/rest/api/content',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic cmF5QGFwcG1haXN0ZXJzLmNvbTpqcXpFcWlRVEl2MTlKSDBXeHdrczNGOTE='
            },
            body: bodyData
        };

        request(options_for_page, function (error, response, body) {
            //if (error) throw new Error(error);
            if (error) {
                // throw new Error(error);
                res.json({
                    message: "error : ",
                    error
                });
            }
            console.log(
                'Response: ' + response.statusCode + ' ' + response.statusMessage
            );

            // res.send(body)
            res.status(200).json({
                message: "Page " + req.params.countryName + "successfully created.",
                data: body
            })
        });


    });



})



app.use('/.netlify/functions/api', router);


module.exports.handler = serverless(app);