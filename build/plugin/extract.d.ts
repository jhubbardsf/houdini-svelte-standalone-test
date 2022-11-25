import { type Maybe, type Script } from 'houdini';
export default function (filepath: string, contents: string): Promise<string[]>;
export declare function parseSvelte(str: string): Promise<ParsedFile>;
export declare type ParsedFile = Maybe<{
    script: Script;
    start: number;
    end: number;
}>;
