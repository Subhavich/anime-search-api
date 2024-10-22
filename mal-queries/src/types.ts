
export interface Genre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}
 export interface CardType extends CartoonType {
  id: number;
  column: string;
}


export type ImageType = {
  webp: {
    image_url: string;
    large_image_url:string
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
  synopsis:string;
  rating:string;
  aired:aired;
  status:string;
  type:string;
  scored_by:number;
  trailer:TrailerType;
};

export type TrailerType = {
  embed_url:string
}

export type aired = {
  string:string
}

