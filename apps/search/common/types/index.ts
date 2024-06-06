import {Multer} from "multer";

export interface TokenPayload {
    id: string;
    login: string;
    role: string;
}

export interface RequestFiles {
    [key: string]: Express.Multer.File[];
}

export interface EventSearchBody {
    id: string,
    name: string,
    description: string
}

export interface EventSearchResult {
    hits: {
        total: number;
        hits: Array<{
            _source: EventSearchBody;
        }>;
    };
}
