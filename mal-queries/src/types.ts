
export interface Genre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

export type ImageType = {
  webp: {
    image_url: string;
  };
};

export type GenreType = {
  mal_id: number;
  name: string;
};

export type CartoonType = {
  mal_id: number;
  images: ImageType;
  title: string;
  score: number;
  year: number;
  genres: GenreType[];
  synopsis:string
};

