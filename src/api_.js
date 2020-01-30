const express = require('express');

const serverless = require('serverless-http');

const app = express();

const router = express.Router();

const axios = require('axios');

const request = require('request');

const cors = require('cors');

app.use(cors())

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

router.get('/fetch',(req,res)=>{
    axios.get('https://confluence-cab62.firebaseio.com/data.json')
    .then(data =>{
        if(!data){
            return res.status(404).json({
                message:"Not found!"
            })
        }
        res.status(200).json({
            message: "success",
            data:data.data,
        })
    })
    .catch(err=>{
        res.json({
            message: "Unable to fetch data "+err,
        })
        console.log(err.message)
    })
})

router.get('/smartsheet',(req,res)=>{
   smartsheet.sheets.getSheet({id: 6051615279998852})
    .then(data =>{
        if(!data){
            return res.status(404).json({
                message:"Not found!"
            })
        }
        res.status(200).json({
            message: "success",
            data:data,
        })
    })
    .catch(err=>{
        res.json({
            message: "Unable to fetch data "+err,
        })
        console.log(err.message)
    })
})


// var countryName = 'US';
router.get('/confluence',(req,res)=>{
	var options = {
	    method: 'GET',
	    url: 'https://yapihew.atlassian.net/wiki/rest/api/content',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Basic eWFwaWhldzY3NUBtYWlsZmlsZS5vcmc6ZDA5Y0hIeEhCMVdlbWM2RzVLemVBNUUw'
		  }
	};

	request(options, function (error, response, body) {
	   if (error){
		   throw new Error(error);
		    res.json({
				message: "Unable to fetch data "+err,
			})
	   }
	   res.status(200).json(body)	   
	   console.log(
		  'Response: ' + response.statusCode + ' ' + response.statusMessage
	   );
	   console.log(body);
	});
    
})


app.use('/.netlify/functions/api', router);


module.exports.handler = serverless(app);