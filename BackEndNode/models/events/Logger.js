const EventEmiiter = require('events')

class Logger extends EventEmiiter {

    logIt (eventName, message){
        this.emit(eventName,message);
    }
}

module.exports = Logger