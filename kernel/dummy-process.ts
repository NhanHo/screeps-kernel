import Process = require("./process");

class DummyProcess extends Process {
    public classPath(): string {
        return "./dummy-process";
    }

    public run(): number {
        return 0;
    }
}

export = DummyProcess;
