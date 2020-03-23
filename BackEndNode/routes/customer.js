const express = require("express");
const router = express.Router();
const Customer = require('../models/CUSTOMER');
var objectID = require('mongodb').ObjectID;
const multer = require("multer");
const { ErrorHandler } = require('../helper/error')


// File upload settings  
const PATH = './uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

let upload = multer({
    storage: storage
});



//TEST
// router.get('/', (req, res) => {

//     res.send('We are on post');
// });


// GET request
// Description : Get all customer data
router.get('/', async (req, res, next) => {
    try {

        let sortId = req.query.sort == 'asc' ? 1 : -1
        const customers = await Customer.find().sort({ date: sortId });
        res.json(customers);

    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Something went wrong"
        });
    }

});


// GET request
// Description : Get searched customer data
router.get('/search', async (req, res, next) => {
    try {

        let searchKey = req.query.searchKey ? req.query.searchKey : "";
        let sortId = req.query.sort == 'asc' ? 1 : -1

        searchKey = '/'.concat(searchKey).concat('/');

        const customers = await Customer.find({ name: /kk/ })
            .sort({ date: sortId });

        res.json(customers);

    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Something went wrong"
        });
    }

});



// POST request
// Description : Add customer data
router.post('/', upload.single('image'), async (req, res, next) => {

    try {
        if (!req.file) {
            console.log("No file is available!");
            throw new ErrorHandler(404, 'Missing required file')
        }

        const { name, gender, address, city, state, country, hobbies } = req.body
        if (!name || !gender || !address || !city || !state || !country || !hobbies) {
            throw new ErrorHandler(404, 'Missing required fields')
        }

        console.log("req.file", req.file);

        let imageUrl = req.file ?
            process.env.HOST_NAME + process.env.PORT + '/uploads/' + req.file.filename
            : "";


        console.log("req.body", req.body);

        const customer = new Customer({
            name: name,
            gender: gender,
            address: address,
            city: city,
            state: state,
            country: country,
            photo: imageUrl,
            hobbies: hobbies,

        })

        const savedCustomerdata = await customer.save();
        res.json(savedCustomerdata)
        next();
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Something went wrong"
        });
    }

});


// PATCH request
// Description : Update customer data by customerId
router.patch('/:customerId', async (req, res, next) => {

    try {
        var userToUpdate = req.params.customerId;
        console.log("userToUpdate ", userToUpdate)
        if (!userToUpdate) {
            throw new ErrorHandler(400, 'Customer Id must be present')
        }
        const updatedCustomerdata = await Customer.update
            (
                {
                    _id: userToUpdate
                },
                {
                    $set:
                    {
                        "name": req.body.name,
                        "gender": req.body.gender,
                        "address": req.body.address,
                        "city": req.body.city,
                        "state": req.body.state,
                        "country": req.body.country,
                        "photo": req.body.photo,
                        "hobbies": req.body.hobbies
                    }
                }
            )
        console.log("updatedCustomerdata ", updatedCustomerdata)
        res.status(200).send(updatedCustomerdata);


    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Something went wrong"
        });
    }

});


// GET request
// Description : Get Specific customer data
router.get('/:customerId', async (req, res, next) => {
    try {
        console.log("Get Specific customer data")
        // if (!req.params.customerId){
        //     throw new ErrorHandler(400, 'Customer Id must be present')
        // }
        const customers = await Customer.findById(req.params.customerId);

        console.log("Specific customers", customers)
        if (!customers) {
            throw new ErrorHandler(404, "No customers are found!");

        }
        res.json(customers);

    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Something went wrong"
        });
    }
});

// DELETE request
// Description : Delete Specific customer data
router.delete('/:customerId', async (req, res, next) => {

    try {
        if (!req.params.customerId) {
            throw new ErrorHandler(400, 'Customer Id must be present')
        }
        const removedData = await Customer.remove({ _id: req.params.customerId });

        if (!removedData) {
            throw new ErrorHandler(404, 'Customer not found')
        }

        res.json(removedData);
        next();
    } catch (err) {
        res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Something went wrong"
        });
    }


});



module.exports = router