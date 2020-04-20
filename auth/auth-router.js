const router = require("express").Router()
const Users = require("../users/users-model.js")
const bcrypt = require("bcryptjs")

router.post("/register", (req,res) => {
    let user = req.body;

    const rounds = process.env.HASH_ROUNDS || 10;

    const hash = bcrypt.hashSync(user.password, rounds)

    user.password = hash

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({errorMessage: error.message})
    })
})

router.post("/login", (req,res) => {
    let {username, password} = req.body;

    Users.findBy({username})
    .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.loggedIn = true
            res.status(201).json({message: "Welcome"})
        }
        else {
            res.status(401).json({message: "You can't pass"})
        }
        
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({errorMessage: error.message})
    })
})

module.exports = router