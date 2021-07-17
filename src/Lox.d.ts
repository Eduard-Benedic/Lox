export default class Lox {
    static hadError: boolean;
    run(): void;
    private _runFile;
    private _run;
    static error(line: number, message: string): void;
    private static report;
}
