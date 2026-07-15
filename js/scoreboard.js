 /*====================================================
 ATSC PRO v3.1 FINAL
 SCOREBOARD.JS
 BAGIAN 1
 INISIALISASI
====================================================*/

//========================================
// DATABASE
//========================================

DB = loadDB();

//========================================
// STATUS TERAKHIR
//========================================

let statusTerakhir = "";

//========================================
// SHORTCUT
//========================================

function $(id){

    return document.getElementById(id);

}

//========================================
// SIMPAN
//========================================

function simpanScoreboard(){

    updateDB();

}

//========================================
// ONLINE
//========================================

function onlineScoreboard(){

    DB = loadDB();

    DB.scoreboard.online = true;

    DB.scoreboard.lastUpdate = Date.now();

    simpanScoreboard();

}

//========================================
// FORMAT TIMER
//========================================

function formatTimer(detik){

    let menit = Math.floor(detik/60);

    let sisa = detik%60;

    if(menit<10) menit="0"+menit;

    if(sisa<10) sisa="0"+sisa;

    return menit+":"+sisa;

}

//========================================
// NAMA RONDE
//========================================

function getNamaRonde(){

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
// TAMPILKAN HEADER
//========================================

function tampilHeader(){

    DB = loadDB();

    if($("namaKejuaraan")){

        $("namaKejuaraan").innerHTML =
        DB.kejuaraan.nama || "-";

    }

    if($("tempatKejuaraan")){

        $("tempatKejuaraan").innerHTML =
        DB.kejuaraan.tempat || "-";

    }

}

//========================================
// TAMPILKAN PARTAI
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

    if($("nomorPartai")){

        $("nomorPartai").innerHTML =
        partai.nomor;

    }

    if($("gelanggang")){

        $("gelanggang").innerHTML =
        "GELANGGANG " +
        partai.gelanggang;

    }

    if($("namaKuning")){

        $("namaKuning").innerHTML =
        partai.kuning.nama;

    }

    if($("namaBiru")){

        $("namaBiru").innerHTML =
        partai.biru.nama;

    }

    if($("kontingenKuning")){

        $("kontingenKuning").innerHTML =
        partai.kuning.kontingen;

    }

    if($("kontingenBiru")){

        $("kontingenBiru").innerHTML =
        partai.biru.kontingen;

    }

}

//========================================
// TAMPIL TIMER
//========================================

function tampilTimer(){

    DB = loadDB();

    if($("timer")){

        $("timer").innerHTML =

        formatTimer(

            DB.pertandingan.timer

        );

    }

}

//========================================
// TAMPIL STATUS
//========================================

function tampilStatus(){

    DB = loadDB();

    if($("statusPertandingan")){

        $("statusPertandingan").innerHTML =

        DB.pertandingan.status;

    }

}

//========================================
// TAMPIL RONDE
//========================================

function tampilRonde(){

    DB = loadDB();

    if(!$("ronde")){

        return;

    }

    if(DB.pertandingan.ronde==1){

        $("ronde").innerHTML="RONDE I";

    }

    else if(DB.pertandingan.ronde==2){

        $("ronde").innerHTML="RONDE II";

    }

    else{

        $("ronde").innerHTML="RONDE TAMBAHAN";

    }

}

//========================================
// LOAD HALAMAN
//========================================

window.onload=function(){

    onlineScoreboard();

    tampilHeader();

    tampilPartai();

    tampilTimer();

    tampilStatus();

    tampilRonde();

}

//========================================
// STATUS OFFLINE
//========================================

window.addEventListener(

    "beforeunload",

    function(){

        DB = loadDB();

        DB.scoreboard.online = false;

        DB.scoreboard.lastUpdate = Date.now();

        simpanScoreboard();

    }

);

console.log(

"ATSC PRO SCOREBOARD v3.1 BAGIAN 1 LOADED"

);

/*====================================================
 ATSC PRO v3.1 FINAL
 SCOREBOARD.JS
 BAGIAN 2
 SCORE & PANEL
====================================================*/

//========================================
// TAMPIL NILAI PW
//========================================

