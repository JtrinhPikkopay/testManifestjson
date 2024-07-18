const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

const PORT = 5000;

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

app.post("/api/v1/manifest", (req, res, next) => {
  try {
    const { name } = req.body;

    const pathToManifest = path.join(__dirname, "build", "manifest.json");
    const manifestData = JSON.parse(fs.readFileSync(pathToManifest, "utf8"));
    manifestData.name = name;
    fs.writeFileSync(pathToManifest, JSON.stringify(manifestData));
    res.json({ message: "Manifest updated" });
  } catch (error) {
    next(error.message);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
