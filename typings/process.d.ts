import { ProcessPriority } from "../kernel/constants";
import { ProcessSleep } from "./process-sleep";
export interface Process {
    pid: number;
    parentPID: number;
    status: number;
    classPath(): string;
    id: string;
    priority: ProcessPriority;
    sleepInfo?: ProcessSleep;
    memory: any;
    setMemory(memory: any): void;
    run(): number;
    stop(signal: number): number;
}
