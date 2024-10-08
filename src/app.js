const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const clubRoutes = require('./controllers/clubsController');
const PORT = 8080;
const dotenv = require('dotenv').config();


const hbs = exphbs.create({
    defaultLayout: "main", 
    layoutsDirectory: path.join(__dirname, "views/layouts"), 
    partialsDirectory: path.join(__dirname, "views/partials")
  });

app.engine("handlebars", hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../static')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());    

app.use('/', clubRoutes);

app.get('/api/google-maps-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
