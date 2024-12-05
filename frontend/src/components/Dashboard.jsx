import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Header from "./parts/Header";
import Footer from "./parts/Footer";
import { fetchUser, selectIsAuth } from "../redux/features/user/userSlice";
import {
  fetchRemovePost,
  fetchPosts,
} from "../redux/features/posts/postsSlice";

/**
 * The Dashboard component renders a page with a list of posts created by the
 * current user. The component fetches the user data and posts from the server
 * when the component mounts. The component also handles the deletion of the
 * post and redirects to the login page if the user is not logged in.
 * @param {Object} props - The props passed to the component.
 * @return {JSX.Element} The rendered component.
 */
function Dashboard(props) {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  /**
   * Redirect to the login page if the user is not logged in.
   */
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  /**
   * Select the user data from the Redux store.
   */
  const user = useSelector((state) => {
    return state.user.data;
  });

  /**
   * Select the posts from the Redux store.
   */
  const posts = useSelector((state) => {
    return state.posts.posts;
  });

  /**
   * Fetch the user data and posts from the server when the component mounts.
   */
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    } else {
      dispatch(fetchPosts());
    }
  }, [dispatch, user]);

  /**
   * Get the user ID from the user data.
   */
  const userId = user ? user?._id : null;

  /**
   * Handle the deletion of the post.
   * @param {string} id - The ID of the post.
   */
  const handleRemove = async (id) => {
    await dispatch(fetchRemovePost(id));
    await dispatch(fetchPosts());
  };

  /**
   * Get the posts created by the current user.
   */
  const userPosts = posts.filter((post) => {
    return post.user?._id === userId;
  });

  return (
    <div className="container">
      <Header />
      <h1>Dashboard</h1>

      <section className="articles">
        <h2 className="articles__heading">Latest Posts</h2>

        <ul className="article-ul">
          {userPosts.length === 0 && (
            <>
              <p>Posts not found</p>
              <Link to="/add-post">Create post</Link>
            </>
          )}
          {userPosts.map((post) => {
            const isoDate = post.updatedAt;
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
                <div className="post__buttons">
                  <Link className="edit" to={`/post/${post._id}/edit`}>
                    Edit
                  </Link>
                  <button
                    className="btn"
                    onClick={() => handleRemove(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <Footer />
    </div>
  );
}

export default Dashboard;
