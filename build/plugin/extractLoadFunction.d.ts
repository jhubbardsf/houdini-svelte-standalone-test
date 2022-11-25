import { Config } from 'houdini';
import { HoudiniRouteScript } from './kit';
export declare function extract_load_function(config: Config, filepath: string, mockArtifacts?: Record<string, {
    raw: string;
}>): Promise<HoudiniRouteScript>;
