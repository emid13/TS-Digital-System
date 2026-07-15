 /*====================================================
 ATSC PRO v3.1 FINAL
 DATABASE ENGINE
====================================================*/

//=====================================
// DATABASE
//=====================================

const DB_NAME = "ATSC_DB_V31";
const DB_VERSION = "3.1";

//=====================================
// DEFAULT DATABASE
//=====================================

const defaultDB = {

    version: DB_VERSION,

    //=================================
    // KEJUARAAN
    //=================================

    kejuaraan:{

        nama:"",
        tempat:"",
        tanggal:"",
        gelanggang:1

    },

    //=================================
    // MASTER PESILAT
    //=================================

    pesilat:[],

    //=================================
    // PARTAI
    //=================================

    partai:[],

    // index partai aktif
    partaiAktif:null,

    arsip:[],

    //=================================
    // PERTANDINGAN
    //=================================

    pertandingan:{

    ronde:1,

    maxRonde:2,

    rondeTambahan:false,

    status:"STOP",

    hasilSiap:false,

    arsipTersimpan:false,

    timer:120,

    timerBerjalan:false,

    //==============================
    // SCORE
    //==============================

    score:{

        ronde1:{
            pw1:{kuning:0,biru:0},
            pw2:{kuning:0,biru:0},
            pw3:{kuning:0,biru:0},
            pw4:{kuning:0,biru:0}
        },

        ronde2:{
            pw1:{kuning:0,biru:0},
            pw2:{kuning:0,biru:0},
            pw3:{kuning:0,biru:0},
            pw4:{kuning:0,biru:0}
        },

        rondeTambahan:{
            pw1:{kuning:0,biru:0},
            pw2:{kuning:0,biru:0},
            pw3:{kuning:0,biru:0},
            pw4:{kuning:0,biru:0}
        }

    },

    //==============================
    // HUKUMAN
    //==============================

    hukuman:{

        ronde1:{
            pw1:{kuning:0,biru:0},
            pw2:{kuning:0,biru:0},
            pw3:{kuning:0,biru:0},
            pw4:{kuning:0,biru:0}
        },

        ronde2:{
            pw1:{kuning:0,biru:0},
            pw2:{kuning:0,biru:0},
            pw3:{kuning:0,biru:0},
            pw4:{kuning:0,biru:0}
        },

        rondeTambahan:{
            pw1:{kuning:0,biru:0},
            pw2:{kuning:0,biru:0},
            pw3:{kuning:0,biru:0},
            pw4:{kuning:0,biru:0}
        }

    },

    //==============================
    // HASIL RONDE
    //==============================

    hasilRonde:{

        ronde1:{
            kuning:0,
            biru:0,
            hukumanKuning:0,
            hukumanBiru:0,
            pemenang:""
        },

        ronde2:{
            kuning:0,
            biru:0,
            hukumanKuning:0,
            hukumanBiru:0,
            pemenang:""
        },

        rondeTambahan:{
            kuning:0,
            biru:0,
            hukumanKuning:0,
            hukumanBiru:0,
            pemenang:""
        }

    },

    //==============================
    // TOTAL
    //==============================

    total:{

        kuning:0,

        biru:0

    },

    //==============================
    // PEMENANG
    //==============================

    pemenangRonde1:"",
    pemenangRonde2:"",
    pemenangTambahan:"",
    pemenangAkhir:"",

    //==============================
    // POPUP GLOBAL
    //==============================

    popup:{

    tampil:false,

    tipe:"",

    judul:"",

    subJudul:"",

    pemenang:"",

    metode:"",

    kuning:0,

    biru:0,

    hukumanKuning:0,

    hukumanBiru:0,

    ronde:1,

    alasan:"",

    waktu:0

}

},

    //=================================
    // PEMBANTU WASIT
    //=================================

    pw:{

        pw1:{

            online:false,

            lastUpdate:0,

            history:{

                ronde1:[],
                ronde2:[],
                rondeTambahan:[]

            }

        },

        pw2:{

            online:false,

            lastUpdate:0,

            history:{

                ronde1:[],
                ronde2:[],
                rondeTambahan:[]

            }

        },

        pw3:{

            online:false,

            lastUpdate:0,

            history:{

                ronde1:[],
                ronde2:[],
                rondeTambahan:[]

            }

        },

        pw4:{

            online:false,

            lastUpdate:0,

            history:{

                ronde1:[],
                ronde2:[],
                rondeTambahan:[]

            }

        }

    },

    //=================================
    // STATUS PERANGKAT
    //=================================

    kp:{
        online:false,
        lastUpdate:0
    },

    sekretaris:{
        online:false,
        lastUpdate:0
    },

    scoreboard:{
        online:false,
        lastUpdate:0
    }

};

//=====================================
// CLONE OBJECT
//=====================================

function cloneDefault(){

    return JSON.parse(
        JSON.stringify(defaultDB)
    );

}

//=====================================
// MIGRASI DATABASE
//=====================================

