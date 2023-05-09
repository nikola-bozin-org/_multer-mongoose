const express = require('express');
const { default: mongoose } = require('mongoose');
const server = express();
const multer = require('multer');
const { connect, connectionLink } = require('./mongo-connect');
const fs = require('fs');
const path = require('path');

const ImageSchema = mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
})
ImageModel = mongoose.model('imageModel',ImageSchema)

const Storage = multer.diskStorage({
  destination:'uploads',
  filename:(req,file,cb)=>{
    cb(null,Date.now() +'_'+ file.originalname)
  }
})
const upload = multer({
  storage:Storage
}).single('testImage')

const port = 9871;
server.use(express.json()); 
server.use(express.urlencoded({ extended: true })); 




//use this 
server.get('/:imageName', async (req, res) => {
  try {
      const image = await ImageModel.findOne({ name: req.params.imageName });

      if (!image || !image.image || !image.image.data) {
          res.status(404).json({ message: 'Image not found.' });
          return;
      }
      res.setHeader('Content-Type', image.image.contentType);
      res.send(image.image.data);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
  }
});
server.post('/upload',(req,res)=>{
  upload(req,res,async(err)=>{
    if(err) console.log(err)
    else{
      const newImage = ImageModel({
        name: req.body.name,
        image: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
        }
      });
      try{
      await newImage.save();
      res.send("Uploaded image!")
      }catch(e){
        res.send(`ERROR: ${e.message}`)
      }
    }
  })
})

const startServer = async()=>{
  server.listen(port, () => {
    console.log(`Server listening at PORT: ${port}`);
    connect(connectionLink,()=>{console.info("DB!")});
  });
}

startServer();