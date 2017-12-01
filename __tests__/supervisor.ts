import kernel = require("../kernel/kernel");
import DummyProcessWithDeps = require("../kernel/dummy-process-with-deps");
import constants = require("../kernel/constants");
import _ = require("lodash");
global._ = _;

function runOneTick() {
    kernel.loadProcessTable();
    kernel.run();
    kernel.storeProcessTable();

}
describe("Supervision tree basics", () => {
    beforeEach(() => {
        global.Memory = { "processTable": {}, "processMemory": {} };
        global.Game = { "time": 0 };
        kernel.reboot();
        const p = new DummyProcessWithDeps(0, 0);
        p.dummyProcessSetup = jest.fn();
        kernel.addProcess(p);
        kernel.storeProcessTable();

    })
    test('Add a process should also start its dependencies', () => {
        runOneTick();
        expect(Memory.processTable.length).toBe(2);
        //runNextTick()
    })

    test('A process should not start its depencencies more than once', () => {
        runOneTick();
        runOneTick();
        //console.log(JSON.stringify(Memory));
        expect(Memory.processTable.length).toBe(2);
    })

    test('Callback to setup dependent process should be called', () => {
        const p = new DummyProcessWithDeps(0, 0);
        p.dummyProcessSetup = jest.fn();
        kernel.addProcess(p);
        kernel.storeProcessTable();
        runOneTick();
    })
})
