import { Config } from 'houdini';
import type { HoudiniVitePluginConfig } from '../../';
export declare function store_import(cfg: Config, which: keyof Required<HoudiniVitePluginConfig>['customStores']): {
    statement: string;
    store_class: string;
};
