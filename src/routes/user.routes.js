import { Router } from "express";
import {
  getFavouriteMovies,
  loginUser,
  registerUser,
  addMovieToFavourites,
  removeMovieFromFavourites,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/get-favourite-movies", protect, getFavouriteMovies);

userRouter.post("/add-to-favourite", protect, addMovieToFavourites);

userRouter.post("/remove-from-favourite", protect, removeMovieFromFavourites);

export default userRouter;
