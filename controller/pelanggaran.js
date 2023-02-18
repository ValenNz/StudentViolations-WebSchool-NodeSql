const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")             // Import konfigurasi database   
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

/* Endpoint Create */
app.post("/", (req, res) => {

    /* Menangkap data req */
    let data = {
        nama_pelanggaran : req.body.nama_pelanggaran,
        poin : req.body.poin
    }

    /* Membuat sql create */
    let sql = "insert into pelanggaran set ?"

    /* Jalankan Query */
    db.query(sql, data,(error, result) => {
        let response = null // Seting response default
        /* Jika error */
        if (error) {
            response = {
                message: error.message // tampilkan pesan error
                }
            } else {
                /* Jika berhasil  */
            response = {
                message: result.affectedRows + "Data pelanggran berhasil masuk"
            }
        }
        res.json(response)
    })
})

/* Endpoint Read */
app.get("/", (req, res) => {

    /* Membuat sql menampilkan data */
    let sql = "select * from pelanggaran"

    /* Jalankan query data */
    db.query(sql, (error, result) => {  
        let response = null     // Mengirimkan response null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                pelanggaran: result // isi data
            }            
        }
        res.json(response) // send response
    })
})

/* Endpoint Read Detail */
app.get("/:id", (req,res) => {
    let data = {
        id_pelanggaran: req.params.id // Menangkap req dari body yang dikirim
    }
    let sql = "select * from pelanggaran where ?" // Menampilkan semua pelanggaran berdasarkan id

    /* Menjalankan query */
    db.query(sql, data, (error, result) => {
        let response = null     // Mengirimkan response null
        if (error) {                   // Jika error
            response = {    
                message: error.message // pesan error
            }            
        } else {                      // Jika tidak error tampilkan
            response = {
                count: result.length, // jumlah data
                pelanggaran: result // isi data
            }            
        }
        res.json(response) // send response
    })
})

/* Endpoint Update */
app.put("/:id", (req,res) => {

    /* Menangkap Data */
    let data = [
        /* Menangkap data yang dikirim oleh body (postman) */
        {
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: req.body.poin,
        },
        {
            id_pelanggaran: req.params.id // Menangkap parameter dari primary key
        }
    ]
    let sql = "update pelanggaran set ? where ?" // Melakukan update ke sql

    /* Menjalankan query */
    db.query(sql, data, (error, result) => {
        let response = null         // Menanpilkan response null (set null)
        if (error) {                // Jika error tampilkan pesan
            response = {
                message: error.message
            }
        } else {                    // Jika tidak error tampilkan data + "Data update"
            response = {
                message: result.affectedRows + "data updated"
            }
        }
        res.json(response) // send response
    })
})

/* Endpoint Delete */
app.delete("/:id", (req,res) => {
    /* Menangkap data yang dikirim */
    let data = {
        id_pelanggaran: req.params.id
    }
    let sql = "delete from pelanggaran where ?" // Menghapus data dari sql

    /* Menjalankan Query */
    db.query(sql, data, (error, result) => {
        let response = null         // Mengirim response null
        if (error) {                // jika error tampilkan pesan error
            response = {
                message: error.message
            }
        } else {                    // Jika tidak error tampilkan data + "data Deleted"
            response = {
                message: result.affectedRows + "Data Berhasil Dihapus"
            }
        }
        res.json(response) // send response
    })
})

module.exports = app // Expotr supaya dapat diacc di server.js