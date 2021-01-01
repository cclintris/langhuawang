function md5_encode() {
    // console.log("md5_encode register")
    if(!((document.getElementById("username").value == "")||
         (document.getElementById("password").value == "") ||
         (document.getElementById("checkPassword").value == "") ||
         (document.getElementById("userType").value == "")||
         (document.getElementById("userDate").value == "") ||
         (document.getElementById("email").value == ""))) {


        document.getElementById("password").value = md5(document.getElementById("password").value).slice(0, 30)
    }
}
