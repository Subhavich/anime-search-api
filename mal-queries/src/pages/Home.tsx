import AnimeCard from "../components/AnimeCard";
import { Link } from "react-router-dom";
import { FC, useEffect, useState, useRef } from "react";
import { fetchRandomAnime } from "../http";
import { CartoonType } from "../types";
import SearchBar from "../components/Search";

const HomePage = () => {
  const [randomAnime, setRandomAnime] = useState<CartoonType | null>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false); // Ref to track if fetching has occurred

  const fetchRandom = async () => {
    setIsFetching(true);
    setError(null);

    let anime: CartoonType | null = null;
    let count: number = 0;
    while (
      !anime ||
      !anime.synopsis ||
      anime.rating === "Rx - Hentai" ||
      !anime.score ||
      (!anime.trailer.embed_url && count < 3)
    ) {
      count++;
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
    if (!hasFetched.current) {
      fetchRandom();
      hasFetched.current = true; // Set the ref to true after the first fetch
    }
  }, []);

  return (
    <>
      <main className="max-w-5xl mx-auto ">
        <p className="text-center text-3xl my-16">Generate Random Anime!</p>
        {/* Main Card */}
        <div className="grid grid-cols-12 mb-8 ">
          <div className="grid col-span-4 h-96">
            {isFetching && (
              <p className="w-72 h-94 my-auto text-center text-2xl font-semibold text-neutral-500 animate-bounce">
                Loading ...
              </p>
            )}
            {!isFetching && randomAnime && <AnimeCard cartoon={randomAnime} />}
          </div>
          <div className="flex flex-col col-span-8 justify-between px-2 ">
            {isFetching && (
              <>
                <p className="w-1/2 rounded-md min-h-6 animate-pulse bg-neutral-800"></p>
                <p className="w-3/4 rounded-md min-h-6 animate-pulse bg-neutral-800"></p>
                <p className="w-3/4 rounded-md min-h-40 animate-pulse bg-neutral-800"></p>
              </>
            )}

            {randomAnime && !isFetching && (
              <div className="flex flex-col justify-start space-y-6">
                <p className="text-2xl font-sans font-semibold">
                  {randomAnime.title}
                </p>
                <TagSection cartoon={randomAnime} />
                <p className="line-clamp-4 leading-loose">
                  {randomAnime.synopsis}
                </p>
              </div>
            )}
            {/* Button Group */}
            <div className="flex space-x-4">
              <button
                className="px-2 py-1 hover:bg-white transition-colors max-w-48 border border-neutral-500 text-lg rounded-lg text-neutral-500"
                onClick={fetchRandom}
              >
                Get Random Anime
              </button>
              <button className="px-2 py-1 hover:bg-white transition-colors max-w-48 border border-neutral-500 text-lg rounded-lg text-neutral-500">
                <Link to={"/app"}>Browse Top Animes</Link>
              </button>
              <button className="px-2 py-1 hover:bg-white transition-colors max-w-48 border border-neutral-500 text-lg rounded-lg text-neutral-500">
                <a href="#search">Advanced Search</a>
              </button>
            </div>
          </div>
        </div>
        <hr
          id="search"
          className="opacity-80 my-48
        "
        />
        {/* Search Bar */}
      </main>
      <section className="pb-32">
        <p className="text-center text-3xl my-16">Advanced Search</p>
        <SearchBar />
      </section>
    </>
  );
};

export default HomePage;

export const TagSection: FC<{ cartoon: CartoonType }> = ({ cartoon }) => {
  return (
    <div className="flex space-x-2 ">
      <p>{cartoon.aired.string}</p>
      <p>{" | "}</p>
      <p>{cartoon.status}</p>
      <p>{" | "}</p>
      <p>{cartoon.type}</p>
    </div>
  );
};
