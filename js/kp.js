/*====================================================
 ATSC PRO v3.1 FINAL
 KP.JS
 BAGIAN 1
 Inisialisasi & Sinkronisasi
====================================================*/

//========================================
// SOUND
//========================================

const sGong = new Audio("assets/sound/gong.mp3");
const sBell = new Audio("assets/sound/bell.mp3");
const sWinner = new Audio("assets/sound/winner.mp3");
const s210 = new Audio("assets/sound/alarm210.mp3");

//========================================
// LOAD DATABASE
//========================================

DB = loadDB();

//========================================
// SHORTCUT
//========================================

function $(id){
    return document.getElementById(id);
}

//========================================
// SIMPAN DATABASE
//========================================

function simpanKP(){

    updateDB();

}

//========================================
// AMBIL NAMA RONDE
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
// FORMAT TIMER
//========================================

function formatTimer(detik){

    let menit=Math.floor(detik/60);

    let sisa=detik%60;

    if(menit<10) menit="0"+menit;
    if(sisa<10) sisa="0"+sisa;

    return menit+":"+sisa;

}

//========================================
// UPDATE TIMER
//========================================

function updateTimer(){

    DB=loadDB();

    if($("timer")){

        $("timer").innerHTML=
        formatTimer(DB.pertandingan.timer);

    }

}

//========================================
// UPDATE STATUS
//========================================

function updateStatus(){

    DB=loadDB();

    if($("statusPertandingan")){

        $("statusPertandingan").innerHTML=
        DB.pertandingan.status;

    }

}

//========================================
// HITUNG TOTAL NILAI
//========================================

function hitungScoreSudut(sudut){

    DB = loadDB();

    const ronde = getNamaRonde();

    let nilai = [];

    ["pw1","pw2","pw3","pw4"].forEach(function(pw){

        nilai.push(
            DB.pertandingan.score[ronde][pw][sudut]
        );

    });

    // rata-rata sementara
    return Math.round(
        (nilai[0]+nilai[1]+nilai[2]+nilai[3])/4
    );

}

//========================================
// HITUNG TOTAL HUKUMAN
//========================================

function hitungHukumanSudut(sudut){

    DB = loadDB();

    const ronde = getNamaRonde();

    let nilai = [];

    ["pw1","pw2","pw3","pw4"].forEach(function(pw){

        nilai.push(
            DB.pertandingan.hukuman[ronde][pw][sudut]
        );

    });

    return Math.round(
        (nilai[0]+nilai[1]+nilai[2]+nilai[3])/4
    );

}

//========================================
// UPDATE SCORE
//========================================

function updateScoreKP(){

    DB = loadDB();

    const ronde = getNamaRonde();

    const scoreKuning = hitungScoreSudut("kuning");
    const scoreBiru   = hitungScoreSudut("biru");

    if($("scoreKuning")){
        $("scoreKuning").innerHTML = scoreKuning;
    }

    if($("scoreBiru")){
        $("scoreBiru").innerHTML = scoreBiru;
    }

    DB.pertandingan.hasilRonde[ronde].kuning = scoreKuning;
    DB.pertandingan.hasilRonde[ronde].biru   = scoreBiru;

    DB.pertandingan.hasilRonde[ronde].hukumanKuning =
        hitungHukumanSudut("kuning");

    DB.pertandingan.hasilRonde[ronde].hukumanBiru =
        hitungHukumanSudut("biru");

    updateDB();

}

//========================================
// TAMPILKAN PARTAI AKTIF
//========================================

function tampilPartai(){

    DB=loadDB();

    if(DB.partaiAktif===null){

        return;

    }

    const partai=DB.partai[DB.partaiAktif];

    if(!partai){

        return;

    }

    if($("nomorPartai"))
        $("nomorPartai").innerHTML=partai.nomor;

    if($("kelasPartai"))
        $("kelasPartai").innerHTML=partai.kelas;

    if($("namaKuning"))
        $("namaKuning").innerHTML=partai.kuning.nama;

    if($("namaBiru"))
        $("namaBiru").innerHTML=partai.biru.nama;

    if($("kontingenKuning"))
        $("kontingenKuning").innerHTML=
        partai.kuning.kontingen;

    if($("kontingenBiru"))
        $("kontingenBiru").innerHTML=
        partai.biru.kontingen;

    if($("gelanggang"))
        $("gelanggang").innerHTML=
        partai.gelanggang;

}

