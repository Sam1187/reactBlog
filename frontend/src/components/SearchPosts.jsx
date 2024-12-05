import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import Header from "./parts/Header";
import Footer from "./parts/Footer";

/**
 * The SearchPosts component renders a search form and a list of
 * posts that match the search query. The component fetches the
 * search results from the server when the search form is
 * submitted.
 *
 * @return {JSX.Element} The rendered component.
 */
function SearchPosts() {
  const [query, setQuery] = useState(""); // The search query
  const [results, setResults] = useState([]); // The search results
  const [error, setError] = useState(""); // The error message

  /**
   * Handles the search form submission.
   * Fetches the search results from the server and updates the
   * component state with the results.
   */
  const handleSearch = async () => {
    try {
      // Fetch the search results from the server
      const response = await axios.get(`/posts/search?q=${query}`);
      setResults(response.data);
      setError("");
    } catch (err) {
      // Set the error message
      setError(err.response?.data?.message || "Error occurred while searching");
      setResults([]);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Search Posts</h2>
        <input
          type="text"
          placeholder="Search for posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn" onClick={handleSearch}>
          Search
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul className="article-ul">
          {results.map((post) => {
            const isoDate = post.createdAt;
            const date = new Date(isoDate);

            return (
              <li key={post._id}>
                <Link to={`/post/${post._id}`}>
                  <h3>{post.title}</h3>
                  <div className="post__body">
                    <div>Viewed: {post.viewsCount}</div>
                    <div>
                      Author:{" "}
                      {post.user.username ? post.user.username : "Unknown"}
                    </div>
                    <div>{date.toLocaleDateString()}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Footer />
    </>
  );
}

export default SearchPosts;
