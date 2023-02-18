/* File untuk mengkoneksikan ke database */
const mysql = require("mysql")      // import library mysql

/* Inisialisasi Database */
const db = mysql.createConnection({ // const fb untuk mengkoneksikan ke database
    host: "localhost", 
    user: "root",
    password: "",   
    database: "pelanggaran_siswa_buwhyna" // nama database
})

/* Check koneksi ke database */
db.connect(error => {
    if (error) {                        // Jika connection error
        console.log(error.message)      // Tampilkan error
    } else {                            // Jika Connection berhasil
        console.log("Project relah terhubung ke MySQL")  // Tampilkan MySQL Connected
    }
})

/* Export configuration database */
module.exports = db // Export file supaya dapat digunakan di file lain
