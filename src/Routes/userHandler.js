const express = require('express');

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const todoSchema = require('../Models/userSchema');

const router = express.Router();

const User = new mongoose.model("User", todoSchema);

// require('dotenv').config();

// post todo 

router.post('/signup', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashPassword,
        });
        await newUser.save()
        res.status(200).json({
            message: "signup sucessful"
        })
    } catch {
        res.status(500).json({
            message: "signup failed"
        })
    }

});


router.post('/login', async (req, res) => {
    try {
        const user = await User.find({
            username: req.body.username
        })
        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if (isValidPassword) {
                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id,
                },
                 process.env.JWT_SECRET
                , {
                    expiresIn: '1h'
                })
                
                res.status(200).json({
                    "acess_token": token,
                    "message": "login sucessful",
                })
            } else {
                res.status(401).json({
                    "error": "Authentication failled",
                })
            }
        } else {
            res.status(401).json({
                "error": "Authentication failled username",
            })
        }
    } catch {
        res.status(401).json({
            "error": "Authentication failled try cathch"
        })
    
    }

});


module.exports = router;