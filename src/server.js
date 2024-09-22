import app from "./app.js";
import connectDB from "./config/db.js";

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB(); // Establish MongoDB connection
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log("Some error occured!");
  }
});
