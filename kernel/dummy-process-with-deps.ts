import Process = require("./process");
import DummyProcess = require("./dummy-process");
class DummyProcessWithDeps extends Process {
    protected deps = [DummyProcess];

    public classPath(): string {
        return "./dummy-process-with-deps";
    }

    public run(): number {
        this.runDeps();
        return 0;
    }
}

export = DummyProcessWithDeps;
