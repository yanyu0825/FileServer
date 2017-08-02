import { TestLogHelper } from "../Helper/TestLogHelper"
//import { Config } from '../Config/Config';
export class Base {
    //public config: Config = new Config();

    protected BaseValidate(key: string): Promise<boolean> {
        return Promise.resolve(!(!key));
    }

    constructor(protected log: ILog = new TestLogHelper()) { }
}