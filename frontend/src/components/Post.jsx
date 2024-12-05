import { useState, useEffect } from "react";
import axios from "../../axios";
import Header from "./parts/Header";
import Footer from "./parts/Footer";
import { BASE_URL } from "../assets/baseURL";
import { useParams, Link } from "react-router-dom";

/**
 * The Post component renders a single blog post with a title, image, and text.
 * The component fetches the post data from the server when the component mounts.
 * @param {Object} props - The props passed to the component.
 * @return {JSX.Element} The rendered component.
 */
function Post(props) {
  const [data, setData] = useState({});
  const { id } = useParams();

  /**
   * Fetches the post data from the server when the component mounts.
   */
  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div className="container">
      <Header />

      <h3>{data.title}</h3>
      {data.imageUrl && (
        <div className="post-image">
          {/* The image is displayed if the post has an image. The image is fetched from the server. */}
          <img src={BASE_URL + data.imageUrl} alt="uploads" />
        </div>
      )}

      <article className="article">{data.text}</article>

      <Link className="button" to="/">
        {/* The link to the homepage is displayed below the post. */}
        zum Startseite
      </Link>

      <Footer />
    </div>
  );
}

export default Post;
