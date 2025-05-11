import * as fs from 'fs';
import { Constants } from './Utils/Constants';

export class Logger {

    public log(arg: string): void {
        arg = this.prefixLogs(arg);
        fs.appendFileSync(Constants.logFilePath, `${this.getDateTime()}${arg}`);
    }

    private prefixLogs(arg: string): string {
        let errorIndex = arg.indexOf(Constants.error);
        if (errorIndex !== Constants.numberMinusOne) {
            arg = Constants.prefixLogError + arg;
        } else {
            arg = Constants.prefixLogInfo + arg;
        }
        return arg;
    }

    private getDateTime(): string {
        let date = new Date().toString().split(Constants.dash)
            .splice(Constants.numberZero, Constants.timeEndSlice).join(Constants.dash);
        return Constants.newLine + date + Constants.doubleColon;
    }
}
