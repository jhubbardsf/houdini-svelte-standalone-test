import * as graphql from 'graphql';
import { Config } from 'houdini';
import recast from 'recast';
import { HoudiniVitePluginConfig } from '.';
import { SvelteTransformPage } from './transforms/types';
declare type Identifier = recast.types.namedTypes.Identifier;
export declare function is_route(config: Config, framework: Framework, filepath: string): boolean;
export declare function route_data_path(config: Config, filename: string): string;
export declare function routePagePath(config: Config, filename: string): string;
export declare function is_route_script(framework: Framework, filename: string): boolean;
export declare function is_page_script(framework: Framework, filename: string): boolean;
export declare function is_layout_script(framework: Framework, filename: string): boolean;
export declare function is_root_layout(config: Config, filename: string): boolean;
export declare function is_root_layout_server(config: Config, filename: string): boolean;
export declare function is_root_layout_script(config: Config, filename: string): boolean;
export declare function is_layout_component(framework: Framework, filename: string): boolean;
export declare function is_layout(framework: Framework, filename: string): boolean;
export declare function is_component(config: Config, framework: Framework, filename: string): boolean;
export declare function page_query_path(config: Config, filename: string): string;
export declare function layout_query_path(config: Config, filename: string): string;
export declare function resolve_relative(config: Config, filename: string): string;
export declare function walk_routes(config: Config, framework: Framework, visitor: RouteVisitor, dirpath?: string): Promise<void>;
export declare type RouteVisitor = {
    inlinePageQueries?: RouteVisitorHandler<graphql.OperationDefinitionNode>;
    inlineLayoutQueries?: RouteVisitorHandler<graphql.OperationDefinitionNode>;
    routePageQuery?: RouteVisitorHandler<graphql.OperationDefinitionNode>;
    routeLayoutQuery?: RouteVisitorHandler<graphql.OperationDefinitionNode>;
    layoutQueries?: RouteVisitorHandler<graphql.OperationDefinitionNode[]>;
    pageQueries?: RouteVisitorHandler<graphql.OperationDefinitionNode[]>;
    layoutExports?: RouteVisitorHandler<string[]>;
    pageExports?: RouteVisitorHandler<string[]>;
    route?: RouteVisitorHandler<{
        dirpath: string;
        svelteTypeFilePath: string;
        layoutQueries: graphql.OperationDefinitionNode[];
        pageQueries: graphql.OperationDefinitionNode[];
        layoutExports: string[];
        pageExports: string[];
    }>;
};
declare type RouteVisitorHandler<_Payload> = (value: _Payload, filepath: string) => Promise<void> | void;
export declare type HoudiniRouteScript = {
    houdini_load?: graphql.OperationDefinitionNode[];
    exports: string[];
};
export declare function route_page_path(config: Config, filename: string): string;
export declare function stores_directory_name(): string;
export declare function stores_directory(plugin_root: string): string;
export declare function type_route_dir(config: Config): string;
export declare function store_import_path({ config, name }: {
    config: Config;
    name: string;
}): string;
export declare function store_suffix(config: Config): string;
export declare function store_name({ config, name }: {
    config: Config;
    name: string;
}): string;
export declare function global_store_name({ config, name }: {
    config: Config;
    name: string;
}): string;
export declare function plugin_config(config: Config): Required<HoudiniVitePluginConfig>;
export declare function store_import({ page, artifact, local, }: {
    page: SvelteTransformPage;
    artifact: {
        name: string;
    };
    local?: string;
}): {
    id: Identifier;
    added: number;
};
export declare type Framework = 'kit' | 'svelte';
export {};
