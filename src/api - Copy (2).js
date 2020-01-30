const express = require('express');

const serverless = require('serverless-http');

const app = express();

const router = express.Router();

const axios = require('axios');

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
router.get('/smartsheet/:country',(req,res)=>{
   smartsheet.sheets.getSheet({id: 6051615279998852}).then(data =>{
	   
	    var countryName = req.params.country;
        
		// var res = data.data;
	CountryDataNames = ['IN', 'NZ'];
		function myFunction(CountryName){
			CountryData = ['IN'];
			
			CountryData.push(CountryName)
			// for(var i = 0; i < data.data.rows.length; i++) {
				// if(data.data.rows[i].cells[2].value != undefined && data.data.rows[i].cells[2].value == CountryName){
					// CountryData.push(data.data.rows[i])
					console.log(CountryData);
				// }
			// }
			return CountryData;
		}
		
		// CountryData = [];
		// for(var i = 0; i < response.data.rows.length; i++) {
			// if(response.data.rows[i].cells[2].value != undefined && response.data.rows[i].cells[2].value == CountryName){
				// CountryData.push(response.data.rows[i])
				// console.log(CountryData);
			// }
		// }
		var oppp = myFunction(CountryName);
		
		
		res.status(200).json({
            message: "success",
			// text: CountryDataNames,
			// countryData: oppp,
            data: CountryDataNames
        })
		
		// {
            // message: "success",
            // data: data
        // }

		// CountryData = [];
		// for(var i = 0; i < response.data.rows.length; i++) {
			// if(response.data.rows[i].cells[2].value != undefined && response.data.rows[i].cells[2].value == CountryName){
				// CountryData.push(response.data.rows[i])
				// console.log(CountryData);
			// }
		// }
        // res.status(200).json({
            // message: "success",
            // data:data,
        // })
    })
    .catch(err=>{
		 var countryName = req.params.country;
        res.json({
            message: err,
			code: `${countryName} doesn't exist`
        })
        // console.log(err.message)
    })
})


app.use('/.netlify/functions/api', router);


module.exports.handler = serverless(app);