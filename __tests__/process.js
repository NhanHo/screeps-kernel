"use strict";
test('Add a process', () => {
    const kernel = require("../dist/kernel");
    const DummyProcess = require("../dist/dummy-process");
    const constants = require("../dist/constants");
    const _ = require("lodash");
    global._ = _;
    global.Memory = {"processTable": {}, "processMemory": {}};
    const p = new DummyProcess(0, 0);
    kernel.addProcess(p);
    const processTable = kernel.processTable;
    expect(processTable[0]).toBe(p);
    kernel.storeProcessTable();
    expect(Memory.processTable[0]).toEqual([0, 0, "dummy-process", constants.ProcessPriority.LowPriority, undefined])
});
