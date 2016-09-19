"use strict";
const kernel = require("../dist/kernel");
const DummyProcess = require("../dist/dummy-process");
const constants = require("../dist/constants");
const _ = require("lodash");
global._ = _;

describe("Basic kernel tasks", () => {
    global.Memory = {"processTable": {}, "processMemory": {}};
    global.Game = {"time": 0};

    beforeEach( () => {
        global.Memory = {"processTable": {}, "processMemory": {}};
        global.Game = {"time": 0};
        kernel.reboot();
    });


    test('Add a process', () => {
        const p = new DummyProcess(0, 0);
        kernel.addProcess(p);
        const processTable = kernel.processTable;
        expect(processTable[0]).toBe(p);
        kernel.storeProcessTable();
        expect(Memory.processTable[0]).toEqual([0, 0, "./dummy-process", constants.ProcessPriority.LowPriority, undefined])
    });

    test('Serializing process', () => {
        const p = new DummyProcess(0, 0);
        kernel.addProcess(p);
        const processTable = kernel.processTable;
        kernel.storeProcessTable();
        const processTableCopy = _.cloneDeep(global.Memory.processTable);
        kernel.loadProcessTable();
        kernel.storeProcessTable();
        expect(Memory.processTable).toEqual(processTableCopy);
    });


    test("Running process", () => {
        kernel.addProcess(new DummyProcess(0, 0));
        kernel.storeProcessTable();
        kernel.loadProcessTable();
        const p = kernel.processTable[0];
        p.run = jest.fn();
        kernel.run();
        expect(p.run).toBeCalled();
    });

    test("Sleeping process", () => {
        const p = new DummyProcess(0, 0)
        kernel.addProcess(p);
        kernel.sleepProcess(p, 10);
        kernel.storeProcessTable();
        for (let i =0;  i < 10; i++) {
            Game.time += 1;
            kernel.loadProcessTable();
            const p = kernel.processTable[0];
            p.run = jest.fn();
            kernel.run();
            expect(p.run).not.toBeCalled();
        }
        Game.time += 1;
        kernel.loadProcessTable();
        const p1 = kernel.processTable[0];
        p1.run = jest.fn();
        kernel.run();
        expect(p1.run).toBeCalled();

    });

});
