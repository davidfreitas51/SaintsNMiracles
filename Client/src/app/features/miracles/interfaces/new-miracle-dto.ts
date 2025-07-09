export interface NewMiracleDto {
  title: string;
  country: string;
  century: number;
  image: string;
  description: string;
  markdownContent: string;

  date?: string | null;
  locationDetails?: string | null;
  saintId?: number | null;
  tagIds: number[];
}
