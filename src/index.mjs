import express from 'express';
import path from 'path';
import hbs from 'hbs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 3000;

const publicPath = express.static(path.join(__dirname, '../public'));
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();
app.use(publicPath);
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
    res.render('index', {
        title: "Chat app"
    });
});

app.listen(PORT, () => {
    console.log(`Server started at ${PORT} 🔥🔥🔥`)
})