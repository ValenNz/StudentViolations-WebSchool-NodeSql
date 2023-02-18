//inisialisasi library
const express = require("express")          // Import file express
const app = express()                       // Membuat app (menjalankan express)
const Cryptr = require("cryptr")            
const crypt = new Cryptr("140533602676") 
const db = require("./config")

//import route user
const user = require("./controller/user")
app.use("/", user)

validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token  = req.get("Token")
            
            // decrypt token menjadi id_user
            let decryptToken = crypt.decrypt(token)

            // sql cek id_user
            let sql = "select * from user where ?"

            // set parameter
            let param = { id_user: decryptToken}

            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                 // cek keberadaan id_user
                if (result.length > 0) {
                    // id_user tersedia
                    next()
                } else {
                    // jika user tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }

    }
}

//import route siswa
const siswa = require("./controller/siswa")
app.use("/siswa", validateToken(), siswa)

//import route jurusan
const jurusan = require("./controller/jurusan")
app.use("/jurusan", validateToken(), jurusan)

/* Import controller Guru */
const guru = require("./controller/guru")
app.use("/guru", validateToken(), guru)

const pelanggaran = require("./controller/pelanggaran")
app.use("/pelanggaran", validateToken(), pelanggaran)

const pelanggaran_siswa = require("./controller/pelanggaran_siswa")
app.use("/pelanggaran_siswa", pelanggaran_siswa)


//membuat web server dengan port 8000
app.listen(8000, () => {
    console.log("server run on port 8000")
})
