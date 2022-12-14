import { ConfigFile } from 'houdini';
/**
 * The houdini processor automates a lot of boilerplate to make inline documents
 * work.
 *
 * It takes the same configuration values as the houdini config file as well as an
 * optional `configFile` parameter to specify the path to use to find houdini.config.js
 */
export default function houdiniPreprocessor(extraConfig: {
    configFile?: string;
} & Partial<ConfigFile>): {
    markup({ content, filename }: {
        content: string;
        filename: string;
    }): Promise<{
        code: string;
    }>;
};