//========================================
// LOAD HALAMAN
//========================================

window.onload = function(){

    DB = loadDB();

    onlineKP();

    tampilPartai();

    updateTimer();

    updateStatus();

    updateScoreKP();

}

//========================================
// AUTO REFRESH
//========================================

setInterval(function(){

    DB=loadDB();

    tampilPartai();

    updateScoreKP();

    updateTimer();

    updateStatus();

    onlineKP();

    if($("ronde")){

        $("ronde").innerHTML=
        DB.pertandingan.ronde;

    }

},300);

//========================================

console.log("KP MODULE v3.1 FINAL LOADED");

/*====================================================
 ATSC PRO v3.1 FINAL
 KP.JS
 BAGIAN 2
 TIMER PERTANDINGAN
====================================================*/

//========================================
// INTERVAL TIMER
//========================================

let intervalTimer = null;

//========================================
// MULAI TIMER
//========================================

function mulaiTimer(){

    DB = loadDB();

    if(intervalTimer !== null){
        return;
    }

    DB.pertandingan.status = "JALAN";
    DB.pertandingan.timerBerjalan = true;
    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateStatus();

    intervalTimer = setInterval(function(){

        DB = loadDB();

        if(!DB.pertandingan.timerBerjalan){
            return;
        }

        if(DB.pertandingan.timer > 0){

            DB.pertandingan.timer--;

            DB.kp.lastUpdate = Date.now();

            updateDB();

            updateTimer();

        }else{

    stopTimer();

    // Pastikan timer benar-benar 0
    DB = loadDB();

    DB.pertandingan.timer = 0;

    updateDB();

    // Bunyi alarm
    bunyiAlarm();

    // Proses hasil ronde
    prosesAkhirRonde();

    return;

}

    },1000);

}

//========================================
// PAUSE TIMER
//========================================

function pauseTimer(){

    DB = loadDB();

    DB.pertandingan.status = "PAUSE";
    DB.pertandingan.timerBerjalan = false;
    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateStatus();

}

//========================================
// STOP TIMER
//========================================

//========================================
// STOP TIMER
//========================================

function stopTimer(){

    if(intervalTimer !== null){

        clearInterval(intervalTimer);

        intervalTimer = null;

    }

    DB = loadDB();

    DB.pertandingan.timerBerjalan = false;

    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateTimer();

}

//========================================
// RESET TIMER
//========================================

function resetTimer(){

    DB = loadDB();

    DB.pertandingan.timer = 120;
    DB.pertandingan.timerBerjalan = false;
    DB.pertandingan.status = "SIAP";
    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateTimer();

    updateStatus();

}

//========================================
// SET DURASI TIMER
//========================================

function setDurasiTimer(detik){

    DB = loadDB();

    DB.pertandingan.timer = detik;

    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateTimer();

}

//========================================
// TAMBAH WAKTU
//========================================

function tambahWaktu(detik){

    DB = loadDB();

    DB.pertandingan.timer += detik;

    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateTimer();

}

//========================================
// KURANGI WAKTU
//========================================

function kurangiWaktu(detik){

    DB = loadDB();

    DB.pertandingan.timer -= detik;

    if(DB.pertandingan.timer < 0){

        DB.pertandingan.timer = 0;

    }

    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateTimer();

}

//========================================
// CEK MENANG MUTLAK 210
//========================================

function cekMenangMutlak(){

    DB = loadDB();

    const kuning = DB.pertandingan.total.kuning;
    const biru   = DB.pertandingan.total.biru;

    if(kuning >= 210){

        stopTimer();

        DB.pertandingan.metodeMenang = "MENANG MUTLAK";

        updateDB();

        return "KUNING";

    }

    if(biru >= 210){

        stopTimer();

        DB.pertandingan.metodeMenang = "MENANG MUTLAK";

        updateDB();

        return "BIRU";

    }

    return "";
}

/*====================================================
 ATSC PRO v3.1 FINAL
 KP.JS
 BAGIAN 3
 MANAJEMEN RONDE
====================================================*/

