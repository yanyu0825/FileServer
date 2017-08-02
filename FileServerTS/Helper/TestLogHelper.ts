

export class TestLogHelper implements ILog {


    public debug(msg: string) {
        if (msg) {
            console.log(msg);
        }
    }

    public error(msg: Error) {
        if (msg) {
            console.log(msg);
        }
    }


    
}

