const jwt = require('jsonwebtoken')

const token = jwt.sign(
            { user_ID: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        )

        res.json({token})

console.log(token)