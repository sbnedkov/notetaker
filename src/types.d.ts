import session from 'express-session';

declare module 'express-cors';
declare module 'tiny-csrf';
declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: string };
    }
}
