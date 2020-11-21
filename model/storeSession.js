"use strict"
class StoreSession {
    constructor(response = null) {
        if (response === null) console.error(`you construct new Store Session with null response object`);
        else {
            this.sessionId = new Date();
            this.response = response;
        }
    }
}

module.exports = StoreSession;