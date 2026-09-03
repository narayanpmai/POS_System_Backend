import { SetMetadata } from '@nestjs/common';

export const SKIP_DATE_TRANSFORM_KEY = 'skipDateTransform';
export const SkipDateTransform = () => SetMetadata(SKIP_DATE_TRANSFORM_KEY, true);
