const express = require("express")          // Import file express
const bodyParser = require("body-parser")   // Import bodyPharse (mengambil data dari form)
const cors = require("cors")                // import file cors
const db = require("../config")             // import konfigurasi database
const multer = require("multer")            // untuk upload file
const path = require("path")                // untuk memanggil path direktori
const fs = require("fs")                    // untuk manajemen file

const app = express()                           // Membuat app (menjalankan express)
app.use(cors())                                 // Menghubungkan broweser ke web-service
app.use(express.json())                         // Menggunakan expreess dalam bentuk json
app.use(express.urlencoded({extended: true}))   // Convert car / string ke format url yang valid
app.use(express.static(__dirname));             // Menggunakan tempat penyimpanan foto 

/* Function Penyimpanan */
const storage = multer.diskStorage({ 
    /* Letak foto disimpan */
    destination: (req, file, cb) => {
        /* Setting penyimpanan dengan callback */
        cb(null, './controller/image/foto_guru'); // Letak dari foto disimpan
    },
    /* Nama file yang akan disimpan */
    filename: (req, file, cb) => {          
        /* Setting nama foto berdasarkan waktu dan path */
        cb(null, "guru - "+ Date.now() + path.extname(file.originalname))
    }
})

/* Membuat var upload foto */
let upload = multer({storage: storage})

/* Endpoint Create */
app.post("/", upload.single("foto"), (req,res) => { // uplooad foto hanya satu

    /* Menangkap data yang req */
    let data = {
        nip: req.body.nip,
        nama_guru: req.body.nama_guru,
        tgl_lahir: req.body.tgl_lahir,
        alamat: req.body.alamat,
        foto: req.file.filename
    }

    /* Jika tidak ada foto yang dikirim */
    if (!req.file) {
        /* Tampilkan pesan */
        res.json({
            message: "Tidak ada foto yang di upload"
        })
    } else {
        /* Jika ada foto yang dikirim */
        let sql = "insert into guru set ?" // Insert ke tabel guru

        /* Jalankan Query */
        db.query(sql, data, (error, result) => {
            /* Jika error tendang error */
            if(error) throw error
            /* Kembalikan Pesan */
            res.json({
                message: result.affectedRows + " data guru berhasil ditambahkan"
            })
        })
    }
})

/* Endpoint Read */
app.get("/", (req, res) => {
    /* Membuat sql READ */
    let sql = "select * from guru"

    /* Jalankan query */
    db.query(sql, (error, result) => {
        let response = null // Melakukan default response
        /* Jika error */
        if (error) {
            response = {
                message: error.message // tampilkan pesan error
            }            
        } else {
            /* Jika tidak error */
            response = {
                count: result.length, // tampilkan jumlah data
                guru: result // tampilkan isi data
            }            
        }
        /* Kirim response berbentuk json */
        res.json(response) 
    })
})

/* Enpoint Detail */
app.get("/:id", (req, res) => {

    /* Menangkap data dari req param */
    let data = {
        id_guru: req.params.id
    }

    /* Membuar query detail */
    let sql = "select * from guru where ?"

    /* Jalankan Query */
    db.query(sql, data, (error, result) => {
        let response = null // Melakukan default response
        /* Jika error */
        if (error) {
            response = {
                message: error.message // tampilkan pesan error
            }            
        } else {
            /* Jika berhasil  */
            response = {
                count: result.length, // tampilkan jumlah data
                guru: result          // tampilkan isi data
            }            
        }
        /* Kirim dalam berbentuk json */
        res.json(response) // kirim response
    })
})

/* Enpoint Update */
app.put("/:id", upload.single("foto"), (req,res) => { // upload foto hannya 1

    let data = null, sql = null

    /* Menangkap id dari parameter */
    let param = {
        id_guru: req.params.id
    }

    /* Jika tidak ad afile yang di upload */
    if (!req.file) {
        /* Tampilkan data tanpa foto */
        data = {
            nip: req.body.nip,
            nama_guru: req.body.nama_guru,
            tgl_lahir: req.body.tgl_lahir,
            alamat: req.body.alamat 
        }
    } else {
        /* Tampilkan data jika menambahkan foto / reupload */
        data = {
            nip: req.body.nip,
            nama_guru: req.body.nama_guru,
            tgl_lahir: req.body.tgl_lahir,
            alamat: req.body.alamat,
            foto: req.file.filename
        }

        /* Dapatkan data yang upldate untuk dpat file lama */
        sql = "select * from guru where ?"

        /* Jalankan query */
        db.query(sql, param, (err, result) => {
            /* Jika error tendang error */
            if (err) throw err
            /* Tampung nama foto dalam berbentuk array */
            let fileName = result[0].foto

            /* Menghapus foto lama */
            let dir = path.join(__dirname,"image/foto_guru",fileName) // tangkap penyimpanan
            fs.unlink(dir, (error) => {})   // hapus data
        })

    }

    /* Sql unutk update data */
    sql = "update guru set ? where ?"

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
                message: result.affectedRows + " data guru berhasil di updated" // tampilkan pesan
            })
        }
    })
})

/* Enpoint Delete */
app.delete("/:id", (req,res) => {

    /* Menangkap file yang dikirim req */
    let param = {
        id_guru: req.params.id
    }

    /* Membuat query sql */
    let sql = "select * from guru where ?"
    
    /* Jalankan quernya */
    db.query(sql, param, (error, result) => {
        /* Jika error tendang error */
        if (error) throw error
        
        /* Menangkap nama file */
        let fileName = result[0].foto

        /* Menghapus file lama */
        let dir = path.join(__dirname,"image/foto_guru",fileName) // Direct file
        fs.unlink(dir, (error) => {})   // Penghapusan
    })

    /* Membuat sql data */
    sql = "delete from guru where ?"

    /* Jalankan query */
    db.query(sql, param, (error, result) => {
        /* Jika error  */
        if (error) {
            res.json({
                message: error.message // tampilkan error
            })
        } else {
            res.json({
                message: result.affectedRows + " data guru berhasil direbut"
            })
        }      
    })
})

module.exports = app // Melakukan exports supaya dapat diakses di file server.js
