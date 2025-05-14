import express from 'express'
import pg from 'pg'


const app = express()
const port = 3000
let countries;
let country_code;
let user_id;
let users;
let errorMsg;

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


const db = new pg.Client({
    user : 'postgres',
    host : 'localhost',
    database : 'YourDBName',
    password : 'YourDBPassword',
    port : 5432
})
db.connect()



app.get('/' , async (req,res)=>{
    users = await getUsers()
    let user
    if(user_id){
        user = users.find((user) => user.id == user_id)
    }
    const response = await db.query('SELECT country_code FROM visited_countries WHERE user_id = $1' , [user_id])
    countries = response.rows.map((country) => country.country_code);
    res.render('index.ejs' , {
        countries : countries , 
        total : countries.length ,
        users : users , color : user?.color ? user.color : 'teal', 
        error : errorMsg
        })
})
app.post('/user' , (req , res) =>{
    user_id = req.body.user 
    const addNew = req.body.add ? true : false
    if(addNew){
        res.render('new.ejs')
    }else{
        errorMsg = 'User Selected!'
        res.redirect('/')
    }
    
})
app.post('/new' , async(req , res) =>{
    const response = await db.query('INSERT INTO users(username , color) VALUES($1 , $2)' , [req.body.name , req.body.color])
    errorMsg = 'New User Succesfully Created!!'
    res.redirect('/')
})
app.post('/add' , async (req , res)=>{
    try {
        const response_1 = await db.query('SELECT country_code FROM countrydata WHERE country_name = $1 ', [req.body.country])    
        if (response_1.rows.length === 0) {
            console.error(`Country ${req.body.country} not found in the database.`);
            throw new Error(`Country "${req.body.country}" not in database!`)
        }else if(!user_id) {
            throw new Error('Select or add a new member!')
        }else{
            country_code = response_1.rows[0].country_code 
        }
        if(await checkIfExists(country_code , user_id)){
            throw new Error("You've already visited this country");
        }else{
            const response_2 = await db.query('INSERT INTO visited_countries (user_id , country_code) VALUES ($1 , $2)' , [user_id , country_code])
            errorMsg = 'Added Succesfully!😊'
        }
    res.redirect('/')
    }catch(error){
        console.error('Error adding country:', error.message)
        errorMsg = error.message
        res.redirect('/')
    }
})

async function getUsers(){
    const response = await db.query('SELECT * FROM users')
    return response.rows
}
async function checkIfExists(country_code , user_id) {
    const response = await db.query('SELECT * FROM visited_countries WHERE country_code = $1 AND user_id = $2', [country_code , user_id]);
    return response.rows.length > 0;
}
app.listen(port , ()=> console.log(`Server is running on http://localhost:${port}`))