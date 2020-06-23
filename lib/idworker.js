const LOG = require("./utils/log.js");
const bitwise = require("./utils/bitwise.js");
const process = require('process');

//IdWorker
function IdWorker(workerId, dataCenterId) {
    this.workerId = BigInt(workerId);
    this.dataCenterId = BigInt(dataCenterId);

    this.lastTimeStamp = BigInt(-1);

    this.sequence = BigInt(0);
    this.sequenceBits = BigInt(12);
    this.sequenceMask = bitwise.bXor(BigInt(-1), bitwise.lshift(BigInt(-1), this.sequenceBits));

    this.workerIdBits = BigInt(5);
    this.workerIdShift = this.sequenceBits;

    this.dataCenterIdBits = BigInt(5);
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits;

    this.timeStampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;

    this.nepoch = BigInt(1311779587209);

    //TODO check config settings and throw error if incorrect.

    LOG.info("ID worker starting. timestamp left shift", this.timeStampLeftShift, ", datacenter id bits", this.dataCenterIdBits,
             ", worker id bits", this.workerIdBits, ", sequence bits", this.sequenceBits, ", workerid", this.workerId);
}

IdWorker.prototype.getId = function (useragent) {
    if (!useragent) {
        LOG.error("Invalid User Agent");
        throw {"message":"Invalid User Agent " + useragent};
    }

    return this.nextId();
};

IdWorker.prototype.nextId = function() {
    let timestamp = this.timeGen();

    if (timestamp === this.lastTimeStamp) {
        this.sequence = bitwise.bAnd((this.sequence + 1), this.sequenceMask)
        if (this.sequence === 0) {
            timestamp = this.tillNextMillis(this.lastTimeStamp);
        }
    } else {
        this.sequence = BigInt(0);
    }

    if (timestamp < this.lastTimeStamp) {
        throw {"message":"Clock is going backwards, cannot make a new ID until clock catches up"};
    }

    this.lastTimeStamp = timestamp;

    return bitwise.bOr(
               bitwise.bOr(
                   bitwise.bOr(
                       bitwise.lshift((timestamp - this.nepoch), this.timeStampLeftShift),
                       bitwise.lshift(this.dataCenterId, this.dataCenterIdShift)
                   ),
                   bitwise.lshift(this.workerId, this.workerIdShift)
               ),
               this.sequence
           );
};

IdWorker.prototype.timeGen = function() {
    return process.hrtime.bigint();
};

IdWorker.prototype.tillNextMillis = function(lastTimeStamp) {
    let timestamp = this.timeGen();
    while(timestamp <= lastTimeStamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
};


exports.getIdWorker = function(workerId, dataCenterId) {
    return new IdWorker(workerId, dataCenterId);
};
