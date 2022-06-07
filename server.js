const app = require("./app");
const db = require("./models");

// cofigure db
db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
