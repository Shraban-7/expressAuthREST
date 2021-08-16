const express = require('express');

const mongoose = require('mongoose');

const todoSchema = require('../Models/todoSchema');

const checkLogin = require('../middleware/checklogin');

const router = express.Router();

const Todo = new mongoose.model("Todo", todoSchema);

// get all todos 

router.get('/', checkLogin, (req, res) => {
    console.log(req.username);
    console.log(req.userId);
    Todo.find({ status: 'active' }).select({
        _id: 0,
        date: 0,
    }).limit(2).exec((err, data) => {
        if (err) {
            res.status(500).json({ error: "there was a server side error" })
        } else {
            res.status(200).json({
                result: data,
                message: "todo find successfully!"
            })
        }
    })
});

// get todo by id 

router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.find({ _id: req.params.id })
        res.status(200).json({
            result: data,
            message: "todo find successfully!"
        })
    } catch (err) {
        res.status(500).json({ error: "there was a server side error" })
    }
});

// post todo 

router.post('/', (req, res) => {
    const newTodo = new Todo(req.body);
    newTodo.save((err) => {
        if (err) {
            res.status(500).json({ error: "there was a server side error" })
        } else {
            res.status(200).json({ message: "todo inserted successfully!" })
        }
    })
});

// post multiple todo 

router.post('/all', (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({ error: "there was a server side error" })
        } else {
            res.status(200).json({ message: "todos were inserted successfully!" })
        }
    })
});

// put todo 

router.put('/:id', (req, res) => {
    Todo.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "inactive"
        }
    }, {
        useFindAndModify: false
    }, (err) => {
        if (err) {
            res.status(500).json({ error: "there was a server side error" })
        } else {
            res.status(200).json({ message: "todo was updated successfully!" })
        }
    })
});

// delete todo 

router.delete('/:id', (req, res) => {
    Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({ error: "there was a server side error" })
        } else {
            res.status(200).json({
                message: "todo delete successfully!"
            })
        }
    })
});

module.exports = router;