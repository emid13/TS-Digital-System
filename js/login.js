 function login(){

    const role=document.getElementById("role").value;

    localStorage.setItem("PW_ID",role);

    switch(role){

        case "sekretaris":
            location.href="sekretaris.html";
            break;

        case "kp":
            location.href="kp.html";
            break;

        case "pw1":
        case "pw2":
        case "pw3":
        case "pw4":
            location.href="pw.html";
            break;

        case "scoreboard":
            location.href="scoreboard.html";
            break;

    }

}