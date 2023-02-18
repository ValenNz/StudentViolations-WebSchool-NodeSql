/* Menggunakan MODUl (NPM) */
const express = require("express")          // Exports file express
const app = express()                       // Mendapatkan express (route)
const bodyParser = require("body-parser")   // Mendapatkan bodyPharse (mengelola form)
const cors = require("cors")                // Menghubungkan broweser ke web-service
const db = require("../config")             // Menghubungkan ke database
const moment = require("moment")            // Inisialisas library moment untuk menyimpan format date-time

app.use(cors())                                     // Use cors (penghubun) 
app.use(bodyParser.json())                          // Mendapakan req berbentuk JSON
app.use(bodyParser.urlencoded({extended: true}))    // GK TAU

/* Router (endpoint) CREATE */
app.post("/", (req,res) => {
    /* Menangkap data yang dikirim dari body */
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss') // untuk mendapatkan current time
    }

    /* mengkonfersi dalam bentuk JSON (diurai) */
    let pelanggaran = JSON.parse(req.body.pelanggaran) // mengirimkan data dalam bentuk json dan ubah type data sting ke json
 
    let sql = "insert into pelanggaran_siswa set ?" // Mengirimkan data (menambahkan) ke mysql

    /* Jalankan Query */
    db.query(sql, data, (err, result) => {
        let response = null     // Melakukan pengiriman response null
        if (err) {            // Jika erro tampilkan pesan err
            res.json({message: err.message})
        } else {
            let lastID = result.insertId                                // Mendapatkan inputan terakhir yang dikirim user
            let data = []                                               // Membuat array untuk menyimpan data
            /* Perulanhan untuk data pelanggaran */
            for (let index = 0; index < pelanggaran.length; index++) {
                data.push([                                             // Melakukan push data ke database berdasarkan id terakhir dan id pelanggaran
                    lastID, pelanggaran[index].id_pelanggaran
                ])                
            }
            /* Make query untuk insert detail pelanggaran */
            let sql = "insert into detail_pelanggaran_siswa values ?"
            db.query(sql, [data], (err, result) => {      // Nilai params
                if (err) {                                // Jika err tampilkan err
                    res.json({message: err.message})      
                } else {                                    // Jika tidak err tampilkan Data telah ditambahkan
                    res.json({message: "Data telah ditambahkan"})
                }
            })
        }
    })
})

/* Route (endpoint) READ */
app.get("/", (req,res) => {
    /* Menghubungkan tabel siswa dengan pelanggran berdasarkan id siswa */
    let sql = "select p.id_pelanggaran_siswa, p.id_siswa, p.waktu, s.nis, s.nama_siswa, p.id_user, u.username " + "from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa " +
     "join user u on p.id_user = u.id_user"

     /* 
        serlect  digunakan untuk mengambol nama kolom data yang ingin ditampilkan di web (mendeklarasikan), 
        from tabel 1 sumber awal data dari tabel 1 dengan alias laau melakukan join ke tabel 2 dengan alias, 
        berdasrkan nama kolom yang sama (on) , lalau manggil nama kolom yang sama angara tabel 1 dan 2,
        melakukan join ke tabel lain yaitu tabel 3 berdasarkn anama kolom yang sama dari tabel 1 atau 2
             
     */


    /* Menjalankan Query */
    db.query(sql, (err, result) => {
        if (err) {                                // Jika err tampilkan pesan 
            res.json({ message: err.message})   
        }else{                                      // Jika berhasil tampilkan jumlah pelanggaran dan hasil
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

/* Router (endpoint) READ by ID */
app.get("/:id_pelanggaran_siswa", (req,res) => {
    /* Menangkap params yang dikirim user */
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    /* Make sql to menampilkan detail pelanggaran byb id */
    let sql = "select * from detail_pelanggaran_siswa dps join pelanggaran p "+
    "on p.id_pelanggaran = dps.id_pelanggaran where ?"

    /*
        select semua data kolom yang terdapat pada tabel 1 dengan alias  join ke tabel 2 berdasarkan nama kolom yang sama dimana daat ayang diambil sesuai dengan data yang diinginkan
    */

    /* Menjalankan query */
    db.query(sql, param, (err, result) => {
        if (err) {                            // jika err tampilkan pesan
            res.json({ message: err.message})   
        }else{                                  // jika err tampilkan peaan 
            res.json({
                count: result.length,
                detail_pelanggaran_siswa: result
            })
        }
    })
})

/* Router (endpoint) DELETE */
app.delete("/:id_pelanggaran_siswa", (req, res) => {
    /* Menangkap params (dari body) */
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    /* Membuat sql untuk menghapus pelangaran berdasarkan id */
    let sql = "delete from detail_pelanggaran_siswa where ?"

    /* Jalankan Query */
    db.query(sql, param, (err, result) => {
        if (err) {                                // Jika err tampilkan pesan berbentuk JSON
            res.json({ message: err.message})
        } else {
            /* Dapatkan param yang dikiirim user (url) */
            let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}
            /* Create Sql untuk DELETE */
            let sql = "delete from pelanggaran_siswa where ?"

            /* Jalankan Query */
            db.query(sql, param, (err, result) => {
                if (err) {                                        // Jika err tampilkan pesan
                    res.json({ message: err.message})
                } else {                                            // Jika berhasil tampilkan data telah dihapus
                    res.json({message: "Data telah dihapus"})
                }
            })
        }
    })
})

module.exports = app // Melakukan exports supaya dapat diakses di file server.js