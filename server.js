const express = require('express')
const bodyParser = require ('body-parser')
const cors = require('cors') //4.5k (gzipped: 1.9k)
const headphonesArray = require('./db/headphones-list.json')
const cart = require('./db/cart.json')
const path = require('path')
const fs = require('fs')


const PORT = 8000
const DB = path.join('db','cart.json')


const app = express
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.get('/headphones/get-list',(red, res)=> {
    //отправка массива в качестве ответа
    res.status(200)
    res.send(headphonesArray);
});

app.get('/cart/get',(req, res)=> {
    res.status(200)
    res.send(cart);

})


app.post('/cart/add',(req,res)=> {
    const postData = req.body

    if(!postData){
        return res.status(400).send('Bad request')
    }

    fs.readFile(DB,(err,data) => {
        if(err)throw err;

        try{
            let cartData = JSON.stringify([...JSON.parse(data),postData])
            fs.writeFile(DB,cartData,(writeErr) =>{
                if(writeErr){
                    return res.status(500).send('Не удалось воспроизвести запись')
                }
                return res.status(200).send('Успешно добавлен товар в корзину')
            })
        }catch{
            return res.status(500).send('Не удалось произвести запись')
        }
    })

       
    res.status(200)
    res.send();
})



//app.listen(PORT, () => {
//    console.log(`Сервер запущен на порту ${PORT}`);
//});