import { useEffect, useRef, useState } from "react";
import { fetchAnimeParams } from "../http";
import CardCarousel from "./Carousel";

const generateQueryString = (params) => {
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
  const typeRef = useRef<HTMLInputElement>(null);

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
    <div className="text- my-8">
      <label htmlFor="status">Select Anime Status:</label>
      <select name="status" id="status" ref={statusRef}>
        <option value="airing">Airing</option>
        <option value="complete">Complete</option>
        <option value="upcoming">Upcoming</option>
      </select>

      <label htmlFor="type">Select Type of Anime:</label>
      <select name="type" id="type" ref={typeRef}>
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

      <label htmlFor="start-date">Start Date:</label>
      <input
        type="date"
        id="start-date"
        ref={startRef}
        defaultValue="1989-11-11"
      />

      <label htmlFor="end-date">End Date:</label>
      <input type="date" id="end-date" ref={endRef} defaultValue="2020-11-11" />

      <label htmlFor="search">Search Keyword:</label>
      <input id="search" ref={stringRef} placeholder="Enter a keyword..." />
      <button onClick={handleUpdateQuery}>Update Query</button>

      {/* <p>DISP FORM DATA: {generateQueryString(formData)}</p>
      <div>
        start ref: {startRef.current ? startRef.current.value : "undefined"}
      </div>
      <div>end ref: {endRef.current ? endRef.current.value : "undefined"}</div>
      <div>
        status ref: {statusRef.current ? statusRef.current.value : "undefined"}
      </div>
      <div>
        string ref: {stringRef.current ? stringRef.current.value : "undefined"}
      </div> */}
      {!isfetching && animeList.length > 0 && (
        <CardCarousel cartoons={animeList} isFetching={isfetching} />
      )}
    </div>
  );
};

export default SearchBar;
