const express = require("express")          // Import file express
const bodyParser = require("body-parser")   // Import bodyPharse (mengambil data dari form)
const cors = require("cors")                // import file cors
const db = require("../config")             // import konfigurasi database
const multer = require("multer")            // untuk upload file
const path = require("path")                // untuk memanggil path direktori
const fs = require("fs")                    // untuk manajemen file

const app = express()                           // Membuat app (menjalankan express)
app.use(cors())                                 // Menghubungkan broweser ke web-service
app.use(bodyParser.json())                         // Menggunakan expreess dalam bentuk json
app.use(bodyParser.urlencoded({extended: true}))   // Convert car / string ke format url yang valid
app.use(express.static(__dirname));             // Menggunakan penyimpanan foto 

/* Make Function Storage */
const storage = multer.diskStorage({
    /* Letak foto disimpan */ 
    destination: (req, file, cb) => {
        /* Setting penyimpanan dengan callback */
        cb(null, './controller/image/foto_siswa'); // Letak dari foto disimpan
    },
    /* Nama file yang akan disimpan */
    filename: (req, file, cb) => {         
        /* Setting nama foto berdasarkan waktu dan path */
        cb(null, "siswa-"+ Date.now() + path.extname(file.originalname))
    }
})

/* Membuat var upload foto */
let upload = multer({storage: storage})

/* Endpoint Create */
app.post("/", upload.single("foto"), (req,res) => {

    /* Menangkap data yang req */
    let data = {
        nis: req.body.nis,                 
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        id_jurusan: req.body.id_jurusan,
        foto: req.file.filename
    }

    /* Jika tidak ada foto yang dikirim */
    if(!req.file){
        /* Tampilkan pesan */
        res.json({
            message: "Tidak ada foto yang dikirim"
        })
    } else {
        /* Jika ada foto yang dikirim */
        let sql = "insert into siswa set ?" // Insert ke tabel siswa

        /* Jalankan Query */
        db.query(sql, data, (error, result) => {
             /* Jika error tendang error */
            if(error) throw error
            /* Kembalikan Pesan */
            res.json({
                message: result.affectedRows+ "Data siswa berhasil ditambahkan"
            })
        })
    }
})

/* Endpoint READ */
app.get("/", (req, res) => {
     /* Membuat sql READ */
    let sql = "select * from siswa" 

    /* Menjalankan query */
    db.query(sql, (error, result) => {  
        let response = null     // Mengirimkan response null
        /* Jika error */
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            /* Jika tidak error */
            response = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }            
        }
        /* Kirim response berbentuk json */
        res.json(response) // send response
    })
})

/* Endpoint Detail */
app.get("/:id", (req, res) => { 
     /* Menangkap data dari req param */
    let data = {
        id_siswa: req.params.id // Menangkap req dari body yang dikirim
    }
    /* Membuar query detail */
    let sql = "select * from siswa where ?" // Menampilkan semua siswa berdasarkan id

    /* Menjalankan query */
    db.query(sql, data, (error, result) => {
        let response = null     // Mengirimkan response null
        /* Jika error */
        if (error) {                   // Jika error
            response = {    
                message: error.message // pesan error
            }            
        } else {    
            /* Jika berhasil  */                  
            response = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }            
        }
        /* Kirim dalam berbentuk json */
        res.json(response) // send response
    })
})

/* Endpoint UPDATE */
app.put("/:id", upload.single("foto"), (req,res) => { // upload foto hannya 1

    let data = null, sql = null

    /* Menangkap id dari parameter */
    let param = {
        id_siswa: req.params.id
    }

    /* Jika tidak ad afile yang di upload */
    if (!req.file) {
        /* Tampilkan data tanpa foto */
        data = {
            nis: req.body.nis,                 
            nama_siswa: req.body.nama_siswa,
            kelas: req.body.kelas,
            id_jurusan: req.body.id_jurusan,
        }
    } else {
        /* Tampilkan data jika menambahkan foto / reupload */
        data = {
            nis: req.body.nis,                 
            nama_siswa: req.body.nama_siswa,
            kelas: req.body.kelas,
            id_jurusan: req.body.id_jurusan,
            foto: req.file.filename
        }

        /* Dapatkan data yang upldate untuk dpat file lama */
        sql = "select * from siswa where ?"

        /* Jalankan query */
        db.query(sql, param, (err, result) => {
            /* Jika error tendang error */
            if (err) throw err
            /* Tampung nama foto dalam berbentuk array */
            let fileName = result[0].foto

            /* Menghapus foto lama */
            let dir = path.join(__dirname,"image/foto_siswa",fileName) // tangkap penyimpanan
            fs.unlink(dir, (error) => {})   // hapus data
        })

    }

    /* Sql unutk update data */
    sql = "update siswa set ? where ?"

    /* Jalankan query */
    db.query(sql, [data,param], (error, result) => {
        /* Jika eror */
        if (error) {
            res.json({
                message: error.message // Tampoilkan error
            })
        } else {
            /* Jika berhasil */
            res.json({
                message: result.affectedRows + " data siswa berhasil di updated" // tampilkan pesan
            })
        }
    })
})

/* Endpoint Delete */
app.delete("/:id", (req,res) => {
    /* Menangkap file yang dikirim req */
    let data = {
        id_siswa: req.params.id
    }

    /* Membuat query sql */
    let sql = "delete from siswa where ?"

     /* Jalankan quernya */
    db.query(sql, data, (error, result) => {
        let response = null
        /* Jika error tendang error */
        if (error) {
            response = {
                message: error.message // tampilkan error
            }
        } else {
            /* Jiaka berhasil */
            response = {
                message: result.affectedRows + " data siswa berhasil dihapus    "
            }
        }
        res.json(response) // send response
    })
})

module.exports = app // Expotr supaya dapat diacc di server.js
