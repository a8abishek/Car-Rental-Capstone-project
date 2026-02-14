import mongoose from "mongoose";

//connection
async function DBConnection() {
  try {
    // Connection Query
    await mongoose
      .connect(process.env.DB_CONNECTION_STRING)
      .then(() => {
        console.log("DB CONNECTED SUCCESSFULLY!");
      })
      .catch((error) => {
        if (error) throw new Error("Failed to connect with DB!");
      });
  } catch (error) {
    console.log(error);
    process.exit(1); //Server stop
  }
}

export default DBConnection;
