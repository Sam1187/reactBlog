import PostModel from "../models/Post.js";

/**
 * Returns all posts from the database, sorted by date of creation.
 * The query parameters determine the page and the number of documents to return.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getAll = async (req, res) => {
  try {
    // Get the page number and the number of documents to return from the query parameters
    const { page = 1, limit = 10 } = req.query;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the documents from the database, sorted by date of creation
    const posts = await PostModel.find()
      // Populate the user field from the User model
      .populate("user")
      // Sort the documents by date of creation
      .sort({ createdAt: -1 })
      // Skip the specified number of documents
      .skip(Number(skip))
      // Limit the number of documents to return
      .limit(Number(limit))
      // Execute the query and return the documents
      .exec();

    // Get the total number of documents in the collection
    const total = await PostModel.countDocuments();

    // Return the response with the documents, the total number of documents, the page number, and the limit
    res.json({
      posts,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    // Handle any errors that occurred during the query
    console.log(err);
    res.status(500).json({
      message: "Unable to retrieve articles",
    });
  }
};


/**
 * Returns a single post from the database, specified by the post ID.
 * The post is fetched using the findOneAndUpdate method, which allows
 * to update the post's viewsCount field with the number of views.
 * The returnDocument option is set to "After" to return the updated post.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      // Find the post by its ID
      { _id: postId },
      // Increment the viewsCount field by 1
      { $inc: { viewsCount: 1 } },
      // Return the updated post
      { returnDocument: "After", new: true }
    )
      .then((doc) => res.json(doc))
      .catch((err) => res.status(500).json({ message: "Article not found" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Unable to retrieve articles",
    });
  }
};

/**
 * Creates a new post in the database.
 * The function extracts post details from the request body and the user ID from the request object.
 * The new post is saved to the database, and the created post is returned in the response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const create = async (req, res) => {
  try {
    // Create a new PostModel document with data from the request body
    const doc = new PostModel({
      title: req.body.title, // The title of the post
      text: req.body.text,   // The content of the post
      imageUrl: req.body.imageUrl, // The image URL for the post
      user: req.userId,      // The ID of the user creating the post
      tags: req.body.tags,   // An array of tags associated with the post
    });

    // Save the new post to the database
    const post = await doc.save();
    
    // Return the created post in the response
    res.json(post);
  } catch (error) {
    // Log the error for debugging purposes
    console.log(error);
    
    // Return a 500 status with an error message if post creation fails
    res.status(500).json({
      message: "Failed to create article", // "Failed to create post"
    });
  }
};

/**
 * Deletes a post from the database.
 * The function takes the post ID as a parameter and searches for the post in the database.
 * If the post is found, the function deletes it using the findOneAndDelete method.
 * If the post is not found, the function returns a 404 status with an error message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by its ID and delete it
    PostModel.findOneAndDelete({
      _id: postId,
    })
      // Return a success message if the post is deleted
      .then(() => res.json({ success: true }))
      // Return a 404 status with an error message if the post is not found
      .catch((err) => res.status(404).json({ message: "Article not found" }));
  } catch (err) {
    console.log(err);
    // Return a 500 status with an error message if an error occurs during the deletion
    res.status(500).json({
      message: "Failed to delete article",
    });
  }
};

/**
 * Updates a post in the database.
 * The function takes the post ID from the request parameters and updates
 * the post fields with the data provided in the request body.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    // Update the post with the specified ID
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        // Set updated fields from request body
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    // Respond with success message
    res.json({
      success: true,
    });
  } catch (err) {
    // Log the error for debugging purposes
    console.log(err);
    
    // Return a 500 status with an error message if post update fails
    res.status(500).json({
      message: "Failed to update article", // "Failed to update post"
    });
  }
};

/**
 * Searches for posts in the database.
 * The function takes a search query from the request query parameters and
 * returns a list of posts that match the query.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const search = async (req, res) => {
  const query = req.query.q;

  // Check if the search query is empty
  if (!query) {
    return res.status(400).json({ message: "Search query not specified" });
  }

  try {
    // Find posts that match the search query
    const posts = await PostModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { text: { $regex: query, $options: "i" } },
      ],
    }).populate("user");

    // Check if the search query has no results
    if (posts.length === 0) {
      return res.status(404).json({ message: "Nothing found" });
    }

    // Return the search results
    res.json(posts);
  } catch (err) {
    // Log the error for debugging purposes
    console.log(err);

    // Return a 500 status with an error message if the search fails
    res.status(500).json({
      message: "Failed to perform search",
    });
  }
};
