const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const multer = require("multer");
const path = require("path");
const PORT = process.env.PORT || 3000;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // The folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Naming the file
  },
});

const upload = multer({ storage: storage });

server.use(middlewares);

// Custom routes to handle image uploads for both create and update

// For creating a new recipe with an image
server.post("/recipes", upload.single("thumbnail"), (req, res, next) => {
  if (req.file) {
    // Add the image path to the request body before it reaches json-server
    req.body.imageUrl = req.file.path;
  }
  next(); // Pass the request to json-server to handle the rest
});

// For updating a recipe with an image
server.patch("/recipes/:id", upload.single("thumbnail"), (req, res, next) => {
  if (req.file) {
    // Update or add the imageUrl field in the request body
    req.body.imageUrl = req.file.path;
  }
  next(); // Pass the request to json-server to handle the update
});

// Use the router after custom middleware
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
