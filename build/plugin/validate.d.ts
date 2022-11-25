import { Config, CollectedGraphQLDocument } from 'houdini';
export default function validateDocuments({ config, documents, }: {
    config: Config;
    documents: CollectedGraphQLDocument[];
}): Promise<void>;
