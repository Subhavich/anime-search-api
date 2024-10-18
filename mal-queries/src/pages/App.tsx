import { useState, useEffect } from "react";
import AnimeCard from "../components/AnimeCard";
import { fetchAnime } from "../http";
import genres from "../genre";
import { Genre, CartoonType } from "../types";
import { Tabs } from "../components/Tabs";
// Type definitions for fetched anime data

// Initialize a random genre based on its mal_id.
let randNum = Math.floor(Math.random() * 75);
const initGenre: Genre | undefined = genres.find(
  (genre) => genre.mal_id === randNum
);

if (!initGenre) {
  throw new Error("RNG failed to find a matching genre");
}

const AppPage = () => {
  const [runningNumber, setRunningNumber] = useState(randNum);
  const [cartoons, setCartoons] = useState<CartoonType[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>(initGenre.name);

  useEffect(() => {
    async function fetchCartoons() {
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
        <Tabs TAB_DATA={genres} setNum={setRunningNumber} />
        <div className="text-center pb-4">
          <h2>Displaying: {genre} animes</h2>
        </div>

        <section>
          <div className="anime-slide">
            {isFetching ? (
              <p>Loading...</p>
            ) : cartoons.length === 0 ? (
              <p>No Data</p>
            ) : (
              cartoons.map((cartoon) => {
                const { mal_id, images, title, score, year, genres } = cartoon;

                // Map the genres to match the expected Genre type
                const formattedGenres: Genre[] = genres.map((g) => ({
                  mal_id: g.mal_id,
                  name: g.name,
                  url: "", // Default or placeholder value for 'url'
                  count: 0, // Default or placeholder value for 'count'
                }));

                return (
                  <AnimeCard
                    key={mal_id}
                    image={images.webp.image_url}
                    title={title}
                    score={score}
                    year={year}
                    genres={formattedGenres} // Pass the formatted genres
                    isFetching={isFetching}
                  />
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AppPage;
