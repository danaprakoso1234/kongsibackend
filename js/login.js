function login() {
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    if (email == "") {
        show("Mohon masukkan email");
        return;
    }
    if (password == "") {
        show("Mohon masukkan kata sandi");
        return;
    }
    showProgress("Sedang masuk");
    var fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);
    $.ajax({
        type: 'POST',
        url: PHP_URL+'login.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(a) {
            console.log("Response: "+a);
            var response = parseInt(a);
            hideProgress();
            if (response == 0) {
                window.location.href = "common.html";
            } else if (response == -1) {
                show("Kata sandi tidak cocok");
            } else if (response == -2) {
                show("Admin tidak terdaftar");
            }
        }
    });
}