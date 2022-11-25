import { TransformPage } from 'houdini/vite';
import { Framework } from '../kit';
export default function apply_transforms(framework: Framework, page: TransformPage): Promise<{
    code: string;
}>;
