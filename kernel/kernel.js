"use strict";
const process_status_1 = require("./process-status");
const constants_1 = require("./constants");
let ticlyQueue = [];
let ticlyLastQueue = [];
let lowPriorityQueue = [];
exports.processTable = {};
exports.reboot = function () {
    ticlyQueue = [];
    ticlyLastQueue = [];
    lowPriorityQueue = [];
    exports.processTable = {};
};
let getFreePid = function () {
    let currentPids = _.sortBy(_.map(exports.processTable, p => p.pid));
    for (let i = 1; i < currentPids.length; i++) {
        if (!exports.processTable[i]) {
            return i;
        }
    }
    return currentPids.length;
};
exports.garbageCollection = function () {
    Memory.processMemory = _.pick(Memory.processMemory, (_, k) => (exports.processTable[k]));
};
exports.addProcess = function (p, priority = constants_1.ProcessPriority.LowPriority) {
    let pid = getFreePid();
    p.pid = pid;
    p.priority = priority;
    exports.processTable[p.pid] = p;
    Memory.processMemory[pid] = {};
    p.setMemory(exports.getProcessMemory(pid));
    p.status = process_status_1.ProcessStatus.ALIVE;
    return p;
};
exports.killProcess = function (pid) {
    if (pid === 0) {
        console.log("ABORT! ABORT! Why are you trying to kill init?!");
        return -1;
    }
    exports.processTable[pid].status = process_status_1.ProcessStatus.DEAD;
    Memory.processMemory[pid] = undefined;
    console.log("Shutting down process with pid:" + pid);
    for (let otherPid in exports.processTable) {
        const process = exports.processTable[pid];
        if ((process.parentPID === parseInt(otherPid, 10)) &&
            (process.status !== process_status_1.ProcessStatus.DEAD)) {
            exports.killProcess(process.pid);
        }
    }
    return pid;
};
exports.sleepProcess = function (p, ticks) {
    p.status = process_status_1.ProcessStatus.SLEEP;
    p.sleepInfo = { start: Game.time, duration: ticks };
    return p;
};
exports.getProcessById = function (pid) {
    return exports.processTable[pid];
};
exports.storeProcessTable = function () {
    let aliveProcess = _.filter(_.values(exports.processTable), (p) => p.status !== process_status_1.ProcessStatus.DEAD);
    Memory.processTable = _.map(aliveProcess, (p) => [p.pid, p.parentPID, p.classPath, p.priority, p.sleepInfo]);
};
exports.getProcessMemory = function (pid) {
    Memory.processMemory = Memory.processMemory || {};
    Memory.processMemory[pid] = Memory.processMemory[pid] || {};
    return Memory.processMemory[pid];
};
let runOneQueue = function (queue) {
    while (queue.length > 0) {
        let process = queue.pop();
        while (process) {
            try {
                let parent = exports.getProcessById(process.parentPID);
                if (!parent) {
                    exports.killProcess(process.pid);
                }
                if ((process.status === process_status_1.ProcessStatus.SLEEP) &&
                    ((process.sleepInfo.start + process.sleepInfo.duration) > Game.time) &&
                    (process.sleepInfo.duration !== -1)) {
                    process.status = process_status_1.ProcessStatus.ALIVE;
                }
                if (process.status === process_status_1.ProcessStatus.ALIVE) {
                    process.run();
                }
            }
            catch (e) {
                console.log("Fail to run process:" + process.pid);
                console.log(e.message);
                console.log(e.stack);
            }
            process = queue.pop();
        }
    }
};
exports.run = function () {
    runOneQueue(ticlyQueue);
    runOneQueue(ticlyLastQueue);
    runOneQueue(lowPriorityQueue);
};
exports.loadProcessTable = function () {
    exports.reboot();
    Memory.processTable = Memory.processTable || [];
    let storedTable = Memory.processTable;
    for (let item of storedTable) {
        let [pid, parentPID, classPath, priority, ...remaining] = item;
        try {
            let processClass = require(classPath);
            let memory = exports.getProcessMemory(pid);
            let p = new processClass(pid, parentPID, priority);
            p.setMemory(memory);
            exports.processTable[p.pid] = p;
            if (remaining.length === 0) {
                p.sleepInfo = { start: Game.time, duration: 0 };
            }
            else {
                p.sleepInfo = remaining[0];
            }
            if (priority === constants_1.ProcessPriority.Ticly) {
                ticlyQueue.push(p);
            }
            if (priority === constants_1.ProcessPriority.TiclyLast) {
                ticlyLastQueue.push(p);
            }
            if (priority === constants_1.ProcessPriority.LowPriority) {
                lowPriorityQueue.push(p);
            }
        }
        catch (e) {
            console.log("Error when loading:" + e.message);
            console.log(classPath);
        }
    }
};
