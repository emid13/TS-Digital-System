/*====================================================
 ATSC PRO v3.1 FINAL
 PW.JS
 BAGIAN 1
 Inisialisasi
====================================================*/

let DB = loadDB();

const PW_ID = localStorage.getItem("PW_ID") || "pw1";

//========================================
// SHORTCUT
//========================================

function $(id){
    return document.getElementById(id);
}

//========================================
// TAMPILKAN NOMOR PEMBANTU WASIT
//========================================

function tampilJudulPW(){

    const nomor = PW_ID.replace("pw","");

    if($("pwTitle")){

        $("pwTitle").innerHTML =
        "PEMBANTU WASIT " + nomor;

    }

}
//========================================
// SIMPAN DATABASE
//========================================

function simpanPW(){

    updateDB();

}

//========================================
// AMBIL NAMA RONDE
//========================================

function getNamaRondeAktif(){

    DB = loadDB();

    switch(DB.pertandingan.ronde){

        case 1:
            return "ronde1";

        case 2:
            return "ronde2";

        default:
            return "rondeTambahan";

    }

}

//========================================
// STATUS ONLINE
//========================================

function onlinePW(){

    DB = loadDB();

    if(!DB.pw[PW_ID]){

        DB.pw[PW_ID]={
            online:false,
            lastUpdate:0,
            history:{
                ronde1:[],
                ronde2:[],
                rondeTambahan:[]
            }
        };

    }

    DB.pw[PW_ID].online=true;
    DB.pw[PW_ID].lastUpdate=Date.now();

    simpanPW();

}

//========================================
// TAMPILKAN PARTAI AKTIF
//========================================

function tampilPartai(){

    DB = loadDB();

    if(DB.partaiAktif===null){

        return;

    }

    let partai = DB.partai[DB.partaiAktif];

    if(!partai){

        return;

    }

    if($("nomorPartai"))
        $("nomorPartai").innerHTML = partai.nomor;

    if($("kelasPartai"))
        $("kelasPartai").innerHTML = partai.kelas;

    if($("namaKuning"))
        $("namaKuning").innerHTML = partai.kuning.nama;

    if($("namaBiru"))
        $("namaBiru").innerHTML = partai.biru.nama;

    if($("kontingenKuning"))
        $("kontingenKuning").innerHTML =
        partai.kuning.kontingen;

    if($("kontingenBiru"))
        $("kontingenBiru").innerHTML =
        partai.biru.kontingen;

    if($("gelanggang"))
        $("gelanggang").innerHTML =
        partai.gelanggang;

}

//========================================
// TAMPILKAN RONDE
//========================================

function tampilRonde(){

    DB = loadDB();

    if($("ronde")){

        $("ronde").innerHTML =
        DB.pertandingan.ronde;

    }

}

//========================================
// TAMPILKAN TIMER
//========================================

function formatTimer(detik){

    let menit=Math.floor(detik/60);

    let sisa=detik%60;

    if(menit<10) menit="0"+menit;

    if(sisa<10) sisa="0"+sisa;

    return menit+":"+sisa;

}

function tampilTimer(){

    DB = loadDB();

    if($("timer")){

        $("timer").innerHTML = formatTimer(DB.pertandingan.timer);

    }

}

//========================================
// TAMPILKAN STATUS
//========================================

function tampilStatus(){

    DB = loadDB();

    if($("statusPertandingan")){

        $("statusPertandingan").innerHTML =
        DB.pertandingan.status;

    }

    updateButtonState();

}

//========================================
// LOAD HALAMAN
//========================================

window.onload = function(){

    DB = loadDB();

    tampilJudulPW();

    onlinePW();

    tampilPartai();

    tampilRonde();

    tampilTimer();

    tampilStatus();

    tampilScore();

    tampilHistory();

}

//========================================
// AUTO REFRESH FINAL
//========================================

setInterval(function(){

    DB = loadDB();

    tampilPartai();

    tampilRonde();

    tampilTimer();

    tampilStatus();

    tampilScore();

    tampilHistory();

    updateButtonState();

    cekStatusPertandingan();

},500);

/*====================================================
 ATSC PRO v3.1 FINAL
 PW.JS
 BAGIAN 2
 INPUT NILAI
====================================================*/

//========================================
// BOLEH INPUT ?
//========================================

function bolehInput(){

    DB = loadDB();

    if(DB.partaiAktif===null){

        alert("Belum ada partai aktif.");

        return false;

    }

    if(DB.pertandingan.status!=="JALAN"){

        alert("Pertandingan belum dimulai.");

        return false;

    }

    return true;

}

//========================================
// INPUT NILAI
//========================================