function tampilNilaiPW(){

    DB = loadDB();

    const ronde = getNamaRonde();

    ["pw1","pw2","pw3","pw4"].forEach(function(pw,index){

        const no=index+1;

        if($("pw"+no+"Kuning")){

            $("pw"+no+"Kuning").innerHTML=
            DB.pertandingan.score[ronde][pw].kuning;

        }

        if($("pw"+no+"Biru")){

            $("pw"+no+"Biru").innerHTML=
            DB.pertandingan.score[ronde][pw].biru;

        }

    });

}

//========================================
// TAMPIL SKOR
//========================================

function tampilScore(){

    DB = loadDB();

    const kuning = DB.pertandingan.total.kuning;

    const biru = DB.pertandingan.total.biru;

    if($("scoreKuning")){

        $("scoreKuning").innerHTML=kuning;

    }

    if($("scoreBiru")){

        $("scoreBiru").innerHTML=biru;

    }

}

//========================================
// RESET WARNA PANEL
//========================================

function resetPanel(){

    if($("panelKuning")){

        $("panelKuning").className="corner kuning";

    }

    if($("panelBiru")){

        $("panelBiru").className="corner biru";

    }

}

//========================================
// PANEL PEMIMPIN
//========================================

function updateLeaderPanel(){

    DB = loadDB();

    const kuning=DB.pertandingan.total.kuning;

    const biru=DB.pertandingan.total.biru;

    resetPanel();

    if(kuning==biru){

        return;

    }

    if(kuning>biru){

        $("panelBiru").classList.add("losing");

    }

    else{

        $("panelKuning").classList.add("losing");

    }

}

//========================================
// CEK MENANG MUTLAK
//========================================

function updateMutlakPanel(){

    DB = loadDB();

    const kuning=DB.pertandingan.total.kuning;

    const biru=DB.pertandingan.total.biru;

    if(kuning>=210){

        $("panelKuning").classList.add("mutlak");

    }

    else{

        $("panelKuning").classList.remove("mutlak");

    }

    if(biru>=210){

        $("panelBiru").classList.add("mutlak");

    }

    else{

        $("panelBiru").classList.remove("mutlak");

    }

}

//========================================
// UPDATE SELURUH SCORE
//========================================

function updateScoreboard(){

    tampilNilaiPW();

    tampilScore();

    updateLeaderPanel();

    updateMutlakPanel();

}

console.log(
"ATSC PRO SCOREBOARD v3.1 BAGIAN 2 LOADED"
);

/*====================================================
 ATSC PRO v3.1 FINAL
 SCOREBOARD.JS
 BAGIAN 3
 REKAP • PEMENANG • OVERLAY
====================================================*/

//========================================
// REKAP NILAI DARI 4 PW
//========================================

function hitungTotalScore(){

    DB = loadDB();

    const ronde = getNamaRonde();

    let kuning = 0;
    let biru = 0;

    ["pw1","pw2","pw3","pw4"].forEach(function(pw){

        kuning +=
        DB.pertandingan.score[ronde][pw].kuning;

        biru +=
        DB.pertandingan.score[ronde][pw].biru;

    });

    // Ambil nilai resmi (bukan akumulasi 4 PW)
    kuning = Math.round(kuning/4);
    biru = Math.round(biru/4);

    DB.pertandingan.total.kuning = kuning;
    DB.pertandingan.total.biru = biru;

    updateDB();

    return{

        kuning:kuning,

        biru:biru

    };

}

//========================================
// OVERLAY PEMENANG
//========================================

let winnerShown=false;

function tampilWinner(){

    if(winnerShown){

        return;

    }

    const hasil=hitungTotalScore();

    let nama="SERI";

    if(hasil.kuning>hasil.biru){

        nama="SUDUT KUNING";

    }

    else if(hasil.biru>hasil.kuning){

        nama="SUDUT BIRU";

    }

    $("winnerNama").innerHTML=nama;

    $("winnerScoreKuning").innerHTML=

    hasil.kuning;

    $("winnerScoreBiru").innerHTML=

    hasil.biru;

    $("winnerOverlay").style.display="flex";

    winnerShown=true;

    setTimeout(function(){

        $("winnerOverlay").style.display="none";

    },7000);

}

