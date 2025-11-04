const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");

// Impor database Sequelize
const db = require('./models');

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const ruteBuku = require("./routes/books");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Home Page for API");
});
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// Hubungkan Sequelize dan jalankan server
db.sequelize.sync()
  .then(() => {
    console.log('✅ Database connected & models synced successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Express server running at http://localhost:${PORT}/`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });
