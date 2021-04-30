const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 4000;

var corsOptions = {
    origin:"http://localhost:4200",
    optionsSuccessStatus:200,
};

app.use(cors(corsOptions));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.csv')
      }
    })

app.get('/',(req,res)=>{
    res.send("hiiii");
})

const upload = multer({ storage })


app.post('/file',upload.single('file'),(req,res)=>{
    const file= req.file;
    if (file){
        res.json(file);
    } else {
        throw new Error("WHERE IS THE FILE???");
    }
})

//To show that Express App is running:
app.listen(port,()=>console.log(`listening on port ${port}`))