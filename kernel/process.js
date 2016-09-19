"use strict";
const kernel_1 = require("../kernel/kernel");
const constants_1 = require("./constants");
const process_status_1 = require("./process-status");
class Process {
    constructor(pid, parentPID, priority = constants_1.ProcessPriority.LowPriority) {
        this.pid = pid;
        this.parentPID = parentPID;
        this.status = process_status_1.ProcessStatus.ALIVE;
        this.priority = priority;
    }
    ;
    setMemory(memory) {
        this.memory = memory;
    }
    ;
    stop(signal) {
        kernel_1.killProcess(this.pid);
        return signal;
    }
}
module.exports = Process;
