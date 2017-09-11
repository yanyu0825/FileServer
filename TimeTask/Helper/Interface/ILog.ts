interface ILog {
    //name: string;
    //age: number;
    debug(msg: string, title?: string ): void;
    error(msg: Error, title?: string ): void;
    //use(x: number, y: number): number;
    //use(x: number, y: number): number;
}