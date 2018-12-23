var express = require('express');
var router = express.Router();
var auth = require('../../auth.js');
var User = require('../../models/users.js');
var Wordbook = require('../../models/wordbooks.js');

router.post('/', (req, res) => { // add new wordbook
    var name = req.body.name;
    var intro = req.body.intro;
    var words = req.body.words;
    var token = req.body.token;
    if (!token){
        res.send({
            success: false,
            message: 'No token provided'
        })
        return
    }
    try {
        var user_id = auth.verify(token).id;
    } catch(err) {
        res.send({
            success: false,
            message: 'failed to verify token'
        })
        return
    }  
    console.log(true)
    User.findById(user_id, function (error, user) {
        if (error || !user) { 
            console.error(error); 
            res.send({
                success: false,
                message: 'failed to verify token'
            })
            return
        }
        console.log(user)
        var new_wordbook = new Wordbook({
            name: name,
            intro: intro,
            words: words,
            user: user.name
        })
    
        User.update({_id: user_id}, {$inc: {points: 5}}, function (err, user) {
            if (err) console.log(err)
        }); // give 5 points to user who created wordbook
        new_wordbook.save(function (error) {
            if (error) { 
                console.log(error) 
                res.send({
                    success: false,
                    message: 'Error'
                })
                return
            }
            res.send({
                success: true,
                message: 'Wordbook saved successfully'
            })
        })
    }).select('name')
})

module.exports = router;