//========================================
// RESET OVERLAY
//========================================

function resetWinner(){

    winnerShown=false;

    if($("winnerOverlay")){

        $("winnerOverlay").style.display="none";

    }

}

//========================================
// MENANG MUTLAK
//========================================

let mutlakShown=false;

function cekMutlak(){

    const hasil=hitungTotalScore();

    if(mutlakShown){

        return;

    }

    if(hasil.kuning>=210){

        mutlakShown=true;

        $("mutlakNama").innerHTML=

        "SUDUT KUNING";

        $("mutlakOverlay").style.display="flex";

        bunyiAlarm();

    }

    else if(hasil.biru>=210){

        mutlakShown=true;

        $("mutlakNama").innerHTML=

        "SUDUT BIRU";

        $("mutlakOverlay").style.display="flex";

        bunyiAlarm();

    }

}

//========================================
// ALARM
//========================================

let audioAlarm=null;

function bunyiAlarm(){

    try{

        if(audioAlarm==null){

            audioAlarm=new Audio(

            "assets/alarm.mp3"

            );

        }

        audioAlarm.currentTime=0;

        audioAlarm.play();

    }

    catch(e){

        console.log("Alarm tidak tersedia");

    }

}

//========================================
// STATUS PERTANDINGAN
//========================================

function updateWinner(){

    DB=loadDB();

    if(

        DB.pertandingan.status=="SELESAI"

    ){

        tampilWinner();

    }

    else{

        resetWinner();

    }

    cekMutlak();

}

console.log(

"ATSC PRO SCOREBOARD v3.1 BAGIAN 3 LOADED"

);

/*====================================================
 ATSC PRO v3.1 FINAL
 SCOREBOARD.JS
 BAGIAN 4
 AUTO REFRESH & SINKRONISASI
====================================================*/

//========================================
// REFRESH SELURUH SCOREBOARD
//========================================

function refreshScoreboard(){

    DB = loadDB();

    //========================================
    // CEK PERUBAHAN STATUS
    //========================================

    if(DB.pertandingan.status !== statusTerakhir){

        statusTerakhir = DB.pertandingan.status;

        if(
            statusTerakhir === "SELESAI" ||
            statusTerakhir === "MENANG MUTLAK" ||
            statusTerakhir === "RONDE SELESAI"
        ){

            bunyiAlarm();

        }

    }

    tampilHeader();

    tampilPartai();

    tampilRonde();

    tampilTimer();

    tampilStatus();

    hitungTotalScore();

    updateScoreboard();

    updateWinner();

    onlineScoreboard();

  cekPopup();

}

//========================================
// AUTO REFRESH REALTIME
//========================================

let intervalScoreboard = null;

function mulaiRefreshScoreboard(){

    if(intervalScoreboard!==null){

        clearInterval(intervalScoreboard);

    }

    intervalScoreboard = setInterval(function(){

        refreshScoreboard();

    },200);

}

//========================================
// HENTIKAN REFRESH
//========================================

function stopRefreshScoreboard(){

    if(intervalScoreboard){

        clearInterval(intervalScoreboard);

        intervalScoreboard = null;

    }

}

//========================================
// HALAMAN DIBUKA
//========================================

window.onload = function(){

    refreshScoreboard();

    mulaiRefreshScoreboard();

};

//========================================
// HALAMAN DITUTUP
//========================================

window.addEventListener("beforeunload",function(){

    stopRefreshScoreboard();

    DB = loadDB();

    DB.scoreboard.online = false;

    DB.scoreboard.lastUpdate = Date.now();

    updateDB();

});

console.log("ATSC PRO SCOREBOARD v3.1 FINAL LOADED");

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

function cekPopup(){

    DB = loadDB();

    if(!DB.pertandingan.popup.tampil){

        return;

    }

    document.getElementById("winnerOverlay").style.display="flex";

    document.getElementById("winnerNama").innerHTML=
    DB.pertandingan.popup.pemenang;

    document.getElementById("winnerScoreKuning").innerHTML=
    DB.pertandingan.popup.kuning;

    document.getElementById("winnerScoreBiru").innerHTML=
    DB.pertandingan.popup.biru;

}