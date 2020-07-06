const express = require('express');
const app = express();
app.use(express.json());
const Joi = require('@hapi/joi');
const Str = require("@supercharge/strings");

const genres = [ 
    {id:1, name: "genre 1", token: "thsuw282bw82j9j38s"},
    {id:2, name: "genre 2", token: "wkjiejudejms99r93j"},
    {id:3, name: "genre 3", token: "jd93j93o9wqk92knew"}
]

const schema = Joi.object({
  name: Joi.string().min(4).required(),
});

app.get('/api/genres', (req,res)=>{
    return res.status(200).send(JSON.stringify(genres));
});

app.get('/api/genres/:token', (req , res) => {
    let genre = findGenreByToken(req.params.token);
    if (genre.length === 0) {
        return res.status(404).send("Genre Does Not Exist");
    }
    else{
        return res.status(200).send(genre);
    }
})

app.post('/api/genres', (req,res) => {
    let {error} = validateInput(req);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    else{
        let genre = findGenreByName(req.body.name);
        if (genre.length > 0) {
            return res.status(400).send("Genre Name Already Exist")
        }
        else{
            let new_genre = {
                id: genres.length + 1,
                name: req.body.name,
                token: Str.random(15)
            }
            genres.push(new_genre);
            return res.status(200).send(new_genre);
        }
    }
})

app.delete("/api/genres/:token", (req, res) => {
    let genre = findGenreByToken(req.params.token);
    if (genre.length === 0) {
        return res.status(404).send("Genre Does Not Exist");
    }
    else{
        let genre_index = genres.indexOf(genre);
        genres.splice(genre_index,1);
        return res.status(200).send(genre);
    }
});

app.put('api/genres/:token', (req,res)=> {
    let { error } = validateInput(req);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    else{
        let genre = findGenreByToken(req.params.token);
        if (genre.length === 0) {
             return res.status(404).send("Genre Does Not Exist");
        }
        else{
            genre.name = req.body.name;
            genre.token = Str.random(15);
            return genre;
        }
    }
    
    
})

function findGenreByToken(token) {
    let genre = genres.filter(search_genre => search_genre.token === token);
    return genre;
}

function findGenreByName(name) {
    let genre = genres.filter(search_genre => search_genre.name === name);
    return genre;
}

function validateInput(genre){
let result = schema.validate(genre.body);
return result;
}




const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`)
})
