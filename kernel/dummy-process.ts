import { Process } from "./process";

export class DummyProcess extends Process {
    public classPath(): string {
        return "DummyProcess";
    }

    public run(): number {
        return 0;
    }
}

