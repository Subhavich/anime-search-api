import { useState, useEffect } from "react";
import { fetchAnime } from "../http";
import genres from "../genre";
import { Genre, CartoonType } from "../types";
import { Tabs } from "../components/Tabs";
import CardCarousel from "../components/Carousel";
// Type definitions for fetched anime data

// Initialize a random genre based on its mal_id.
let randNum = Math.floor(Math.random() * 75);

const AppPage = () => {
  const [runningNumber, setRunningNumber] = useState(randNum);
  const [cartoons, setCartoons] = useState<CartoonType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>("");
  useEffect(() => {
    async function fetchCartoons() {
      const initGenre: Genre | undefined = genres.find(
        (genre) => genre.mal_id === randNum
      );

      if (!initGenre) {
        throw new Error("RNG failed to find a matching genre");
      }
      setIsFetching(true);
      setError(null);

      try {
        const resData = await fetchAnime(runningNumber);
        const animeList: CartoonType[] = resData.data;
        setCartoons(animeList);
        const newGenre = genres.find((genre) => genre.mal_id === runningNumber);
        if (!newGenre) {
          throw new Error("Genre not found for the selected ID");
        }
        setGenre(newGenre.name);
      } catch (err) {
        setError("Could not fetch cartoons. Please try again later.");
        setCartoons([]);
      } finally {
        setIsFetching(false);
      }
    }

    fetchCartoons();
  }, [runningNumber]);

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <main>
        <h3 className="text-center text-2xl pb-4">List of Genres</h3>
        <Tabs
          TAB_DATA={genres}
          setNum={setRunningNumber}
          runningNumber={runningNumber}
        />

        <section className=" ">
          <p className="text-center mb-4 max-w-5xl text-2xl mx-auto font-semibold">
            Displaying Top <span className="text-slate-500">{genre}</span>{" "}
            animes.
          </p>
          <CardCarousel
            cartoons={cartoons}
            isFetching={isFetching}
            runningNumber={runningNumber}
          />
        </section>
      </main>
    </div>
  );
};

export default AppPage;
