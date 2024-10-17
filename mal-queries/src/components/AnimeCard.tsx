import { FC } from "react";
import { Genre } from "../types";

interface AnimeCardProps {
  title: string;
  genres: Genre[];
  isFetching: boolean;
  image: string;
  score: number;
  year: number;
}
const AnimeCard: FC<AnimeCardProps> = ({
  title,
  genres,
  isFetching,
  image,
}) => {
  function shortenText(text: string, char: number) {
    return text.length > char ? `${text.slice(0, char)} ...` : text;
  }

  return (
    <>
      {isFetching && <p>Loading Data</p>}
      {!isFetching && (
        <div className="anime-card">
          <div className="anime-card__image">
            <img src={image} />
          </div>
          <div className="anime-card__text">
            <h3 className="anime-card-title">{shortenText(title, 16)}</h3>

            <div className="anime-card-tags">
              {genres.map((genre, ind) => {
                return (
                  <p key={ind} className="anime-card-genre">
                    {genre.name}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimeCard;
