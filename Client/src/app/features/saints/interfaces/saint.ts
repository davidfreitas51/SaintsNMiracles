import { ReligiousOrder } from '../../../interfaces/religious-order';
import { Tag } from '../../../interfaces/tag';

export interface Saint {
  id: number;
  name: string;
  country: string;
  century: number;
  image: string;
  description: string;
  markdownPath: string;
  title?: string | null;
  feastDay?: string | null;
  patronOf?: string | null;
  religiousOrder?: ReligiousOrder | null;
  slug: string;
  tags: Tag[];
}