function inputNilai(sudut,jenis,nilai){

    if(!bolehInput()){

        return;

    }

    DB = loadDB();

    const ronde = getNamaRondeAktif();

    DB.pertandingan.score[ronde][PW_ID][sudut]+=nilai;

    if(!DB.pw[PW_ID].history[ronde]){

        DB.pw[PW_ID].history[ronde]=[];

    }

    DB.pw[PW_ID].history[ronde].push({

        waktu:new Date().toLocaleTimeString("id-ID"),

        jenis:jenis,

        sudut:sudut,

        nilai:nilai,

        tipe:"nilai"

    });

    DB.pw[PW_ID].lastUpdate=Date.now();

    simpanPW();

    tampilScore();

    tampilHistory();

}

//========================================
// TAMPILKAN SCORE
//========================================

function tampilScore(){

    DB = loadDB();

    const ronde = getNamaRondeAktif();

    if($("scoreKuning")){

        $("scoreKuning").innerHTML=

        DB.pertandingan.score[ronde][PW_ID].kuning;

    }

    if($("scoreBiru")){

        $("scoreBiru").innerHTML=

        DB.pertandingan.score[ronde][PW_ID].biru;

    }

}

//========================================
// HISTORY INPUT
//========================================

function tampilHistory(){

    DB = loadDB();

    const ronde = getNamaRondeAktif();

    if(!$("historyList")){

        return;

    }

    let history=

    DB.pw[PW_ID].history[ronde] || [];

    $("historyList").innerHTML="";

    if(history.length===0){

        $("historyList").innerHTML=

        "<div class='history-empty'>Belum ada penilaian.</div>";

        return;

    }

    history.forEach(function(item,index){

        $("historyList").innerHTML+=`

        <div class="history-item">

            <div>

                ${item.waktu}

                |

                ${item.sudut.toUpperCase()}

                |

                ${item.jenis}

                |

                ${item.nilai>0?"+":""}${item.nilai}

            </div>

            <button onclick="hapusHistory(${index})">

                ❌

            </button>

        </div>

        `;

    });

}

/*====================================================
 ATSC PRO v3.1 FINAL
 PW.JS
 BAGIAN 3
 INPUT HUKUMAN
====================================================*/

//========================================
// INPUT HUKUMAN
//========================================

function inputHukuman(sudut,jenis,nilai){

    if(!bolehInput()){
        return;
    }

    DB = loadDB();

    const ronde = getNamaRondeAktif();

    // Simpan hukuman
    DB.pertandingan.hukuman[ronde][PW_ID][sudut]+=nilai;

    // Kurangi nilai
    DB.pertandingan.score[ronde][PW_ID][sudut]-=nilai;

    if(!DB.pw[PW_ID].history[ronde]){

        DB.pw[PW_ID].history[ronde]=[];

    }

    DB.pw[PW_ID].history[ronde].push({

        waktu:new Date().toLocaleTimeString("id-ID"),

        jenis:jenis,

        sudut:sudut,

        nilai:nilai,

        tipe:"hukuman"

    });

    DB.pw[PW_ID].lastUpdate=Date.now();

    simpanPW();

    tampilScore();

    tampilHistory();

}

//========================================
// BATALKAN HISTORY
//========================================

function hapusHistory(index){

    DB=loadDB();

    const ronde=getNamaRondeAktif();

    let item=DB.pw[PW_ID].history[ronde][index];

    if(!item){
        return;
    }

    if(!confirm("Batalkan input ini?")){
        return;
    }

    if(item.tipe==="nilai"){

        DB.pertandingan.score[ronde][PW_ID][item.sudut]-=

        item.nilai;

    }

    if(item.tipe==="hukuman"){

        DB.pertandingan.hukuman[ronde][PW_ID][item.sudut]-=

        item.nilai;

        DB.pertandingan.score[ronde][PW_ID][item.sudut]+=

        item.nilai;

    }

    if(DB.pertandingan.hukuman[ronde][PW_ID][item.sudut]<0){

        DB.pertandingan.hukuman[ronde][PW_ID][item.sudut]=0;

    }

    DB.pw[PW_ID].history[ronde].splice(index,1);

    DB.pw[PW_ID].lastUpdate=Date.now();

    simpanPW();

    tampilScore();

    tampilHistory();

}

//========================================
// HAPUS INPUT TERAKHIR
//========================================

function hapusInputTerakhir(){

    DB=loadDB();

    const ronde=getNamaRondeAktif();

    let history=DB.pw[PW_ID].history[ronde];

    if(!history || history.length===0){

        return;

    }

    hapusHistory(history.length-1);

}

//========================================
// RESET NILAI RONDE PW
//========================================

function resetNilaiPW(){

    if(!confirm("Reset nilai ronde ini?")){

        return;

    }

    DB=loadDB();

    const ronde=getNamaRondeAktif();

    DB.pertandingan.score[ronde][PW_ID]={

        kuning:0,

        biru:0

    };

    DB.pertandingan.hukuman[ronde][PW_ID]={

        kuning:0,

        biru:0

    };

    DB.pw[PW_ID].history[ronde]=[];

    DB.pw[PW_ID].lastUpdate=Date.now();

    simpanPW();

    tampilScore();

    tampilHistory();

}

