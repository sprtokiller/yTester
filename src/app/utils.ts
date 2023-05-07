import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases as PHRASES, StatusCodes as CODE} from 'http-status-codes';

function formatDate(date: Date) {
    const padTwo = (val: number) => (val > 9 ? "" : "0") + val;
    const year = date.getFullYear()
    const month = padTwo((date.getMonth() + 1))
    const day = padTwo((date.getDate()))
    const hours = padTwo((date.getHours()))
    const minutes = padTwo((date.getMinutes()))
    const seconds = padTwo((date.getSeconds()))
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function logRequests(req: Request, res: Response, next: NextFunction) {
    req.session.sub = '109297358012991804394'; // TODO: temporary
    // add a second wait to simulate network latency
    console.log(`[${formatDate(new Date())}] ${req.method} ${req.url}`);
    setTimeout(() => {
        next();
    }, 1000);
}

// Middleware to check request body for required fields (as specified in the params array)
export function checkBodyParams(params: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const missingParams = params.filter(param => !req.body[param]);
        if (missingParams.length > 0) {
            return res.status(CODE.BAD_REQUEST).send(`Missing required parameters: ${missingParams.join(', ')}`);
        }
        next();
    }
}

export function errorHandle(err: unknown, res: Response<any, Record<string, any>>) {
    console.error(err);
    return res.status(CODE.INTERNAL_SERVER_ERROR).send(PHRASES.INTERNAL_SERVER_ERROR);
}

// create an enum for months
export enum Month {
    January = 0,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}

export enum EndType {
    PLAN = "PLAN",
    MANUAL = "MANUAL",
    AUTO = "AUTO"
  }

  // "RISE" | "STORYLINE" | "STUDIO" | "OTHER";
export enum ContentType {
    RISE = "RISE",
    STORYLINE = "STORYLINE",
    STUDIO = "STUDIO",
    OTHER = "OTHER"
}