import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";
import seedSuperAdmin from "./app/db";

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    // await mongoose.connect(config.local_database_url as string);

    seedSuperAdmin();

    app.listen(config.port, () => {
      console.log(
        `Educa-International-School server is running on Port  ${`http://localhost:${config.port}`}`
      );
    });
  } catch (error) {
    console.log(error);
  }
}
main();
