/*====================================================
 ATSC PRO v3.1 FINAL
 dashboard.js
 BAGIAN 1
 Inisialisasi Sistem
====================================================*/

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
// ALERT
//========================================

function tampilAlert(pesan){
    alert(pesan);
}

//========================================
// FORMAT TIMER
//========================================

function formatWaktu(detik){

    let menit=Math.floor(detik/60);
    let sisa=detik%60;

    if(menit<10) menit="0"+menit;
    if(sisa<10) sisa="0"+sisa;

    return menit+":"+sisa;

}

//========================================
// SEKRETARIS ONLINE
//========================================

function onlineSekretaris(){

    DB=loadDB();

    DB.sekretaris.online=true;
    DB.sekretaris.lastUpdate=Date.now();

    updateDB();

}

//========================================
// RESET DATABASE
//========================================

function resetDatabase(){

    if(!confirm("Reset seluruh database?")){
        return;
    }

    resetDB();

}

//========================================
// UPDATE DASHBOARD
//========================================

function updateDashboard(){

    DB=loadDB();

    tampilKejuaraan();

    tampilPesilat();

    tampilPartai();

    updateStatistik();

}

//========================================
// AUTO SYNC
//========================================

setInterval(function(){

    DB=loadDB();

    onlineSekretaris();

    updateDashboard();

},
500);

//========================================
// LOAD HALAMAN
//========================================

window.onload = function(){

    DB = loadDB();

    onlineSekretaris();

    cekPerangkat();

    updateDashboard();

    syncDashboard();

}

/*====================================================
ATSC PRO v3.1 FINAL
dashboard.js
FILE 2
MODUL KEJUARAAN
====================================================*/

//========================================
// BUKA POPUP
//========================================

function bukaKejuaraan(){

    $("popupKejuaraan").style.display="flex";

}

//========================================
// TUTUP POPUP
//========================================

function tutupKejuaraan(){

    $("popupKejuaraan").style.display="none";

}

//========================================
// SIMPAN DATA
//========================================

function simpanKejuaraan(){

    DB=loadDB();

    const nama=$("namaKejuaraan").value.trim();
    const tempat=$("tempat").value.trim();
    const tanggal=$("tanggal").value;
    const gelanggang=parseInt($("gelanggang").value);

    if(nama===""){
        tampilAlert("Nama kejuaraan belum diisi.");
        return;
    }

    if(tempat===""){
        tampilAlert("Tempat belum diisi.");
        return;
    }

    if(tanggal===""){
        tampilAlert("Tanggal belum dipilih.");
        return;
    }

    if(isNaN(gelanggang) || gelanggang<=0){
        tampilAlert("Jumlah gelanggang tidak valid.");
        return;
    }

    DB.kejuaraan={

        nama:nama,

        tempat:tempat,

        tanggal:tanggal,

        gelanggang:gelanggang

    };

    updateDB();

    tampilKejuaraan();

    updateStatistik();

    tutupKejuaraan();

    tampilAlert("Data kejuaraan berhasil disimpan.");

}

//========================================
// TAMPILKAN DATA
//========================================

function tampilKejuaraan(){

    DB=loadDB();

    const box=$("listKejuaraan");

    if(!box) return;

    if(!DB.kejuaraan.nama){

        box.innerHTML="Belum ada data kejuaraan.";

        return;

    }

    box.innerHTML=`

    <div class="card-kejuaraan">

        <h3>${DB.kejuaraan.nama}</h3>

        <p>📍 ${DB.kejuaraan.tempat}</p>

        <p>📅 ${DB.kejuaraan.tanggal}</p>

        <p>🥋 Gelanggang : ${DB.kejuaraan.gelanggang}</p>

        <div class="popup-button">

            <button
            class="btn-biru"
            onclick="editKejuaraan()">

                Edit

            </button>

            <button
            class="btn-merah"
            onclick="hapusKejuaraan()">

                Hapus

            </button>

        </div>

    </div>

    `;

}

//========================================
// EDIT
//========================================

function editKejuaraan(){

    DB=loadDB();

    $("namaKejuaraan").value=
    DB.kejuaraan.nama;

    $("tempat").value=
    DB.kejuaraan.tempat;

    $("tanggal").value=
    DB.kejuaraan.tanggal;

    $("gelanggang").value=
    DB.kejuaraan.gelanggang;

    bukaKejuaraan();

}

//========================================
// HAPUS
//========================================

function hapusKejuaraan(){

    if(!confirm("Hapus data kejuaraan?")){

        return;

    }

    DB=loadDB();

    DB.kejuaraan={

        nama:"",
        tempat:"",
        tanggal:"",
        gelanggang:1

    };

    updateDB();

    tampilKejuaraan();

    updateStatistik();

    tampilAlert("Data kejuaraan dihapus.");

}

