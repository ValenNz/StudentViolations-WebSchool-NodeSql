const express = require("express")          // Import express from library 
const bodyParser = require("body-parser")   // Import bodyPharse (mengambil data dari form)
const cors = require("cors")                // Menghubungkan broweser ke web-service
const db = require("../config")             // Import konfigurasi database   

const app = express()                               // Membuat app (menjalankan express)
app.use(cors())                                     // Menggunkan express
app.use(bodyParser.json())                          // Menerima form (data) dalam bentuk JSON
app.use(bodyParser.urlencoded({extended: true}))    // Convert car / string ke format url yang valid


/* Endpoint Create */
app.post("/", (req,res) => {

    /* Menangkap data yaang dikirm request */
    let data = {
        nama_jurusan: req.body.nama_jurusan,
        kepanjangan: req.body.kepanjangan,
        keterangan: req.body.keterangan,
    }

    /* Membuta sql create */
    let sql = "insert into jurusan set ?"

    /* Jalankan quesry */
    db.query(sql, data,(error, result) => {
        let response = null // Menseting response default
        /* Jika error */
        if (error) {
            response = {
                message: error.message // kirim error
                }
            } else {
                /* Jika berhasil */
            response = {
                message: result.affectedRows + "Data jurusan berhasil masuk"
            }
        }
        /* Kirim data berbentuk request  */
        res.json(response)
    })
})

/* Endpoint Read */
app.get("/", (req, res) => {

    /* Membuat sql untuk menampilkan */
    let sql = "select * from jurusan"

    /* Jalankan Query */
    db.query(sql, (error, result) => {  
        let response = null     // Setting default response default
        /* Jika error */
        if (error) {
            response = {
                message: error.message // tampilkan pesan error
            }            
        } else {
            /* Jika berhasil */
            response = {
                count: result.length, // jumlah data
                jurusan: result // isi data
            }            
        }
        /* Kirim response berbentuk json */
        res.json(response) 
    })
})

/* Endpopint Read Detail */
app.get("/:id", (req,res) => {

    /* Menangkap request dari params yang dikrim */
    let data = {
        id_jurusan: req.params.id 
    }

    /* Membuat sql untuk menampilkan detail */
    let sql = "select * from jurusan where ?" 

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
                jurusan: result // isi data
            }            
        }
        res.json(response) // send response
    })
})

/* Router UPDATE */
app.put("/:id", (req,res) => {

    /* Menangkap Data */
    let data = [
        /* Menangkap data yang dikirim oleh body (postman) */
        {
            nama_jurusan: req.body.nama_jurusan,
            kepanjangan: req.body.kepanjangan,
            keterangan: req.body.keterangan,
        },
        {
            id_jurusan: req.params.id // Menangkap parameter dari primary key
        }
    ]
    let sql = "update jurusan set ? where ?" // Melakukan update ke sql

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

/* Router DELETE */
app.delete(":id", (req,res) => {
    /* Menangkap data yang dikirim */
    let data = {
        id_jurusan: req.params.id
    }
    let sql = "delete from jurusan where ?" // Menghapus data dari sql

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
