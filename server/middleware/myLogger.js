//Simple request logger middleware
const today = Date();

const myLogger = function(req, res, next){
    console.log(`LOGGED at ${today}`)
    next()
}

module.exports = myLogger