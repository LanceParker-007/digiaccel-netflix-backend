import { generateToken } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

// Register user
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ email, password });
    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        email: user.email,
        favouriteMovies: user.favouriteMovies,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, Error in registering user!",
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("here 1");

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });
  }

  console.log("here 2");
  try {
    console.log("here 3");
    const user = await User.findOne({ email });

    console.log("here 4");

    if (user && (await user.matchPassword(password))) {
      console.log("here 5");
      res.status(200).json({
        success: true,
        _id: user._id,
        email: user.email,
        favouriteMovies: user.favouriteMovies,
        token: generateToken(user._id),
      });
    } else {
      console.log("here 6");
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    console.log("here 7");
  } catch (error) {
    console.log("here 8");
    res
      .status(500)
      .json({ success: false, message: "Server error, Error in login user!" });
  }
};

// get users favourite movies list
export const getFavouriteMovies = async (req, res) => {
  try {
    // Find the user by the id stored in the request by the protect middleware
    const user = await User.findById(req.user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Favourite movies fetched successfully!",
      favouriteMovies: user.favouriteMovies, // Return the updated array
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, Unable to fetch favourite movies!",
    });
  }
};

// Add movie to user's favourite movies list
export const addMovieToFavourites = async (req, res) => {
  const { id, name, image } = req.body; // Movie data from frontend

  if (!id || !name || !image) {
    return res.status(400).json({
      success: false,
      message: "Invalid input, all fields (id, name, image) are required",
    });
  }

  try {
    // Find the user by the id stored in the request by the protect middleware
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the movie is already in the user's favorites
    const movieExists = user.favouriteMovies.some(
      (movie) => movie.id.toString() === id.toString()
    );

    if (movieExists) {
      return res.status(400).json({
        success: false,
        message: "Movie already in favourites",
      });
    }

    // Add the new movie to the user's favouriteMovies array
    user.favouriteMovies.push({ id, name, image });

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Movie added to favourites",
      favouriteMovies: updatedUser.favouriteMovies, // Return updated array
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, failed to add movie to favourites!",
    });
  }
};

// Remove movie from favourite movies list
export const removeMovieFromFavourites = async (req, res) => {
  const { id } = req.body; // Movie ID from frontend

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid input, movie ID is required",
    });
  }

  try {
    // Find the user by the id stored in the request by the protect middleware
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove the movie from the user's favouriteMovies array
    user.favouriteMovies = user.favouriteMovies.filter(
      (movie) => movie.id.toString() !== id.toString()
    );

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Movie removed from favourites",
      favouriteMovies: updatedUser.favouriteMovies, // Return updated array
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, failed to remove movie from favourites!",
    });
  }
};
