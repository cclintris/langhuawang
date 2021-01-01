function md5_encode() {
    // console.log("md5_encode login")
    if(!(document.getElementById("username").value == "" || document.getElementById("password").value == "")) {
        document.getElementById("password").value = md5(document.getElementById("password").value).slice(0, 30)
    }
}
