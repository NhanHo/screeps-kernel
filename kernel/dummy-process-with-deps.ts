import { Process } from "./process";
import { DummyProcess } from "./dummy-process";
import { ProcessPriority } from "./constants";
export class DummyProcessWithDeps extends Process {
    protected deps = [];

    public classPath(): string {
        return "./dummy-process-with-deps";
    }

    constructor(public pid: number,
        public parentPID: number,
        priority = ProcessPriority.LowPriority) {
        super(pid, parentPID, priority)
        this.setupDeps();
    }
    public run(): number {
        this.runDeps();
        return 0;
    }

    protected setupDeps() {
        this.registerDependency(DummyProcess, this.dummyProcessSetup)
    }
    public dummyProcessSetup(p: DummyProcess) {
        p.memory.test = 1;
    }
}
