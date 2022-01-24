const mongoose = require('mongoose')

const optionDB = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

async function connect () {
    try {
        await mongoose.connect('mongodb://localhost/Task', optionDB)
        console.log('connected mongoose')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connect()