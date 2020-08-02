var express = require('express');
var router = express.Router();

// Import Speakers Model 
var Speaker = require('../models/speaker');
// Get all users
router.get('/', function(req,res){
    res.json({message: 'Hello SPA, the API is working!'});

    Speaker.find(function(err, speakers){
        if(err)
        res.send(err);
        res.json(speakers);
    });

});

//Get specific users by id
router.get('/:speaker_id', function(res,res) {
    Speaker.findById(req.params.speaker_id, function(err, speaker) {
        if(err)
        res.send(err);
        res.json(speaker);
    });
});

// Create a speaker
router.post('/', function(req, res) {
    // Create a new instance of the Speaker model 
    var speaker = new Speaker();
    // Set the speaker's properties (comes from the request)
    speaker.name = req.body.name;
    speaker.comapny = req.body.company;
    speaker.title = req.body.title;
    speaker.description = req.body.description;
    speaker.picture = req.body.picture;
    speaker.schedule = req.body.schedule;

    // Save the data recieved
    speaker.save(function(err) {
        if(err)
        res.send(err);
        //If saved successfully 
        res.json({ message: 'speaker successfully created'});
    });
});

// Update specific users by id
router.put('/:speaker_id', function(req, res) {
Speaker.findById(req.params.speaker_id, function(err , speaker){
if(err)
res.send(err);
// Set the speakers properties (comes from the request)
speaker.name = req.body.name;
speaker.company = req.body.company;
speaker.title = req.body.title;
speaker.description = req.body.description;
speaker.picture = req.body.picture;
speaker.schedule = req.body.schedule;

//save the data recieved
speaker.save(function(err) {
    if(err)
    res.send(err);
    // when successfully saved
    res.json({ message: 'speaker successfully udated'});
});
});

});

// Delete a specific users by id
router.delete('/:speaker_id', function(res, res) {
    Speaker.remove({ _id:req.params.speaker_id}, function(err, speaker) {
        if(err)
        res.send(err);
        // Give success messsgae 
        res.json({ message : ' speaker successfully deleted!'});
    });
});

// Export all the routes to the router variable 
module.exports = router;