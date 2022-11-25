import { PluginFactory } from 'houdini';
declare const HoudiniSveltePlugin: PluginFactory;
export default HoudiniSveltePlugin;
declare module 'houdini' {
    interface HoudiniPluginConfig {
        'houdini-svelte': HoudiniVitePluginConfig;
    }
}
export declare type HoudiniVitePluginConfig = {
    /**
     * A relative path from your houdini.config.js to the file that exports your client as its default value
     */
    client: string;
    /**
     * The name of the file used to define page queries.
     * @default +page.gql
     */
    pageQueryFilename?: string;
    /**
     * The name of the file used to define layout queries.
     * @default +layout.gql
     */
    layoutQueryFilename?: string;
    /**
     * The default prefix of your global stores.
     *
     * _Note: it's nice to have a prefix so that your editor finds all your stores by just typings this prefix_
     * @default GQL_
     */
    globalStorePrefix?: string;
    /**
     * With this enabled, errors in your query will not be thrown as exceptions. You will have to handle
     * error state in your route components or by hand in your load (or the onError hook)
     */
    quietQueryErrors?: boolean;
    /**
     * A flag to treat every component as a non-route. This is useful for projects built with the static-adapter
     */
    static?: boolean;
    /**
     * Override the classes used when building stores for documents. Values should take the form package.export
     * For example, if you have a store exported from $lib/stores you should set the value to "$lib/stores.CustomStore".
     */
    customStores?: {
        query?: string;
        mutation?: string;
        subscription?: string;
        fragment?: string;
        queryForwardsCursor?: string;
        queryBackwardsCursor?: string;
        queryOffset?: string;
        fragmentForwardsCursor?: string;
        fragmentBackwardsCursor?: string;
        fragmentOffset?: string;
    };
};
