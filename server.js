const app = require("./app");
const port = 8000;

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
