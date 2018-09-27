export default class BaseError extends Error{

    private status:number;
    private debugInfo:boolean;

    constructor(status:number, message:string, debugInfo:boolean=false) {
        super(message);
        this.message = message;
        this.status = status;
        if (debugInfo) this.debugInfo = debugInfo;
    }

}