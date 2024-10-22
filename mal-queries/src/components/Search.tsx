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
    .filter(([key, value]) => {
      if (key) {
        return value;
      }
    })
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
    start_date: "",
    end_date: "",
    status: "",
    q: "",
    type: "",
  });
  const [tampered, setTampered] = useState(false);

  const startRef = useRef<HTMLInputElement>(null); // Ref for an input element
  const endRef = useRef<HTMLInputElement>(null); // Ref for an input element
  const statusRef = useRef<HTMLSelectElement>(null); // Ref for a select element
  const stringRef = useRef<HTMLInputElement>(null); // Ref for another input element
  const typeRef = useRef<HTMLSelectElement>(null);
  // Event handler to log or update query
  const handleUpdateQuery = () => {
    // Ensure tampered is set to true, and formData is updated simultaneously
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

    // Only set tampered after formData is fully updated
    setTampered(true);
  };

  useEffect(() => {
    if (!tampered) {
      return;
    }
    setIsFetching(true);
    const fetchList = async () => {
      try {
        const resData = await fetchAnimeParams(generateQueryString(formData));
        console.log(generateQueryString(formData));
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
        <div className="col-span-12 mx-auto max-w-80 sm:max-w-full sm:col-span-4">
          <div className="flex flex-col">
            <label htmlFor="status">Select Anime Status</label>
            <select
              name="status"
              id="status"
              ref={statusRef}
              className=" p-1 my-1 bg-neutral-800 border border-neutral-500 rounded-md"
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
              className=" p-1 my-1 bg-neutral-800 border border-neutral-500 rounded-md"
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
            <div className="flex justify-around gap-4">
              <input
                type="date"
                id="start-date"
                ref={startRef}
                defaultValue=""
                className=" bg-neutral-800 w-full p-1 my-1  border  border-neutral-500 rounded-md"
              />
              <button
                className=""
                onClick={() => {
                  if (!startRef.current) {
                    return;
                  }
                  startRef.current.value = "";
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="end-date">End Date:</label>
            <div className="flex justify-around gap-4">
              <input
                type="date"
                id="end-date"
                ref={endRef}
                defaultValue=""
                className="w-full p-1 my-1 bg-neutral-800 border border-neutral-500 rounded-md"
              />
              <button
                className=""
                onClick={() => {
                  if (!endRef.current) {
                    return;
                  }
                  endRef.current.value = "";
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-col"></div>
        </div>

        <div className="col-span-12 mt-8 mx-auto max-w-80 space-y-8 sm:max-w-full sm:col-span-8 sm:pl-16 flex flex-col justify-between items-center">
          <label
            htmlFor="search"
            className="w-full text-center text-base sm:text-2xl"
          >
            Insert related keywords
          </label>
          <input
            id="search"
            ref={stringRef}
            className="bg-neutral-800 text-center px-1 sm:px-4 m-1 sm:text-xl border border-neutral-500 rounded-md min-h-12"
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
      <div className="h-84">
        {!tampered && (
          <div className="min-h-84 max-w-5xl mx-auto text-xl animate-bounce text-center ">
            <p className="my-32">Set Your Search Parameters and Click SEARCH</p>
          </div>
        )}
        {isfetching && (
          <div className=" max-w-5xl mx-auto text-xl animate-bounce text-center">
            <p className="my-32">Loading</p>
          </div>
        )}
        {tampered && !isfetching && animeList.length > 0 && (
          <CardCarousel
            runningNumber={1}
            cartoons={animeList}
            isFetching={isfetching}
          />
        )}
        {tampered && !isfetching && animeList.length === 0 && (
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-center my-16 text-rose-400">
              Couldn't find anime with current parameters, please try changing
              the filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
