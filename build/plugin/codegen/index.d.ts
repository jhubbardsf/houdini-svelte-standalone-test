import { GenerateHookInput, Config } from 'houdini';
export default function (input: PluginGenerateInput): Promise<void>;
export declare type PluginGenerateInput = Omit<GenerateHookInput, 'config'> & {
    config: Config;
    framework: 'kit' | 'svelte';
};
