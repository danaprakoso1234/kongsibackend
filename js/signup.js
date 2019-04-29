$(document).ready(function() {
});

function signup() {
    var name = $("#name").val().trim();
    var email = $("#email").val().trim();
    var phone = $("#phone").val().trim();
    var password = $("#password").val().trim();
    if (name == "") {
        show("Mohon masukkan nama");
        return;
    }
    if (email == "") {
        show("Mohon masukkan email");
        return;
    }
    if (phone == "") {
        show("Mohon masukkan no. HP");
        return;
    }
    if (password == "") {
        show("Mohon masukkan kata sandi");
        return;
    }
    var fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);
    fd.append("name", name);
    fd.append("phone", phone);
    showProgress("Sedang mendaftar");
    $.ajax({
        type: 'POST',
        url: PHP_URL+'signup.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(a) {
            console.log(a);
            hideProgress();
            var response = parseInt(a);
            if (response == 0) {
                showAlert("Pendaftaran Berhasil", "Pendaftaran Anda sudah berhasil. Namun Anda belum bisa masuk sampai admin kami menyetujuinya. Silahkan masuk beberapa saat lagi.");
            } else if (response == -1) {
                show("Email sudah digunakan");
            }
        }
    });
}