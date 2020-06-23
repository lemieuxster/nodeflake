var LOG = function() {
    this._WARN_ = "WARN";
    this._ERROR_ = "ERROR";
    this._INFO_ = "INFO"
};

LOG.prototype.logMessage = function(type, messageObj) {
    var messageTxt = "";
    for (var key in messageObj) {
        messageTxt += messageObj[key] + " ";
    }
    console.log(type + ": " + messageTxt);
};

LOG.prototype.error = function() {
    this.logMessage(this._ERROR_, arguments);
};

LOG.prototype.info = function() {
    this.logMessage(this._INFO_, arguments);
};

LOG.prototype.warn = function() {
    this.logMessage(this._WARN_, arguments);
};

module.exports = new LOG();
