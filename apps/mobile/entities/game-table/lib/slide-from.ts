import { SLIDE_OFFSET } from '../config';

export const slideFrom = (isMine: boolean) => (isMine ? SLIDE_OFFSET : -SLIDE_OFFSET);
