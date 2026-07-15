/*=========================================
ATSC PRO
DEVELOPER MONITOR
=========================================*/

function $(id){
    return document.getElementById(id);
}

//=========================================
// FORMAT TIMER
//=========================================

function formatTimer(detik){

    let menit = Math.floor(detik/60);
    let sisa  = detik%60;

    if(menit<10) menit="0"+menit;
    if(sisa<10) sisa="0"+sisa;

    return menit+":"+sisa;

}

//=========================================
// STATUS ONLINE
//=========================================

function statusOnline(el,status){

    if(!$(el)) return;

    if(status){

        $(el).innerHTML="🟢 ONLINE";
        $(el).className="online";

    }else{

        $(el).innerHTML="🔴 OFFLINE";
        $(el).className="offline";

    }

}

//=========================================
// REFRESH
//=========================================

function refreshDeveloper(){

    DB = loadDB();

    //==============================
    // STATUS PERANGKAT
    //==============================

    statusOnline("kpStatus",DB.kp.online);

    statusOnline("sekStatus",DB.sekretaris.online);

    statusOnline("tvStatus",DB.scoreboard.online);

    statusOnline("pw1Status",DB.pw.pw1.online);

    statusOnline("pw2Status",DB.pw.pw2.online);

    statusOnline("pw3Status",DB.pw.pw3.online);

    statusOnline("pw4Status",DB.pw.pw4.online);

    //==============================
    // PARTAI
    //==============================

    if(DB.partaiAktif!==null){

        const partai=DB.partai[DB.partaiAktif];

        if(partai){

            $("partaiNomor").innerHTML=partai.nomor;
        }

    }else{

        $("partaiNomor").innerHTML="-";

    }

    $("ronde").innerHTML=DB.pertandingan.ronde;

    $("status").innerHTML=DB.pertandingan.status;

    $("timer").innerHTML=
        formatTimer(DB.pertandingan.timer);

    //==============================
    // NILAI
    //==============================

    $("nilaiKuning").innerHTML=
        DB.pertandingan.total.kuning;

    $("nilaiBiru").innerHTML=
        DB.pertandingan.total.biru;

    //==============================
    // POPUP
    //==============================

    if(DB.pertandingan.popup.tampil){

        $("popupJudul").innerHTML=
            DB.pertandingan.popup.judul;

        $("popupPemenang").innerHTML=
            DB.pertandingan.popup.pemenang;

        $("popupNilai").innerHTML=
            DB.pertandingan.popup.kuning+
            " : "+
            DB.pertandingan.popup.biru;

    }else{

        $("popupJudul").innerHTML="-";

        $("popupPemenang").innerHTML="-";

        $("popupNilai").innerHTML="-";

    }

    //==============================
    // DATABASE LIVE
    //==============================

    $("dbLog").textContent=
        JSON.stringify(DB,null,2);

}

//=========================================
// LOAD
//=========================================

window.onload=function(){

    refreshDeveloper();

};

//=========================================
// AUTO REFRESH
//=========================================

setInterval(function(){

    refreshDeveloper();

},300);