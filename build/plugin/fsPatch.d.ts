import { Framework } from './kit';
declare const _default: (getFramwork: () => Framework) => {
    resolveId?: import("rollup").ObjectHook<(this: import("rollup").PluginContext, source: string, importer: string | undefined, options: {
        config: import("houdini").Config;
        custom?: import("rollup").CustomPluginOptions | undefined;
        ssr?: boolean | undefined;
        isEntry: boolean;
    }) => import("rollup").ResolveIdResult | Promise<import("rollup").ResolveIdResult>, {}> | undefined;
    load?: import("rollup").ObjectHook<(this: import("rollup").PluginContext, id: string, options: {
        config: import("houdini").Config;
        ssr?: boolean | undefined;
    }) => import("rollup").LoadResult | Promise<import("rollup").LoadResult>, {}> | undefined;
} | undefined;
export default _default;
