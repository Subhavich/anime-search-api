import AnimeCard from "../components/AnimeCard";
import { UserContext } from "../store/user-context";
import { useContext } from "react";
const mockData = {
  mal_id: 39024,
  images: {
    webp: {
      image_url: "https://cdn.myanimelist.net/images/anime/1857/98299.webp",
    },
  },
  title: "Wu Dong Qian Kun",
  synopsis:
    "The Great Yan Empire exists in a world where respect can only be earned through strength. Within this Great Yan Empire, the four great clans have always stood above the rest. Among them, a particular incident in the Lin Clan resulted in the banishment of a certain individual who went on to start his own family, in hopes of one day being recognized again by the Lin Clan, and rejoining them...\n\nHailing from a banished family of the Great Lin Clan, when Lin Dong was very young, he watched, powerless, as his talented father was easily crushed and crippled by the overwhelming genius of the great Lin Clan, Lin Langtian.\n\nWith a despairing father, a heartbroken grandfather, and a suffering family, ever since that fateful day, Lin Dong has been driven by a deep purpose; to take revenge on the man who had taken everything and more from his family.\n\nArmed with nothing but willpower and determination, join Lin Dong as he unknowingly discovers a destiny greater than he could ever hope to imagine when he stumbles upon a mysterious stone talisman...\n\n(Source: Novel Updates)",
  genres: [
    {
      mal_id: 1,
      name: "Action",
      url: "https://myanimelist.net/anime/genre/1/Action",
    },
    {
      mal_id: 2,
      name: "Adventure",
      url: "https://myanimelist.net/anime/genre/2/Adventure",
    },
    {
      mal_id: 10,
      name: "Fantasy",
      url: "https://myanimelist.net/anime/genre/10/Fantasy",
    },
  ],
  score: 8.0,
  year: 2024,
};

const HomePage = () => {
  const userData = useContext(UserContext);
  return (
    <>
      <main className=" max-w-5xl mx-auto  ">
        <div className="flex ">
          <AnimeCard cartoon={mockData} />
        </div>
      </main>
    </>
  );
};

export default HomePage;