//========================================
// NAMA RONDE
//========================================

function getNamaRondeAktif(){

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
// RESET NILAI RONDE AKTIF
//========================================

function resetNilaiRonde(){

    DB = loadDB();

    const ronde = getNamaRondeAktif();

    ["pw1","pw2","pw3","pw4"].forEach(function(pw){

        DB.pertandingan.score[ronde][pw]={
            kuning:0,
            biru:0
        };

        DB.pertandingan.hukuman[ronde][pw]={
            kuning:0,
            biru:0
        };

        if(DB.pw[pw]){

            DB.pw[pw].history[ronde]=[];

        }

    });

    updateDB();

    updateScoreKP();

}

//========================================
// PINDAH KE RONDE BERIKUTNYA
//========================================

function pindahRonde(){

    DB = loadDB();

    pauseTimer();

    // =====================================
    // Kalau pertandingan sudah ada pemenang
    // =====================================

    if(DB.pertandingan.pemenangAkhir !== ""){

        DB.pertandingan.popup = {

            tampil:true,

            judul:"PEMENANG PARTAI",

            pemenang:DB.pertandingan.pemenangAkhir,

            kuning:DB.pertandingan.total.kuning,

            biru:DB.pertandingan.total.biru,

            hukumanKuning:0,

            hukumanBiru:0,

            ronde:DB.pertandingan.ronde,

            alasan:""

        };

        DB.pertandingan.status = "SELESAI";

        updateDB();

        simpanArsipPertandingan();

        bunyiAlarm();

        return;

    }

    // =====================================
    // Dari ronde 1 ke ronde 2
    // =====================================

    if(DB.pertandingan.ronde==1){

        DB.pertandingan.ronde = 2;

    }

    // =====================================
    // Dari ronde 2
    // =====================================

    else if(DB.pertandingan.ronde==2){

        if(DB.pertandingan.rondeTambahan){

            DB.pertandingan.ronde = 3;

        }else{

            DB.pertandingan.status = "SELESAI";

            updateDB();

            return;

        }

    }

    // =====================================
    // Ronde tambahan selesai
    // =====================================

    else{

        DB.pertandingan.status = "SELESAI";

        updateDB();

        return;

    }

    // =====================================
    // Persiapan ronde berikutnya
    // =====================================

    DB.pertandingan.timer = 120;

    DB.pertandingan.timerBerjalan = false;

    DB.pertandingan.status = "SIAP";

    DB.kp.lastUpdate = Date.now();

    updateDB();

    updateTimer();

    updateStatus();

    updateScoreKP();

    if($("ronde")){

        $("ronde").innerHTML = DB.pertandingan.ronde;

    }

}

//========================================
// KEMBALI KE RONDE SEBELUMNYA
//========================================

function rondeSebelumnya(){

    DB = loadDB();

    if(DB.pertandingan.ronde>1){

        DB.pertandingan.ronde--;

        DB.pertandingan.timer=120;

        DB.pertandingan.status="SIAP";

        DB.pertandingan.timerBerjalan=false;

        updateDB();

        updateTimer();

        updateStatus();

        if($("ronde")){

            $("ronde").innerHTML=
            DB.pertandingan.ronde;

        }

    }

}

//========================================
// AKTIFKAN RONDE TAMBAHAN
//========================================

function aktifkanRondeTambahan(){

    DB = loadDB();

    DB.pertandingan.rondeTambahan=true;

    updateDB();

    alert("Ronde tambahan diaktifkan.");

}

//========================================
// NONAKTIFKAN RONDE TAMBAHAN
//========================================

function nonaktifkanRondeTambahan(){

    DB = loadDB();

    DB.pertandingan.rondeTambahan=false;

    updateDB();

}

//========================================
// RESET SELURUH PERTANDINGAN
//========================================

function resetPertandingan(){

    if(!confirm("Reset seluruh pertandingan?")){

        return;

    }

    DB = loadDB();

    DB.pertandingan.ronde=1;

    DB.pertandingan.timer=120;

    DB.pertandingan.status="SIAP";

    DB.pertandingan.timerBerjalan=false;

    DB.pertandingan.rondeTambahan=false;

    DB.pertandingan.total.kuning=0;

    DB.pertandingan.total.biru=0;

    DB.pertandingan.pemenangRonde1="";

    DB.pertandingan.pemenangRonde2="";

    DB.pertandingan.pemenangTambahan="";

    DB.pertandingan.pemenangAkhir="";

    ["ronde1","ronde2","rondeTambahan"].forEach(function(r){

        ["pw1","pw2","pw3","pw4"].forEach(function(pw){

            DB.pertandingan.score[r][pw]={
                kuning:0,
                biru:0
            };

            DB.pertandingan.hukuman[r][pw]={
                kuning:0,
                biru:0
            };

            DB.pw[pw].history[r]=[];

        });

    });

    updateDB();

    updateTimer();

    updateStatus();

    updateScoreKP();

    tampilPartai();

    if($("ronde")){

        $("ronde").innerHTML=1;

    }

    alert("Pertandingan berhasil direset.");

}

/*====================================================
 ATSC PRO v3.1 FINAL
 KP.JS
 BAGIAN 4
 REKAP NILAI & PEMENANG
====================================================*/

 //========================================
// REKAP TOTAL RONDE AKTIF
//========================================

function rekapRondeAktif(){

    DB = loadDB();

    const ronde = getNamaRondeAktif();

    const score = DB.pertandingan.score[ronde];

    const hukuman = DB.pertandingan.hukuman[ronde];

    const totalKuning = Math.round(
        (
            score.pw1.kuning +
            score.pw2.kuning +
            score.pw3.kuning +
            score.pw4.kuning
        ) / 4
    );

    const totalBiru = Math.round(
        (
            score.pw1.biru +
            score.pw2.biru +
            score.pw3.biru +
            score.pw4.biru
        ) / 4
    );

    const hukumanKuning = Math.round(
        (
            hukuman.pw1.kuning +
            hukuman.pw2.kuning +
            hukuman.pw3.kuning +
            hukuman.pw4.kuning
        ) / 4
    );

    const hukumanBiru = Math.round(
        (
            hukuman.pw1.biru +
            hukuman.pw2.biru +
            hukuman.pw3.biru +
            hukuman.pw4.biru
        ) / 4
    );

    // Simpan hasil ronde
    DB.pertandingan.hasilRonde[ronde] = {

        kuning: totalKuning,

        biru: totalBiru,

        hukumanKuning: hukumanKuning,

        hukumanBiru: hukumanBiru,

        pemenang: ""

    };

    // Simpan total pertandingan
    DB.pertandingan.total.kuning = totalKuning;

    DB.pertandingan.total.biru = totalBiru;

    updateDB();

    return {

        kuning: totalKuning,

        biru: totalBiru,

        hk: hukumanKuning,

        hb: hukumanBiru

    };

} 

//========================================
// CEK PERLU RONDE TAMBAHAN
//========================================

function cekRondeTambahan(){

    DB = loadDB();

    const r1 = DB.pertandingan.pemenangRonde1;
    const r2 = DB.pertandingan.pemenangRonde2;

    DB.pertandingan.rondeTambahan = false;

    // Menang bergantian
    if(

        (r1==="KUNING" && r2==="BIRU") ||

        (r1==="BIRU" && r2==="KUNING")

    ){

        DB.pertandingan.rondeTambahan = true;

    }

    // Dua ronde seri
    if(

        r1==="SERI" &&

        r2==="SERI"

    ){

        DB.pertandingan.rondeTambahan = true;

    }

    updateDB();

}

//========================================
// TENTUKAN PEMENANG PERTANDINGAN
//========================================

function tentukanPemenangPertandingan(){

    DB = loadDB();

    const r1 = DB.pertandingan.pemenangRonde1;
    const r2 = DB.pertandingan.pemenangRonde2;

    DB.pertandingan.pemenangAkhir = "";

    if(r1==="KUNING" && r2==="KUNING"){

        DB.pertandingan.pemenangAkhir="KUNING";

    }

    else if(r1==="BIRU" && r2==="BIRU"){

        DB.pertandingan.pemenangAkhir="BIRU";

    }

    else if(r1==="KUNING" && r2==="SERI"){

        DB.pertandingan.pemenangAkhir="KUNING";

    }

    else if(r1==="SERI" && r2==="KUNING"){

        DB.pertandingan.pemenangAkhir="KUNING";

    }

    else if(r1==="BIRU" && r2==="SERI"){

        DB.pertandingan.pemenangAkhir="BIRU";

    }

    else if(r1==="SERI" && r2==="BIRU"){

        DB.pertandingan.pemenangAkhir="BIRU";

    }

    else{

        DB.pertandingan.pemenangAkhir="";

    }

    if(DB.pertandingan.pemenangAkhir !== ""){

        DB.pertandingan.status = "HASIL";

        DB.pertandingan.hasilSiap = true;

        DB.pertandingan.arsipTersimpan = false;

    }

    updateDB();

}

function tentukanPemenangRonde(){

    DB = loadDB();

    const hasil = rekapRondeAktif();

    let pemenang = "";

    if(hasil.kuning > hasil.biru){

        pemenang = "KUNING";

    }else if(hasil.biru > hasil.kuning){

        pemenang = "BIRU";

    }else{

        if(hasil.hk < hasil.hb){

            pemenang = "KUNING";

        }else if(hasil.hb < hasil.hk){

            pemenang = "BIRU";

        }else{

            pemenang = "SERI";

        }

    }

    const ronde = getNamaRondeAktif();

    DB.pertandingan.hasilRonde[ronde].pemenang = pemenang;

    if(DB.pertandingan.ronde===1){

        DB.pertandingan.pemenangRonde1 = pemenang;

    }else if(DB.pertandingan.ronde===2){

        DB.pertandingan.pemenangRonde2 = pemenang;

    }else{

        DB.pertandingan.pemenangTambahan = pemenang;

    }

    updateDB();

    return pemenang;

}

//========================================
// PROSES AKHIR RONDE
//========================================

function prosesAkhirRonde(){

    stopTimer();

    DB = loadDB();

    const hasil = rekapRondeAktif();

    const mutlak = cekMenangMutlak();

    const pemenang = tentukanPemenangRonde();

    const pemenangFinal = mutlak!=="" ? mutlak : pemenang;

    cekRondeTambahan();

    tentukanPemenangPertandingan();

    DB = loadDB();

    bukaPopup({

        tipe:"HASIL_RONDE",

        judul:
            mutlak!==""
            ? "MENANG MUTLAK"
            : (
                pemenang==="SERI"
                ? "HASIL RONDE SERI"
                : "PEMENANG RONDE"
            ),

        pemenang:pemenangFinal,

        metode:"",

        kuning:hasil.kuning,

        biru:hasil.biru,

        hukumanKuning:hasil.hk,

        hukumanBiru:hasil.hb,

        ronde:DB.pertandingan.ronde,

        alasan:""

    });

    DB.pertandingan.status = "SELESAI RONDE";

    DB.pertandingan.timerBerjalan = false;

    updateDB();

}

//========================================
// AKHIRI PERTANDINGAN
//========================================

function akhiriPertandingan(pemenang, alasan){

    stopTimer();

    DB = loadDB();

    DB.pertandingan.status = alasan;

    DB.pertandingan.pemenangAkhir = pemenang.toUpperCase();

    DB.pertandingan.popup = {

        tampil:true,

        judul:alasan,

        pemenang:pemenang.toUpperCase(),

        kuning:DB.pertandingan.total.kuning,

        biru:DB.pertandingan.total.biru,

        hukumanKuning:0,

        hukumanBiru:0,

        ronde:DB.pertandingan.ronde,

        alasan:alasan

    };

    DB.kp.lastUpdate = Date.now();

    updateDB();

}

/*====================================================
 ATSC PRO v3.1 FINAL
 KP.JS
 BAGIAN 5
 SINKRONISASI & AUTO REFRESH
====================================================*/

//========================================
// KP ONLINE
//========================================

function onlineKP(){

    DB = loadDB();

    DB.kp.online = true;
    DB.kp.lastUpdate = Date.now();

    updateDB();

}

//========================================
// REFRESH DATA
//========================================

function refreshKP(){

    DB = loadDB();

    tampilPartai();

    updateScoreKP();

    updateTimer();

    updateStatus();

    if($("ronde")){

        $("ronde").innerHTML = DB.pertandingan.ronde;

    }

    updatePopup();

}

//========================================
// AUTO REFRESH
//========================================

setInterval(function(){

    refreshKP();

    onlineKP();

},500);

//========================================
// OFFLINE SAAT HALAMAN DITUTUP
//========================================

window.addEventListener("beforeunload",function(){

    DB = loadDB();

    DB.kp.online = false;

    DB.kp.lastUpdate = Date.now();

    updateDB();

});

//========================================
// MENANG ANGKA
//========================================

function menangAngka(sudut){

    DB = loadDB();

    stopTimer();

    DB.pertandingan.status = "SELESAI";
    DB.pertandingan.pemenangAkhir = sudut.toUpperCase();
    DB.pertandingan.metodeMenang = "MENANG ANGKA";

    updateDB();
  simpanArsipPertandingan();

  bukaPopup({

    tipe:"HASIL_PARTAI",

    judul:"PERTANDINGAN SELESAI",

    pemenang:sudut.toUpperCase(),

    metode:"MENANG ANGKA"

});

}

//========================================
// MENANG TEKNIK
//========================================

function menangTeknik(sudut){

    DB = loadDB();

    stopTimer();

    DB.pertandingan.status = "SELESAI";
    DB.pertandingan.pemenangAkhir = sudut.toUpperCase();
    DB.pertandingan.metodeMenang = "MENANG TEKNIK";

    updateDB();
  simpanArsipPertandingan();

    bukaPopup({

    tipe:"HASIL_PARTAI",

    judul:"PERTANDINGAN SELESAI",

    pemenang:sudut.toUpperCase(),

    metode:"MENANG TEKNIK"

});

}

//========================================
// WMP
//========================================

function menangWMP(sudut){

    DB = loadDB();

    stopTimer();

    DB.pertandingan.status = "SELESAI";
    DB.pertandingan.pemenangAkhir = sudut.toUpperCase();
    DB.pertandingan.metodeMenang = "WMP";

    updateDB();
  simpanArsipPertandingan();

    bukaPopup({

    tipe:"HASIL_PARTAI",

    judul:"PERTANDINGAN SELESAI",

    pemenang:sudut.toUpperCase(),

    metode:"WMP"

});

}

//========================================
// WALK OVER
//========================================

function walkOver(sudut){

    DB = loadDB();

    stopTimer();

    DB.pertandingan.status = "SELESAI";
    DB.pertandingan.pemenangAkhir = sudut.toUpperCase();
    DB.pertandingan.metodeMenang = "WO";

    updateDB();
  simpanArsipPertandingan();

  bukaPopup({

    tipe:"HASIL_PARTAI",

    judul:"PERTANDINGAN SELESAI",

    pemenang:sudut.toUpperCase(),

    metode:"WALK OVER"

});

}

//========================================
// DISKUALIFIKASI
//========================================

function diskualifikasi(){

    DB = loadDB();

    let pemenang = prompt(
        "Siapa yang menang?\n\nKetik:\nkuning\natau\nbiru"
    );

    if(!pemenang){

        return;

    }

    pemenang = pemenang.toLowerCase();

    if(pemenang!="kuning" && pemenang!="biru"){

        alert("Input salah.");

        return;

    }

    stopTimer();

    DB.pertandingan.status = "SELESAI";
    DB.pertandingan.pemenangAkhir = pemenang.toUpperCase();
    DB.pertandingan.metodeMenang = "DISKUALIFIKASI";

    updateDB();
  simpanArsipPertandingan();

    bukaPopup({

    tipe:"HASIL_PARTAI",

    judul:"PERTANDINGAN SELESAI",

    pemenang:sudut.toUpperCase(),

    metode:"DISKUALIFIKASI"

});

}

//========================================
// TAMPIL POPUP KP
//========================================

function tutupPopupKP(){

    $("kpPopup").style.display = "none";

    DB = loadDB();

    DB.pertandingan.popup.tampil = false;

    updateDB();

    if(DB.pertandingan.status==="HASIL"){

        bukaPopup({

            tipe:"HASIL_PARTAI",

            judul:"PEMENANG PERTANDINGAN",

            pemenang:DB.pertandingan.pemenangAkhir,

            metode:DB.pertandingan.metodeMenang || "MENANG ANGKA"

        });

    }

}

//========================================
// TUTUP POPUP
//========================================

function tutupPopup(){

    DB = loadDB();

    DB.pertandingan.popup.tampil = false;

    updateDB();

}

//========================================
// BUNYIKAN ALARM
//========================================

function bunyiAlarm(){

    const alarm = $("alarmSound");

    if(!alarm){

        console.log("Alarm tidak ditemukan");

        return;

    }

    alarm.pause();

    alarm.currentTime = 0;

    alarm.play()
    .then(function(){

        console.log("Alarm dimainkan");

    })
    .catch(function(err){

        console.log("Alarm gagal:",err);

    });

}

//========================================
// SIMPAN ARSIP PERTANDINGAN
//========================================

function simpanArsipPertandingan(){

    DB = loadDB();

    if(DB.partaiAktif === null){
        return;
    }

    const partai = DB.partai[DB.partaiAktif];

    // Jangan simpan dua kali
    if(partai.selesai === true){
        return;
    }

    // Pastikan arsip ada
    if(!DB.arsip){
        DB.arsip = [];
    }

    const arsip = {

        id: Date.now(),

        tanggal: new Date().toLocaleString("id-ID"),

        nomor: partai.nomor || "",

        kelas: partai.kelas || "",

        gelanggang: partai.gelanggang || DB.kejuaraan.gelanggang,

        kuning: JSON.parse(JSON.stringify(partai.kuning)),

        biru: JSON.parse(JSON.stringify(partai.biru)),

        hasilRonde: JSON.parse(JSON.stringify(DB.pertandingan.hasilRonde)),

        score: JSON.parse(JSON.stringify(DB.pertandingan.score)),

        hukuman: JSON.parse(JSON.stringify(DB.pertandingan.hukuman)),

        total: JSON.parse(JSON.stringify(DB.pertandingan.total)),

        pemenangRonde1: DB.pertandingan.pemenangRonde1 || "",

        pemenangRonde2: DB.pertandingan.pemenangRonde2 || "",

        pemenangTambahan: DB.pertandingan.pemenangTambahan || "",

        pemenangAkhir: DB.pertandingan.pemenangAkhir || "",

        metodeMenang: DB.pertandingan.metodeMenang || "",

        status: DB.pertandingan.status || "SELESAI",

        waktuSelesai: Date.now()

    };

    DB.arsip.push(arsip);

    // Tandai partai selesai agar tidak tersimpan dua kali
    partai.selesai = true;

    DB.partai[DB.partaiAktif] = partai;

    updateDB();

}


function bukaPopup(data){

    DB = loadDB();

    DB.pertandingan.popup = {

        tampil:true,

        tipe:data.tipe || "HASIL_RONDE",

        judul:data.judul || "",

        subJudul:data.subJudul || "",

        pemenang:data.pemenang || "",

        metode:data.metode || "",

        kuning:data.kuning || 0,

        biru:data.biru || 0,

        hukumanKuning:data.hukumanKuning || 0,

        hukumanBiru:data.hukumanBiru || 0,

        ronde:data.ronde || DB.pertandingan.ronde,

        alasan:data.alasan || "",

        waktu:Date.now()

    };

    updateDB();

    bunyiAlarm();

}

function updatePopup(){

    DB = loadDB();

    if(!DB.pertandingan.popup.tampil){

        $("kpPopup").style.display = "none";

        return;

    }

    $("kpPopupTitle").innerHTML =
        DB.pertandingan.popup.judul;

    $("kpPopupNama").innerHTML =
        DB.pertandingan.popup.pemenang;

    if(DB.pertandingan.popup.tipe==="HASIL_RONDE"){

        $("kpPopupMetode").innerHTML =
            "KUNING : " +
            DB.pertandingan.popup.kuning +
            " | BIRU : " +
            DB.pertandingan.popup.biru;

    }else{

        $("kpPopupMetode").innerHTML =
            DB.pertandingan.popup.metode || "";

    }

    $("kpPopup").style.display = "flex";

}