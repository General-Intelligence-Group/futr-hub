/**
 * @class Log
 * @author Markus Luckey
 * 
 * @description
 * Allows to log to console with different logging levels
 * 
 */
export default class Log {

    static trace(message: any, ...optionalParams: any[]): void {
        if(this.isLevel("TRACE")) {
            console.info("[TRACE]", message, ...optionalParams)
        }
    }

    static debug(message: any, ...optionalParams: any[]): void {
        if(this.isLevel("DEBUG")) {
            console.info("[DEBUG]", message, ...optionalParams)
        }
    }

    static info(message: any, ...optionalParams: any[]): void {
        if(this.isLevel("INFO")) {
            console.info("[INFO]", message, ...optionalParams)
        }
    }

    static warn(message: any, ...optionalParams: any[]): void {
        if(this.isLevel("WARN")) {
            console.warn("[WARN]", message, ...optionalParams)
        }
    }

    static error(message: any, ...optionalParams: any[]): void {
        if(this.isLevel("ERROR")) {
            console.error("[ERROR]", message, ...optionalParams)
        }
    }

    private static isLevel(level:string): boolean {
        level = level.toUpperCase();
        const envLevel = process.env.LOG_LEVEL?.toUpperCase()
        if(envLevel === "ERROR") {
            return level === "ERROR";
        }
        if(envLevel === "WARN") {
            return level === "WARN" || level === "ERROR";
        }
        if(envLevel === "INFO") {
            return level === "ERROR" || level === "WARN" || level === "INFO";
        }
        if(envLevel === "DEBUG") {
            return level === "ERROR" || level === "DEBUG" || level === "INFO" || level === "WARN";
        }
        if(envLevel === "TRACE") {
            return level === "TRACE" || level === "DEBUG" || level === "INFO" || level === "WARN" || level === "ERROR";
        }
        return false;
    }

}