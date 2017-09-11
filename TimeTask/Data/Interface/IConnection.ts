interface IConnection<T> {
    //name: string;
    //age: number;
    execute(cb:(client: T) => Promise<void>): Promise<void>;
    //error(msg: string): void;
    //use(x: number, y: number): number;
    //use(x: number, y: number): number;
}