import { useEffect, useRef, useState } from "react";
import { fetchAnimeParams } from "../http";
import CardCarousel from "./Carousel";

const generateQueryString = (params: {
  start_date: string;
  end_date: string;
  status: string;
  q: string;
  type: string;
}) => {
  const queryString = Object.entries(params)
    .filter(([key, value]) => value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return queryString ? `?${queryString}` : ""; // Return the query string with '?' or empty if no parameters
};

const SearchBar = () => {
  const [animeList, setAnimeList] = useState([]);
  const [isfetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    start_date: "1989-11-11",
    end_date: "2020-11-11",
    status: "",
    q: "",
    type: "",
  });

  const startRef = useRef<HTMLInputElement>(null); // Ref for an input element
  const endRef = useRef<HTMLInputElement>(null); // Ref for an input element
  const statusRef = useRef<HTMLSelectElement>(null); // Ref for a select element
  const stringRef = useRef<HTMLInputElement>(null); // Ref for another input element
  const typeRef = useRef<HTMLSelectElement>(null);

  // Event handler to log or update query
  const handleUpdateQuery = () => {
    setFormData((pv) => {
      if (
        startRef.current &&
        statusRef.current &&
        stringRef.current &&
        endRef.current &&
        typeRef.current
      ) {
        return {
          start_date: startRef.current.value,
          end_date: endRef.current.value,
          status: statusRef.current.value,
          q: stringRef.current.value,
          type: typeRef.current.value,
        };
      }
      return pv;
    });
  };
  useEffect(() => {
    setIsFetching(true);
    const fetchList = async () => {
      try {
        const resData = await fetchAnimeParams(generateQueryString(formData));
        const animeList = resData.data;
        setAnimeList(animeList);
      } catch (err) {
        setAnimeList([]);
      } finally {
        setIsFetching(false);
      }
    };
    fetchList();
  }, [formData]);

  return (
    <div className="text-md my-8 ">
      <div className="max-w-5xl mx-auto grid grid-cols-12 mb-12">
        <div className="col-span-4">
          <div className="flex flex-col">
            <label htmlFor="status">Select Anime Status</label>
            <select
              name="status"
              id="status"
              ref={statusRef}
              className=" p-1 my-1 bg-transparent border border-neutral-500 rounded-md"
            >
              <option value="">Any</option>
              <option value="airing">Airing</option>
              <option value="complete">Complete</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="type">Select Type of Anime:</label>
            <select
              name="type"
              id="type"
              ref={typeRef}
              className=" p-1 my-1 bg-transparent border border-neutral-500 rounded-md"
            >
              <option value="tv">TV</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
              <option value="ona">ONA</option>
              <option value="music">Music</option>
              <option value="cm">CM</option>
              <option value="pv">PV</option>
              <option value="tv_special">TV Special</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="start-date">Start Date:</label>
            <input
              type="date"
              id="start-date"
              ref={startRef}
              defaultValue="1989-11-11"
              className=" p-1 my-1 bg-transparent border border-neutral-500 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="end-date">End Date:</label>
            <input
              type="date"
              id="end-date"
              ref={endRef}
              defaultValue="2020-11-11"
              className=" p-1 my-1 bg-transparent border border-neutral-500 rounded-md"
            />
          </div>

          <div className="flex flex-col"></div>
        </div>

        <div className="col-span-8 pl-16 flex flex-col justify-between items-center">
          <label htmlFor="search" className="w-full text-center text-2xl">
            Insert related keywords
          </label>
          <input
            id="search"
            ref={stringRef}
            className="bg-transparent text-center px-4 m-1 text-xl border border-neutral-500 rounded-md min-h-12"
            placeholder="..."
          />

          <button
            onClick={handleUpdateQuery}
            className="px-2 py-1 font-mono rounded-lg transition-colors font-light text-lg bg-green-700 hover:bg-green-400 text-white hover:text-slate-700 border border-neutral-500 "
          >
            Search Anime !
          </button>
        </div>
      </div>

      {!isfetching && animeList.length > 0 && (
        <CardCarousel
          runningNumber={1}
          cartoons={animeList}
          isFetching={isfetching}
        />
      )}
    </div>
  );
};

export default SearchBar;
