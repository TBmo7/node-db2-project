const express = require('express');
const db = require('../data/db-config.js');

const router = express.Router();

/**-----------------GETS------------------ */

router.get('/',(req,res)=>{
    db('cars')
    .then(cars=>{
        res.json(cars);
    })
    .catch(err=>{
        res.status(500).json({message:'Failed to retrieve car data'})
    })
})

router.get('/:id',validateID, async (req,res)=>{
    try{
        const {id} = req.params;
        const cars = await db('cars').where('id',id)
        res.json(cars)
    } catch(err){
        errorMessage(err)
    }
})

/**---------------POSTS--------------------- */

router.post('/', validateBody, async (req,res)=>{
    const carData = req.body
    try{
        const car = await db('cars').insert(carData)
        res.status(201).json(car)
    }
    catch(err){
        errorMessage(err)
    }
})

/**------------------PUTS------------------- */

router.put('/:id',validateID,validateBody, async (req,res)=>{
    const carData = req.body;
    const {id} = req.params;

    try{
        const count = await db('cars').update(carData).where({id})
        res.status(200).json({update:count})
    }
    catch(err){
        errorMessage(err)
    }
})

/**-----------------DELETES------------------ */

router.delete('/:id', validateID, async (req,res)=>{
    const {id} = req.params;
    try{
        const count = await db('cars').del().where({id})
        res.json({deleted:count})
    }
    catch(err){
        errorMessage(err)
    }
})

/**-------------MIDDLEWARE------------------- */

async function validateID(req,res,next){
    const {id} = req.params;
    const accounts = await db('cars').where('id',id)
    if(accounts.length === 0){
        next(res.status(404).json({message:"Not Found"}))
    }
    else{
        next()
    }
}

async function validateBody(req,res,next){
    const vin = req.body.vin;
    const make = req.body.make;
    const model = req.body.model;
    const mileage = req.body.mileage;
    
        
    if(!vin || !make || !model || !mileage){
        next(res.status(400).json({message:"all cars require a vin, the make, the model and mileage"}))
    }
    else{
        if(typeof mileage !== "number" ){
            next(res.status(400).json({message:"mileage needs to be a number"}))
        }
        if(mileage < 0){
            next(res.status(400).json({message:"mileage cannot be negative"}))
        }
        else{
        next()
        }
    }
}

function errorMessage(error){
    const err = error;
    res.status(500).json({message: "problem with DB", error:err})
}

module.exports = router;