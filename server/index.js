const express = require('express');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const PORT = 3000;
const app = express();
app.use(cors());

async function getPhoto(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.gettyimages.it/immagine/drake');
    const data = await page.evaluate(()=>{
        let main = document.querySelector('.GalleryItems-module__searchContent___CYdil');
        let dataOut = [];
        main.querySelectorAll('img').forEach((img)=>{
            dataOut.push(img.src);
        });
        return dataOut;

    })
    browser.close();
    return data[Math.floor(Math.random()* data.length)];
}

async function getQuote(){
    let dataOut = '';
    let res = await fetch("https://type.fit/api/quotes");
    let data = await res.json()  ;
    dataOut = data[Math.floor(Math.random()* data.length)].text;
    return dataOut;
}

app.get('/', async(req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})


app.get('/photo', async(req, res, next)=>{
    let photo = await getPhoto();
    let quote = await getQuote();
    console.log('hit');
    res.send({
        quote: quote,

         photo:photo
    })
})


app.listen(PORT, ()=>{
    console.log('online');
})