//========================================
// REKAP PW
//========================================

function getRekapPW(){

    DB=loadDB();

    return{

        score:DB.pertandingan.score,

        hukuman:DB.pertandingan.hukuman,

        history:DB.pw[PW_ID].history

    };

}

/*====================================================
 ATSC PRO v3.1 FINAL
 PW.JS
 BAGIAN 4
 SINKRONISASI REALTIME
====================================================*/

//========================================
// REFRESH TAMPILAN
//========================================

function refreshPW(){

    DB = loadDB();

    tampilPartai();

    tampilRonde();

    tampilTimer();

    tampilStatus();

    tampilScore();

    tampilHistory();

}

//========================================
// CEK PERGANTIAN PARTAI
//========================================

let lastPartai = -1;

function cekPartaiAktif(){

    DB = loadDB();

    if(lastPartai !== DB.partaiAktif){

        lastPartai = DB.partaiAktif;

        refreshPW();

    }

}

//========================================
// CEK PERGANTIAN RONDE
//========================================

let lastRonde = 0;

function cekRonde(){

    DB = loadDB();

    if(lastRonde !== DB.pertandingan.ronde){

        lastRonde = DB.pertandingan.ronde;

        tampilRonde();

        tampilScore();

        tampilHistory();

    }

}

//========================================
// UPDATE STATUS ONLINE
//========================================

function updateOnlinePW(){

    DB = loadDB();

    if(DB.pw && DB.pw[PW_ID]){

        DB.pw[PW_ID].online = true;

        DB.pw[PW_ID].lastUpdate = Date.now();

        simpanPW();

    }

}

//========================================
// STATUS KONEKSI
//========================================

function tampilStatusPW(){

    if(!$("statusPW")){

        return;

    }

    $("statusPW").innerHTML = "🟢 ONLINE";

    $("statusPW").style.color = "#00c853";

}

//========================================
// CEK TIMER
//========================================

function updateTimerRealtime(){

    DB = loadDB();

    if($("timer")){

        $("timer").innerHTML =

        formatTimer(DB.pertandingan.timer);

    }

}

//========================================
// CEK STATUS
//========================================

function updateStatusRealtime(){

    DB = loadDB();

    if($("statusPertandingan")){

        $("statusPertandingan").innerHTML =

        DB.pertandingan.status;

    }

}

//========================================
// UPDATE ONLINE
//========================================

setInterval(function(){

    updateOnlinePW();

    tampilStatusPW();

},2000);

/*====================================================
 ATSC PRO v3.1 FINAL
 PW.JS
 BAGIAN 5
 FINAL
====================================================*/

//========================================
// KUNCI / BUKA TOMBOL INPUT
//========================================

function updateButtonState(){

    DB = loadDB();

    let aktif =
        DB.partaiAktif !== null &&
        DB.pertandingan.status === "JALAN";

    document.querySelectorAll(".btn-input").forEach(function(btn){

        btn.disabled = !aktif;

    });

}

//========================================
// RESET DATA PW
//========================================

function resetPW(){

    DB = loadDB();

    const ronde = getNamaRondeAktif();

    DB.pertandingan.score[ronde][PW_ID]={

        kuning:0,

        biru:0

    };

    DB.pertandingan.hukuman[ronde][PW_ID]={

        kuning:0,

        biru:0

    };

    DB.pw[PW_ID].history[ronde]=[];

    DB.pw[PW_ID].lastUpdate=Date.now();

    simpanPW();

    tampilScore();

    tampilHistory();

}

//========================================
// PARTAI BERAKHIR
//========================================

function selesaiPertandinganPW(){

    DB = loadDB();

    DB.pw[PW_ID].online=false;

    DB.pw[PW_ID].lastUpdate=Date.now();

    simpanPW();

}

//========================================
// CEK STATUS PERTANDINGAN
//========================================

function cekStatusPertandingan(){

    DB = loadDB();

    if(DB.pertandingan.status==="SELESAI"){

        updateButtonState();

    }

}


//========================================
// OFFLINE SAAT TAB DITUTUP
//========================================

window.addEventListener("beforeunload",function(){

    DB = loadDB();

    if(DB.pw && DB.pw[PW_ID]){

        DB.pw[PW_ID].online=false;

        DB.pw[PW_ID].lastUpdate=Date.now();

        simpanPW();

    }

});

console.log("ATSC PRO v3.1 FINAL - PW MODULE LOADED");

//========================================
// BUNYIKAN ALARM
//========================================

function bunyiAlarm(){

    const alarm = document.getElementById("alarmSound");

    if(!alarm){

        return;

    }

    alarm.pause();

    alarm.currentTime = 0;

    alarm.play().catch(function(){});

}