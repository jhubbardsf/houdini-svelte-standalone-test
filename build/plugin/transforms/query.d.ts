import { ExpressionKind } from 'ast-types/gen/kinds';
import { Config, Script } from 'houdini';
import { TransformPage } from 'houdini/vite';
import * as recast from 'recast';
import { SvelteTransformPage } from './types';
declare type Statement = recast.types.namedTypes.Statement;
export default function QueryProcessor(config: Config, page: SvelteTransformPage): Promise<void>;
export declare function find_inline_queries(page: TransformPage, parsed: Script | null, store_id: (name: string) => ExpressionKind): Promise<LoadTarget[]>;
export declare function query_variable_fn(name: string): string;
export declare type LoadTarget = {
    store_id: Statement;
    name: string;
    variables: boolean;
};
export {};
