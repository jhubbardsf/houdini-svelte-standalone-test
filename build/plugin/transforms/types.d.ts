import { Script } from 'houdini';
import { TransformPage } from 'houdini/vite';
import { Framework } from '../kit';
export declare type SvelteTransformPage = TransformPage & {
    framework: Framework;
    script: Script;
};
