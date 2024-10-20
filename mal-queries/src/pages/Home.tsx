import AnimeCard from "../components/AnimeCard";
import { Link } from "react-router-dom";
// import { UserContext } from "../store/user-context";
import { FC, useEffect, useState } from "react";
import { fetchRandomAnime } from "../http";
import { CartoonType } from "../types";
const HomePage = () => {
  const [randomAnime, setRandomAnime] = useState<CartoonType | null>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandom = async () => {
    setIsFetching(true);
    setError(null);

    let anime: CartoonType | null = null;

    while (!anime || !anime.synopsis || anime.rating == "Rx - Hentai") {
      try {
        const resData = await fetchRandomAnime();
        anime = resData.data;
      } catch (err) {
        setError("Cannot Fetch Random Animes");
        anime = null;
        console.log(error);
        break; // Exit loop on error
      }
    }

    setRandomAnime(anime);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  return (
    <main className="max-w-5xl mx-auto ">
      <div className="grid grid-cols-12 ">
        <div className="grid col-span-4 h-96">
          {isFetching && (
            <p className="w-72 h-94 my-auto text-center text-2xl font-semibold text-neutral-500 animate-bounce">
              Loading ...
            </p>
          )}
          {!isFetching && randomAnime && <AnimeCard cartoon={randomAnime} />}
        </div>
        <div className="flex flex-col col-span-8 justify-between px-2 ">
        {isFetching && <>
          <p className="w-1/2 rounded-md min-h-6 animate-pulse bg-neutral-800"></p>
          <p className="w-3/4 rounded-md min-h-6 animate-pulse bg-neutral-800"></p>
          <p className="w-3/4 rounded-md min-h-40 animate-pulse bg-neutral-800"></p></>}
          
          {(randomAnime&&!isFetching) && (
            <div className="flex flex-col justify-start space-y-6">
              
              <p className="text-2xl font-sans font-semibold">
                {randomAnime.title}
              </p>
              <TagSection cartoon={randomAnime} />
              <p className="line-clamp-4">{randomAnime.synopsis}</p>
            </div>
          )}
          {/* Button Group */}
          <div className="flex space-x-4">
            <button
              className=" px-2 py-1 hover:bg-white transition-colors  max-w-48 border border-neutral-500 text-lg rounded-lg text-neutral-500"
              onClick={fetchRandom}
            >
              Get Random Anime
            </button>
            <button
              className=" px-2 py-1 hover:bg-white transition-colors  max-w-48 border border-neutral-500 text-lg rounded-lg text-neutral-500"
              onClick={fetchRandom}
            >
              <Link to={"/app"}>Browse Top Animes</Link>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;

export const TagSection: FC<{ cartoon: CartoonType }> = ({ cartoon }) => {
  return (
    <div className="flex space-x-2 ">
      <p>Tag Section</p>
      <p>{" | "}</p>
      <p>{cartoon.aired.string}</p>
      <p>{" | "}</p>
      <p>{cartoon.status}</p>
      <p>{" | "}</p>
      <p>{cartoon.type}</p>
    </div>
  );
};