/*====================================================
 ATSC PRO v3.1 FINAL
 dashboard.js
 BAGIAN 3
 MODUL PESILAT
====================================================*/

//======================================
// BUKA POPUP PESILAT
//======================================

function bukaPesilat(){

    $("popupPesilat").style.display="flex";

    $("popupPesilat").dataset.edit="";

    $("namaPesilat").value="";
    $("kontingenPesilat").value="";
    $("kelasPesilat").value="";
    $("jkPesilat").value="PUTRA";
    $("sudutPesilat").value="KUNING";

}

//======================================
// TUTUP POPUP PESILAT
//======================================

function tutupPesilat(){

    $("popupPesilat").style.display="none";

}

//======================================
// SIMPAN PESILAT
//======================================

function simpanPesilat(){

    DB=loadDB();

    const nama=$("namaPesilat").value.trim();
    const sudut=$("sudutPesilat").value;
    const kontingen=$("kontingenPesilat").value.trim();
    const kelas=$("kelasPesilat").value.trim();
    const jk=$("jkPesilat").value;

    if(nama===""){
        tampilAlert("Nama pesilat belum diisi.");
        return;
    }

    if(kontingen===""){
        tampilAlert("Kontingen belum diisi.");
        return;
    }

    if(kelas===""){
        tampilAlert("Kelas belum diisi.");
        return;
    }

    const data={

        id:Date.now(),

        nama:nama,

        sudut:sudut,

        kontingen:kontingen,

        kelas:kelas,

        jk:jk

    };

    let editIndex=$("popupPesilat").dataset.edit;

    if(editIndex===""){

        DB.pesilat.push(data);

    }else{

        data.id=DB.pesilat[editIndex].id;

        DB.pesilat[editIndex]=data;

    }

    updateDB();

    tampilPesilat();

    updateStatistik();

    tutupPesilat();

    tampilAlert("Pesilat berhasil disimpan.");

}

//======================================
// TAMPILKAN PESILAT
//======================================

function tampilPesilat(){

    DB=loadDB();

    const box=$("listPesilat");

    if(DB.pesilat.length===0){

        box.innerHTML="Belum ada data pesilat.";

        return;

    }

    let html="";

    DB.pesilat.forEach(function(p,index){

        html+=`

        <div class="card-kejuaraan">

            <h3>${p.nama}</h3>

            <p><b>Kontingen :</b> ${p.kontingen}</p>

            <p><b>Kelas :</b> ${p.kelas}</p>

            <p><b>JK :</b> ${p.jk}</p>

            <p><b>Sudut :</b> ${p.sudut}</p>

            <div class="popup-button">

                <button
                class="btn-biru"
                onclick="editPesilat(${index})">

                    Edit

                </button>

                <button
                class="btn-merah"
                onclick="hapusPesilat(${index})">

                    Hapus

                </button>

            </div>

        </div>

        `;

    });

    box.innerHTML=html;

}

//======================================
// EDIT PESILAT
//======================================

function editPesilat(index){

    DB=loadDB();

    const p=DB.pesilat[index];

    $("namaPesilat").value=p.nama;
    $("kontingenPesilat").value=p.kontingen;
    $("kelasPesilat").value=p.kelas;
    $("jkPesilat").value=p.jk;
    $("sudutPesilat").value=p.sudut;

    $("popupPesilat").dataset.edit=index;

    $("popupPesilat").style.display="flex";

}

//======================================
// HAPUS PESILAT
//======================================

function hapusPesilat(index){

    DB=loadDB();

    if(!confirm("Hapus pesilat ini?")){

        return;

    }

    DB.pesilat.splice(index,1);

    updateDB();

    tampilPesilat();

    updateStatistik();

    tampilAlert("Pesilat berhasil dihapus.");

}

//======================================
// CARI PESILAT
//======================================

function cariPesilat(keyword){

    DB=loadDB();

    keyword=keyword.toLowerCase();

    return DB.pesilat.filter(function(p){

        return(

            p.nama.toLowerCase().includes(keyword) ||

            p.kontingen.toLowerCase().includes(keyword) ||

            p.kelas.toLowerCase().includes(keyword)

        );

    });

}

/*====================================================
ATSC PRO v3.1 FINAL
dashboard.js
BAGIAN 4
MODUL PARTAI
====================================================*/

//========================================
// BUKA POPUP PARTAI
//========================================

function bukaPartai(){

    isiPesilat();

    $("popupPartai").dataset.edit="";

    $("nomorPartai").value="";
    $("gelanggangPartai").value=DB.kejuaraan.gelanggang || 1;
    $("kelasPartai").value="";
    $("sudutKuning").value="";
    $("sudutBiru").value="";

    $("popupPartai").style.display="flex";

}

