/*====================================================
ATSC PRO v3.2
ARSIP DETAIL
====================================================*/

//=====================================
// DATABASE
//=====================================

DB = loadDB();

const index = Number(
    localStorage.getItem("ATSC_ARSIP_DETAIL")
);

const data = DB.arsip[index];

//=====================================
// VALIDASI
//=====================================

if(
isNaN(index) ||
!DB.arsip ||
!DB.arsip[index]
){

    alert("Data arsip tidak ditemukan.");

    history.back();

}

//=====================================
// LOAD
//=====================================

window.onload=function(){

    tampilHeader();

    tampilPartai();

    tampilPesilat();

    tampilHasilRonde();

    tampilPW();

    tampilHukuman();

    tampilHasil();

};

//=====================================
// HEADER
//=====================================

function tampilHeader(){

    document.getElementById("namaKejuaraan").innerHTML =
    DB.kejuaraan.nama;

    document.getElementById("infoKejuaraan").innerHTML =
    DB.kejuaraan.tempat+
    " | "+
    DB.kejuaraan.tanggal;

}

//=====================================
// PARTAI
//=====================================

function tampilPartai(){

    document.getElementById("nomorPartai").innerHTML =
    data.nomor;

    document.getElementById("kelasPartai").innerHTML =
    data.kelas;

    document.getElementById("gelanggang").innerHTML =
    data.gelanggang;

    document.getElementById("tanggal").innerHTML =
    data.tanggal;

}

//=====================================
// PESILAT
//=====================================

function tampilPesilat(){

    document.getElementById("namaKuning").innerHTML =
    data.kuning.nama;

    document.getElementById("kontingenKuning").innerHTML =
    data.kuning.kontingen;

    document.getElementById("namaBiru").innerHTML =
    data.biru.nama;

    document.getElementById("kontingenBiru").innerHTML =
    data.biru.kontingen;

}

//=====================================
// HASIL RONDE
//=====================================

function tampilHasilRonde(){

    document.getElementById("r1Kuning").innerHTML =
    data.hasilRonde.ronde1.kuning;

    document.getElementById("r1Biru").innerHTML =
    data.hasilRonde.ronde1.biru;

    document.getElementById("r1Winner").innerHTML =
    data.hasilRonde.ronde1.pemenang || "-";

    document.getElementById("r2Kuning").innerHTML =
    data.hasilRonde.ronde2.kuning;

    document.getElementById("r2Biru").innerHTML =
    data.hasilRonde.ronde2.biru;

    document.getElementById("r2Winner").innerHTML =
    data.hasilRonde.ronde2.pemenang || "-";

    document.getElementById("rtKuning").innerHTML =
    data.hasilRonde.rondeTambahan.kuning;

    document.getElementById("rtBiru").innerHTML =
    data.hasilRonde.rondeTambahan.biru;

    document.getElementById("rtWinner").innerHTML =
    data.hasilRonde.rondeTambahan.pemenang || "-";

}

//=====================================
// PEMBANTU WASIT
//=====================================

function tampilPW(){

    let ronde="ronde1";

    if(data.score.rondeTambahan){

        ronde="rondeTambahan";

    }else if(data.score.ronde2){

        ronde="ronde2";

    }

    ["pw1","pw2","pw3","pw4"].forEach(function(pw){

        document.getElementById(
        pw+"Kuning"
        ).innerHTML=
        data.score[ronde][pw].kuning;

        document.getElementById(
        pw+"Biru"
        ).innerHTML=
        data.score[ronde][pw].biru;

    });

}

//=====================================
// HUKUMAN
//=====================================

function tampilHukuman(){

    let hk=0;

    let hb=0;

    Object.values(data.hukuman).forEach(function(r){

        Object.values(r).forEach(function(p){

            hk+=p.kuning;

            hb+=p.biru;

        });

    });

    document.getElementById("hukumanKuning").innerHTML=hk;

    document.getElementById("hukumanBiru").innerHTML=hb;

}

//=====================================
// HASIL AKHIR
//=====================================

function tampilHasil(){

    document.getElementById("pemenang").innerHTML =
    data.pemenangAkhir;

    document.getElementById("metodeMenang").innerHTML =
    data.metodeMenang;

}

//=====================================
// CETAK PDF
//=====================================

function cetakPDF(){

    window.print();

}

function tampilPejabat(){

    if(DB.kejuaraan){

        document.getElementById("namaKetua").innerHTML =
        DB.kejuaraan.ketua || "";

        document.getElementById("namaSekretaris").innerHTML =
        DB.kejuaraan.sekretaris || "";

    }

}