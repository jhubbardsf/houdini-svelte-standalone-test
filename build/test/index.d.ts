import { CollectedGraphQLDocument, Config, ConfigFile, Script } from 'houdini';
import { Framework } from '../plugin/kit';
export declare function test_config(extraConfig?: Partial<ConfigFile>): Promise<Config>;
export declare function pipeline_test(documents: string[], extra_config?: Partial<ConfigFile>): Promise<{
    plugin_root: string;
    docs: CollectedGraphQLDocument[];
    config: Config;
}>;
export declare function route_test({ component, script, page_query, layout_query, layout, layout_script, config: extra, framework, }: {
    component?: string;
    script?: string;
    page_query?: string;
    layout_query?: string;
    layout?: string;
    layout_script?: string;
    config?: Partial<ConfigFile>;
    framework?: Framework;
}): Promise<{
    component: Script | null;
    script: Script | null;
    layout: Script | null;
    layout_script: Script | null;
}>;
export declare function component_test(content: string, extra?: Partial<ConfigFile>): Promise<Script | null>;
export declare function test_transform_svelte(filepath: string, content: string): Promise<import("ast-types").namedTypes.Program | null>;
export declare function test_transform_js(filepath: string, content: string): Promise<import("ast-types").namedTypes.Program | null>;