//========================================
// TUTUP POPUP PARTAI
//========================================

function tutupPartai(){

    $("popupPartai").style.display="none";

}

//========================================
// ISI LIST PESILAT
//========================================

function isiPesilat(){

    const kuning=$("sudutKuning");
    const biru=$("sudutBiru");

    kuning.innerHTML='<option value="">Pilih Sudut Kuning</option>';
    biru.innerHTML='<option value="">Pilih Sudut Biru</option>';

    DB.pesilat.forEach(function(p,index){

        const text=
        p.nama+
        " | "+
        p.kontingen+
        " | "+
        p.kelas;

        kuning.innerHTML+=
        `<option value="${index}">${text}</option>`;

        biru.innerHTML+=
        `<option value="${index}">${text}</option>`;

    });

}

//========================================
// SIMPAN PARTAI
//========================================

function simpanPartai(){

    const nomor=parseInt($("nomorPartai").value);
    const gelanggang=parseInt($("gelanggangPartai").value);
    const kelas=$("kelasPartai").value.trim();

    const kIndex=$("sudutKuning").value;
    const bIndex=$("sudutBiru").value;

    if(isNaN(nomor))
        return tampilAlert("Nomor partai belum diisi.");

    if(isNaN(gelanggang))
        return tampilAlert("Gelanggang belum diisi.");

    if(kelas=="")
        return tampilAlert("Kelas belum diisi.");

    if(kIndex==="")
        return tampilAlert("Sudut kuning belum dipilih.");

    if(bIndex==="")
        return tampilAlert("Sudut biru belum dipilih.");

    if(kIndex===bIndex)
        return tampilAlert("Pesilat tidak boleh sama.");

    const kuning=DB.pesilat[kIndex];
    const biru=DB.pesilat[bIndex];

    const data={

        id:Date.now(),

        nomor,

        gelanggang,

        kelas,

        kuning:{
            id:kuning.id,
            nama:kuning.nama,
            kontingen:kuning.kontingen
        },

        biru:{
            id:biru.id,
            nama:biru.nama,
            kontingen:biru.kontingen
        },

        status:"BELUM AKTIF"

    };

    const edit=$("popupPartai").dataset.edit;

    if(edit===""){

        DB.partai.push(data);

    }else{

        data.id=DB.partai[edit].id;

        DB.partai[edit]=data;

    }

    updateDB();

    tampilPartai();

    updateStatistik();

    tutupPartai();

    tampilAlert("Partai berhasil disimpan.");

}

//========================================
// TAMPIL PARTAI
//========================================

function tampilPartai(){

    const box=$("listPartai");

    if(DB.partai.length===0){

        box.innerHTML="Belum ada partai.";

        return;

    }

    let html="";

    DB.partai.forEach(function(p,index){

        let warna="#888";

        if(p.status==="AKTIF") warna="#16a34a";
        if(p.status==="SELESAI") warna="#2563eb";

        html+=`

        <div class="card-kejuaraan">

            <h3>PARTAI ${p.nomor}</h3>

            <p>Kelas : ${p.kelas}</p>

            <p>Gelanggang : ${p.gelanggang}</p>

            <hr>

            <p>🟡 ${p.kuning.nama}</p>

            <p>${p.kuning.kontingen}</p>

            <br>

            <p>🔵 ${p.biru.nama}</p>

            <p>${p.biru.kontingen}</p>

            <hr>

            <p>

                Status :

                <span style="color:${warna};font-weight:bold;">

                    ${p.status}

                </span>

            </p>

            <div class="popup-button">

                <button class="btn-biru"
                onclick="aktifkanPartai(${index})">
                Aktifkan
                </button>

                <button class="btn-kuning"
                onclick="editPartai(${index})">
                Edit
                </button>

                <button class="btn-merah"
                onclick="hapusPartai(${index})">
                Hapus
                </button>

            </div>

        </div>

        `;

    });

    box.innerHTML=html;

}

/*====================================================
 ATSC PRO v3.1 FINAL
 dashboard.js
 BAGIAN 5
 IMPORT EXCEL + STATISTIK + INIT
====================================================*/

//=======================================
// IMPORT EXCEL
//=======================================

function importExcel(){
    $("fileExcel").click();
}

function bacaExcel(e){

    const file=e.target.files[0];

    if(!file){
        tampilAlert("Pilih file Excel.");
        return;
    }

    const reader=new FileReader();

    reader.onload=function(evt){

        const data=new Uint8Array(evt.target.result);

        const wb=XLSX.read(data,{type:"array"});

        const sheet=wb.Sheets[wb.SheetNames[0]];

        const rows=XLSX.utils.sheet_to_json(sheet,{header:1});

        simpanImport(rows);

    };

    reader.readAsArrayBuffer(file);

}

