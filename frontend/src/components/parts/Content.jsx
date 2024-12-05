import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../redux/features/posts/postsSlice";
import { Link } from "react-router-dom";
import { selectIsAuth } from "../../redux/features/user/userSlice";


/**
 * The Content component renders the main content of the page.
 * It includes a hero image, a section with the latest posts, and a pagination
 * component.
 *
 * @param {Object} props - The props passed to the component.
 * @return {JSX.Element} The rendered component.
 */
function Content(props) {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  /**
   * The posts state from the Redux store.
   * @type {Array<Object>}
   */
  const posts = useSelector((state) => state.posts.posts);

  /**
   * The total number of posts in the Redux store.
   * @type {Number}
   */
  const totalPosts = useSelector((state) => state.posts.total);

  /**
   * The current page state.
   * @type {Number}
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * The number of posts per page.
   * @type {Number}
   */
  const postsPerPage = 5;

  /**
   * The effect that fetches the posts when the component mounts or the page
   * changes.
   */
  useEffect(() => {
    dispatch(fetchPosts({ page: currentPage, limit: postsPerPage }));
  }, [dispatch, currentPage]);

  /**
   * The total number of pages.
   * @type {Number}
   */
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  /**
   * The function that handles the page change.
   * @param {Number} page - The new page number.
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const username = useSelector((state) => {
    return state.user.data ? state.user.data.username : "";
  });

  return (
    <div className="container">
      <div className="author">
        <h1 className="author__heading">
          
          Hi, {isAuth ? username : "Andrii"}</h1>
        <p className="author__body">This is a test project</p>
      </div>

      <img
        src="/hero-image.png"
        alt="person looking out through window"
        className="hero-image"
        width={981}
        height={528}
      />

      <section className="articles">
        <h2 className="articles__heading">Latest Posts</h2>
        <ul className="article-ul">
          {posts.map((post) => {
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

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination__button ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Content;
