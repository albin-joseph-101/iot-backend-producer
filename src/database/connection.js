import mongoose from "mongoose";
const uri = process.env.DB_URL;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.log(err));
