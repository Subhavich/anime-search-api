import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <>
      <main className="home-main container">
        <h1>I tried to fetch animes with MAL api</h1>
        <Link to="/App">
          <button>Here is the result</button>
        </Link>
      </main>
    </>
  );
};

export default HomePage;
