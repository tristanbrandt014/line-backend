import mongoose from "mongoose";

const url =
  process.env.MONGODB_URI || `mongodb://line:1234@127.0.0.1:27020/admin`;

export const connect = () =>
  mongoose.connect(
    url,
    { useNewUrlParser: true },
    err => {
      if (err) {
        throw new Error(err.message);
      } else {
        console.log("Connected to MongoDB");
      }
    }
  );
