//=====================================
// LOAD
//=====================================

let DB = loadDB();

refreshArsip();

//=====================================

function refreshArsip(){

    DB = loadDB();

    tampilHeader();

    tampilArsip();

}

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

function tampilArsip(){

    let body =
    document.getElementById("arsipBody");

    body.innerHTML="";

    if(!DB.arsip){

        return;

    }

    DB.arsip.forEach(function(item,index){

        body.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${item.nomor}</td>

<td>${item.kelas}</td>

<td>${item.kuning.nama}</td>

<td>${item.biru.nama}</td>

<td>${item.pemenangAkhir}</td>

<td>${item.metodeMenang}</td>

<td>${item.tanggal}</td>

<td>

<button
class="btnDetail"
onclick="lihatDetail(${index})">

Detail

</button>

<button
class="btnPdf"
onclick="cetakPDF(${index})">

PDF

</button>

</td>

</tr>

`;

    });

}

//=====================================

function lihatDetail(index){

    localStorage.setItem(
        "ATSC_ARSIP_DETAIL",
        index
    );

    window.location.href =
    "arsip-detail.html";

}

//=====================================

function cetakPDF(index){

    alert(

        "Tahap berikutnya akan dibuat PDF otomatis."

    );

}