function simpanImport(rows){

    if(rows.length<=1){
        tampilAlert("File kosong.");
        return;
    }

    let jumlah=0;

    for(let i=1;i<rows.length;i++){

        const r=rows[i];

        if(r.length<6) continue;

        DB.partai.push({

            id:Date.now()+i,

            nomor:r[0],

            gelanggang:r[1],

            kelas:r[2],

            kuning:{
                id:null,
                nama:r[3],
                kontingen:r[4]
            },

            biru:{
                id:null,
                nama:r[5],
                kontingen:r[6]||""
            },

            status:"BELUM AKTIF"

        });

        jumlah++;

    }

    updateDB();

    tampilPartai();

    updateStatistik();

    tampilAlert(jumlah+" partai berhasil diimport.");

}

//=======================================
// STATISTIK
//=======================================

function updateStatistik(){

    const stat=document.querySelectorAll(".stat-value");

    if(stat.length>=4){

        stat[0].innerHTML=DB.pesilat.length;

        stat[1].innerHTML=DB.partai.length;

        stat[2].innerHTML=DB.kejuaraan.gelanggang||0;

        stat[3].innerHTML=
            DB.kejuaraan.nama?1:0;

    }

}

//=======================================
// AUTO SYNC DATABASE
//=======================================

function syncDashboard(){

    DB=loadDB();

    tampilKejuaraan();

    tampilPesilat();

    tampilPartai();

    updateStatistik();

}

// refresh tiap 500ms agar selalu sinkron
setInterval(syncDashboard,500);

//=======================================
// STATUS SEKRETARIS
//=======================================

setInterval(function(){

    DB=loadDB();

    DB.sekretaris.online=true;

    DB.sekretaris.lastUpdate=Date.now();

    updateDB();

},2000);


/*====================================================
 ATSC PRO v3.1 FINAL
 dashboard.js
 BAGIAN 6 FINAL
 PARTAI AKTIF + STATUS PERANGKAT
====================================================*/

//========================================
// AKTIFKAN PARTAI
//========================================

function aktifkanPartai(index){

    DB = loadDB();

    if(index<0 || index>=DB.partai.length){
        tampilAlert("Partai tidak ditemukan.");
        return;
    }

    DB.partai.forEach(function(p){
        if(p.status==="AKTIF"){
            p.status="BELUM AKTIF";
        }
    });

    DB.partai[index].status="AKTIF";

    DB.partaiAktif=index;

    DB.pertandingan=cloneDefault().pertandingan;

    updateDB();

    tampilPartai();

    updateStatistik();

    tampilAlert(
        "Partai "+DB.partai[index].nomor+
        " berhasil diaktifkan."
    );

}

//========================================
// PARTAI AKTIF
//========================================

function getPartaiAktif(){

    DB=loadDB();

    if(DB.partaiAktif===null){
        return null;
    }

    return DB.partai[DB.partaiAktif];

}

//========================================
// SELESAIKAN PARTAI
//========================================

function selesaiPartai(){

    DB=loadDB();

    if(DB.partaiAktif===null){
        return;
    }

    DB.partai[DB.partaiAktif].status="SELESAI";

    updateDB();

    tampilPartai();

}

//========================================
// STATUS PERANGKAT
//========================================

function cekPerangkat(){

    DB=loadDB();

    const sekarang=Date.now();

    const batas=5000;

    if(DB.kp)
        DB.kp.online=
        (sekarang-DB.kp.lastUpdate)<batas;

    if(DB.sekretaris)
        DB.sekretaris.online=
        (sekarang-DB.sekretaris.lastUpdate)<batas;

    if(DB.scoreboard)
        DB.scoreboard.online=
        (sekarang-DB.scoreboard.lastUpdate)<batas;

    ["pw1","pw2","pw3","pw4"].forEach(function(id){

        if(DB.pw[id]){

            DB.pw[id].online=
            (sekarang-DB.pw[id].lastUpdate)<batas;

        }

    });

    updateDB();

}

//========================================
// AUTO STATUS
//========================================

setInterval(function(){

    cekPerangkat();

},1000);

//========================================
// REFRESH PARTAI AKTIF
//========================================

function refreshPartaiAktif(){

    const p=getPartaiAktif();

    if(!p) return;

    console.log(
        "PARTAI AKTIF :",
        p.nomor,
        p.kuning.nama,
        "vs",
        p.biru.nama
    );

}

setInterval(refreshPartaiAktif,1000);

console.log("Dashboard Partai Aktif Loaded");