function migrateDatabase(db){

    if(!db){

        db = cloneDefault();

        return db;

    }

    //=============================
    // VERSION
    //=============================

    if(!db.version){

        db.version = "1.0";

    }

    //=============================
    // ROOT
    //=============================

    db.kejuaraan ??= cloneDefault().kejuaraan;

    db.pesilat ??= [];

    db.partai ??= [];

    db.partaiAktif ??= null;

    db.arsip ??= [];

    db.pertandingan ??= {};

    db.pw ??= {};

    db.kp ??= {};

    db.sekretaris ??= {};

    db.scoreboard ??= {};

    //=============================
    // KEJUARAAN
    //=============================

    db.kejuaraan.nama ??= "";

    db.kejuaraan.tempat ??= "";

    db.kejuaraan.tanggal ??= "";

    db.kejuaraan.gelanggang ??= 1;

    //=============================
    // PERTANDINGAN
    //=============================

    db.pertandingan.ronde ??= 1;

    db.pertandingan.maxRonde ??= 2;

    db.pertandingan.rondeTambahan ??= false;

    db.pertandingan.status ??= "STOP";

    db.pertandingan.timer ??= 120;

    db.pertandingan.timerBerjalan ??= false;

    //=============================
    // SCORE
    //=============================

    if(!db.pertandingan.score){

        db.pertandingan.score =
        cloneDefault().pertandingan.score;

    }

    //=============================
    // HUKUMAN
    //=============================

    if(!db.pertandingan.hukuman){

        db.pertandingan.hukuman =
        cloneDefault().pertandingan.hukuman;

    }

    //=============================
    // HASIL RONDE
    //=============================

    if(!db.pertandingan.hasilRonde){

        db.pertandingan.hasilRonde =
        cloneDefault().pertandingan.hasilRonde;

    }

  if(!db.pertandingan.popup){

    db.pertandingan.popup =
    cloneDefault().pertandingan.popup;

}

    //=============================
    // TOTAL
    //=============================

    if(!db.pertandingan.total){

        db.pertandingan.total = {

            kuning:0,

            biru:0

        };

    }

    db.pertandingan.total.kuning ??= 0;

    db.pertandingan.total.biru ??= 0;

    //=============================
    // PEMENANG
    //=============================

    db.pertandingan.pemenangRonde1 ??= "";

    db.pertandingan.pemenangRonde2 ??= "";

    db.pertandingan.pemenangTambahan ??= "";

    db.pertandingan.pemenangAkhir ??= "";

  db.pertandingan.metodeMenang ??= "";
  
    //=============================
    // PW
    //=============================

    ["pw1","pw2","pw3","pw4"].forEach(function(id){

        if(!db.pw[id]){

            db.pw[id]={};

        }

        db.pw[id].online ??= false;

        db.pw[id].lastUpdate ??= 0;

        if(!db.pw[id].history){

            db.pw[id].history={

                ronde1:[],

                ronde2:[],

                rondeTambahan:[]

            };

        }

    });

    //=============================
    // KP
    //=============================

    db.kp.online ??= false;

    db.kp.lastUpdate ??= 0;

    //=============================
    // SEKRETARIS
    //=============================

    db.sekretaris.online ??= false;

    db.sekretaris.lastUpdate ??= 0;

    //=============================
    // SCOREBOARD
    //=============================

    db.scoreboard.online ??= false;

    db.scoreboard.lastUpdate ??= 0;

    //=============================
    // VALIDASI PARTAI
    //=============================

    db.partai.forEach(function(partai){

        partai.status ??= "BELUM AKTIF";

        partai.ronde ??= 1;

        partai.rondeTambahan ??= false;

        partai.pemenang ??= "";

        partai.selesai ??= false;

        partai.kuning ??= {

            id:null,

            nama:"",

            kontingen:"",

            kelas:""

        };

        partai.biru ??= {

            id:null,

            nama:"",

            kontingen:"",

            kelas:""

        };

    });

    //=============================
    // UPDATE VERSION
    //=============================

    db.version = DB_VERSION;

    return db;

}

//=====================================
// LOAD DATABASE
//=====================================

function loadDB(){

    let db = localStorage.getItem(DB_NAME);

    if(db){

        try{

            db = JSON.parse(db);

            db = migrateDatabase(db);

            localStorage.setItem(
                DB_NAME,
                JSON.stringify(db)
            );

            return db;

        }catch(e){

            console.error("DATABASE RUSAK",e);

        }

    }

    const baru = cloneDefault();

    localStorage.setItem(
        DB_NAME,
        JSON.stringify(baru)
    );

    return cloneDefault();

}

//=====================================
// SIMPAN DATABASE
//=====================================

function saveDB(db){

    db.version = DB_VERSION;

    localStorage.setItem(

        DB_NAME,

        JSON.stringify(db)

    );

}

//=====================================
// UPDATE DATABASE GLOBAL
//=====================================

function updateDB(){

    saveDB(DB);

}

//=====================================
// RELOAD DATABASE
//=====================================

function reloadDB(){

    DB = loadDB();

    return DB;

}

//=====================================
// RESET DATABASE
//=====================================

function resetDB(){

    if(!confirm("Reset seluruh database?")){

        return;

    }

    localStorage.removeItem(DB_NAME);

    DB = cloneDefault();

    saveDB(DB);

    location.reload();

}

//=====================================
// EXPORT DATABASE
//=====================================

function exportDB(){

    return JSON.stringify(

        DB,

        null,

        2

    );

}

//=====================================
// IMPORT DATABASE
//=====================================

function importDB(json){

    try{

        let db = JSON.parse(json);

        db = migrateDatabase(db);

        DB = db;

        updateDB();

        return true;

    }catch(err){

        console.error(err);

        return false;

    }

}

//=====================================
// DATABASE GLOBAL
//=====================================

DB = loadDB();

//=====================================
// AUTO SAVE
//=====================================

window.addEventListener(

    "beforeunload",

    function(){

        updateDB();

    }

);

//=====================================
// DEBUG
//=====================================

function cekDB(){

    console.clear();

    console.log("========== ATSC PRO ==========");

    console.log("VERSION :",DB.version);

    console.log(DB);

}

console.log("ATSC PRO DATABASE v3.1 LOADED");
  