const multer=require('multer');
const path = require('path');
// const storage=multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null, 'uploads')
//     },
//     filename:(req,file,callback)=>{
//         console.log(file)
//         callback(null,'DUMMMY.png')
//     }
// })
// const upload=multer({storage:storage,
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//            callback('Only images are allowed');
//         }
//         callback(null, true)
//     },
//     limits:{
//         fileSize: 1024 * 1024
//     }
// })

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(process.cwd(), "/public", "uploads"));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
	},
});
// router.post('/upload',upload.single('image'),(req,res)=>{
//     res.send('Image uploaded successfully')
// })



module.exports={
    // upload,
    multer: multer({ storage})
}