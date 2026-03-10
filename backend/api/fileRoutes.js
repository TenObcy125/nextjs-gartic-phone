const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

function uploadFile(req, res) {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ success: true, filename: req.file.filename });
}

function getFiles(req, res) {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ files });
    });
}

function getImage(req, res) {
    const safe_name = path.basename(req.params.filename);
    const file_path = path.join(uploadsDir, safe_name);

    if (!fs.existsSync(file_path)) {
        return res.status(404).json({ error: 'File not found' });
    }

    return res.sendFile(file_path);
}

module.exports = {
    upload,
    uploadFile,
    getFiles,
    getImage
};