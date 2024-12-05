import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Header from "./parts/Header";
import Footer from "./parts/Footer";
import axios from "../../axios";
import { BASE_URL } from "../assets/baseURL";
import { useNavigate, Navigate, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../redux/features/user/userSlice";
import SimpleMDE from "react-simplemde-editor";

import "simplemde/dist/simplemde.min.css";

/**
 * The Addpost component renders a page for creating or editing a post.
 * It handles the input of the post title, markdown text, and an image.
 * The component uses the react-simplemde-editor library for the markdown editor.
 * If the user has not logged in, the component redirects to the login page.
 * If the post is being edited, the component fetches the post from the server and fills the form with the post data.
 * When the form is submitted, the component sends a request to the server to create or update the post.
 * After the post has been created or updated, the component redirects to the post page.
 *
 * @param {Object} props - The props passed to the component.
 * @return {JSX.Element} The rendered component.
 */
function Addpost(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  /**
   * Handles the change of the markdown editor value.
   * @param {string} value - The new value of the markdown editor.
   */
  const handleChange = useCallback((value) => {
    setValue(value);
  }, []);

  /**
   * Fetches the post from the server if the post is being edited.
   */
  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setValue(data.text);
          setImageUrl(data.imageUrl);
        })
        .catch(() => {
          alert("Error");
        });
    }
  }, []);

  /**
   * Handles the change of the image file input.
   * @param {Event} event - The change event.
   */
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      console.log(data);

      setImageUrl(data.url);
    } catch (e) {
      console.warn(e);
    }
  };

  /**
   * Handles the click of the delete image button.
   */
  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  /**
   * Handles the submission of the form.
   * If the post is being edited, the component sends a PATCH request to the server.
   * Otherwise, the component sends a POST request to the server.
   * After the request has been sent, the component redirects to the post page.
   */
  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imageUrl,
        text: value,
      };
      console.log(fields);

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      console.log(data);
      const _id = isEditing ? id : data._id;
      navigate(`/post/${_id}`);
    } catch (e) {
      console.warn(e);
      alert("Create error");
    }
  };

  /**
   * Creates an object with the options for the markdown editor.
   * The options include the spell checker, max height, autofocus, placeholder, and status.
   * The object is memoized to prevent unnecessary re-renders.
   * @return {Object} The options for the markdown editor.
   */
  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Type your text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  return (
    <div className="container">
      <Header />
      <h1>Create post</h1>

      <label htmlFor="title">Title</label>
      <textarea
        name="title"
        value={title}
        id=""
        onChange={(e) => setTitle(e.target.value)}
      ></textarea>
      <label>Markdown Editor</label>
      <SimpleMDE value={value} onChange={handleChange} options={options} />
      <button onClick={() => inputFileRef.current.click()}>Upload image</button>
      <input
        type="file"
        name="imageUrl"
        ref={inputFileRef}
        onChange={handleChangeFile}
        hidden
      />

      {imageUrl && (
        <>
          <button onClick={onClickRemoveImage}>Delete image</button>
          <hr />
          <div className="post-image">
            <img src={`https://reactblog-5l05.onrender.com/${imageUrl}`} alt="Uploaded" />
          </div>
        </>
      )}

      <button onClick={onSubmit}>{isEditing ? "Update" : "Create"}</button>
      <Footer />
    </div>
  );
}

export default Addpost;
