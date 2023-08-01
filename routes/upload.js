var router = require("express").Router();
const path = require("path");
var fs = require("fs");
const {upload, multer}  = require('../utils/multer')
const cpUpload = multer.fields([{ name: "file", maxCount: 1 }]);

// const backend = require("../config").backend;
// var multer = require("../utils/multer");

router.post('/uploader', cpUpload,(req,res)=>{
    console.log("file:",req.file ,"Files:",req.files)
    res.json({ url: `http://localhost:8080/uploads/${req.files["file"][0].filename}` });
})
// router.post('/uploader', upload.fields([{  name:'file',maxCount:1}]),(req,res)=>{
//     console.log("file:",req.file ,"Files:",req.files)
//     res.send('Image uploaded successfully')
// })

router.post("/delete", function (req, res, next) {
	if (req.body.url) {
		fs.unlink(path.join(process.cwd(), "/public", req.body.url), function (err) {
			if (err) {
				return res.sendStatus(204);
			}
			// if no error, file has been deleted successfully
			return res.json({ status: 200, event: "File deleted Successfully" });
		});
	} else {
		if (!event) return res.sendStatus(204);
	}
	// unlink the files
});

module.exports = router;
