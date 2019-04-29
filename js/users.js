var currentMaximumConnections = 1;
var currentProfilePicture = "";
var users;
var profilePictureFile = null;
var profilePictureURL = "";

$(document).ready(function() {
    getUsers();
});

function getUsers() {
    $("#users").find("*").remove();
    showProgress("Memuat pengguna");
    $.ajax({
        type: 'GET',
        url: PHP_URL+'get-users.php',
        dataType: 'text',
        cache: false,
        success: function(a) {
            users = JSON.parse(a);
            for (var i=0; i<users.length; i++) {
                var user = users[i];
                var name = user["first_name"]+" "+user["last_name"];
                var verify;
                var confirmed = parseInt(user["confirmed"]);
                if (confirmed == 0) {
                    verify = "<a class='verify-user' style='cursor: pointer; text-decoration: none; color: #3498db;'>Verifikasi</a>";
                } else {
                    verify = "Terverifikasi";
                }
                $("#users").append(""+
                    "<tr>"+
                        "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+(i+1)+"</div></td>"+
                        "<td>"+name+"</td>"+
                        "<td>"+user["email"]+"</td>"+
                        "<td>"+user["pin"]+"</td>"+
                        "<td>"+user["phone"]+"</td>"+
                        "<td>"+verify+"</td>"+
                        "<td><a class='edit-user link'>Ubah</a></td>"+
                        "<td><a class='delete-user link'>Hapus</a></td>"+
                    "</tr>"
                );
            }
            hideProgress();
            setUserClickListener();
        }
    });
}

function setUserClickListener() {
    $(".edit-user").on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        $("#edit-user-title").html("Ubah Pengguna");
        $("#edit-user-first-name").val(user["first_name"]);
        $("#edit-user-last-name").val(user["last_name"]);
        $("#edit-user-phone").val(user["phone"]);
        $("#edit-user-email").val(user["email"]);
        $("#edit-user-pin").val(user["pin"]);
        profilePictureURL = user["profile_picture_url"].trim();
        if (profilePictureURL != "") {
            $("#edit-user-profile-picture").attr("src", profilePictureURL);
        }
        $("#edit-user").animate({
            scrollTop: 0
        });
        $("#edit-user-container")
            .css("display", "flex")
            .hide()
            .fadeIn(300);
        $("#edit-user-ok").html("Ubah").unbind().on("click", function() {
            var firstName = $("#edit-user-first-name").val().trim();
            var lastName = $("#edit-user-last-name").val().trim();
            var phone = $("#edit-user-phone").val().trim();
            var email = $("#edit-user-email").val().trim();
            var pin = $("#edit-user-pin").val().trim();
            if (email == "") {
                show("Mohon masukkan email");
                return;
            }
            if (pin == "") {
                show("Mohon masukkan kata sandi");
                return;
            }
            showProgress("Menyimpan data pengguna");
            var fileName = generateRandomID();
            if (profilePictureFile != null) {
                var fd2 = new FormData();
                fd2.append("file_name", fileName);
                fd2.append("file", profilePictureFile);
                $.ajax({
                    type: 'POST',
                    url: PHP_URL+'upload-image.php',
                    data: fd2,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function(a) {
                        profilePictureURL = ROOT_URL+"userdata/imgs/"+fileName;
                        profilePictureFile = null;
                        saveUser(index, tr, user["id"], firstName, lastName, email, phone, pin, profilePictureURL);
                        profilePictureURL = "";
                    }
                });
            } else {
                saveUser(index, tr, user["id"], firstName, lastName, email, phone, pin, profilePictureURL);
            }
        });
    });
    $(".verify-user").on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        $("#confirm-title").html("Verifikasi Pengguna");
        $("#confirm-msg").html("Apakah Anda yakin ingin men-verifikasi pengguna ini?");
        $("#confirm-ok").on("click", function() {
            $("#confirm-container").hide();
            showProgress("Men-verifikasi user");
            var fd = new FormData();
            fd.append("user_id", user["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_URL+'verify-user.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    td.html("Terverifikasi");
                    hideProgress();
                }
            });
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".delete-user").on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        $("#confirm-title").html("Hapus Pengguna");
        $("#close-confirm").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pengguna ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            showProgress("Menghapus pengguna");
            var fd = new FormData();
            fd.append("user_id", user["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_URL+'delete-user.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    hideProgress();
                    // Delete user from array at specified index
                    users.splice(index, 1);
                    $("#users").children().eq(index).remove();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function saveUser(index, tr, userID, firstName, lastName, email, phone, pin, profilePictureURL) {
    var fd = new FormData();
    fd.append("id", userID);
    fd.append("first_name", firstName);
    fd.append("last_name", lastName);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("pin", pin);
    fd.append("profile_picture_url", profilePictureURL);
    $.ajax({
        type: 'POST',
        url: PHP_URL+'edit-user.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(a) {
            hideProgress();
            var response = a;
            console.log("Response: "+response);
            if (response == 0) {
                $("#edit-user-container").fadeOut(300);
                tr.find("td:eq(1)").html(firstName+" "+lastName);
                tr.find("td:eq(2)").html(email);
                tr.find("td:eq(3)").html(pin);
                tr.find("td:eq(4)").html(phone);
                users[index]["first_name"] = firstName;
                users[index]["last_name"] = lastName;
                users[index]["email"] = email;
                users[index]["phone"] = phone;
                users[index]["pin"] = pin;
                users[index]["profile_picture_url"] = profilePictureURL;
            } else if (response == -1) {
                show("Nama pengguna sudah digunakan");
            } else if (response == -2) {
                show("Nomor HP sudah digunakan");
            } else if (response == -3) {
                show("Email sudah digunakan");
            } else {
                show("Kesalahan: "+response);
            }
        }
    });
}

function addUser() {
    currentMaximumConnections = 1;
    currentProfilePicture = "img/profile-picture.jpg";
    $("#edit-user-title").html("Tambah Pengguna");
    $("#edit-user-first-name").val("");
    $("#edit-user-last-name").val("");
    $("#edit-user-phone").val("");
    $("#edit-user-email").val("");
    $("#edit-user-pin").val("");
    $("#edit-user-profile-picture").attr("src", currentProfilePicture);
    $("#edit-user-container").css("display", "flex").hide().fadeIn(300);
    $("#edit-user-ok").html("Tambah").unbind().on("click", function() {
        var firstName = $("#edit-user-first-name").val().trim();
        var lastName = $("#edit-user-last-name").val().trim();
        var phone = $("#edit-user-phone").val().trim();
        var email = $("#edit-user-email").val().trim();
        var pin = $("#edit-user-pin").val().trim();
        if (email == "") {
            show("Mohon masukkan email");
            return;
        }
        if (pin == "") {
            show("Mohon masukkan kata sandi");
            return;
        }
        showProgress("Membuat pengguna");
        var fileName = generateRandomID();
        if (profilePictureFile != null) {
            var fd2 = new FormData();
            fd2.append("file_name", fileName);
            fd2.append("file", profilePictureFile);
            $.ajax({
                type: 'POST',
                url: PHP_URL+'upload-image.php',
                data: fd2,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    profilePictureURL = ROOT_URL+"userdata/imgs/"+fileName;
                    profilePictureFile = null;
                    createUser(firstName, lastName, phone, pin, email, profilePictureURL);
                    profilePictureURL = "";
                }
            });
        } else {
            createUser(firstName, lastName, phone, pin, email, "");
        }
    });
}

function createUser(firstName, lastName, phone, pin, email, profilePictureURL) {
    var fd = new FormData();
    fd.append("first_name", firstName);
    fd.append("last_name", lastName);
    fd.append("phone", phone);
    fd.append("pin", pin);
    fd.append("email", email);
    fd.append("profile_picture_url", profilePictureURL);
    firebase.auth().onAuthStateChanged(function(userInfo) {
        var userId = userInfo.uid;
        if (userId) {
            fd.append("user_id", userId);
            $.ajax({
                type: 'POST',
                url: PHP_URL+'create-user.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    hideProgress();
                    if (response == 0) {
                        $.ajax({
                            type: 'GET',
                            url: PHP_URL+'get-user-by-email.php',
                            data: {'email': email},
                            dataType: 'text',
                            cache: false,
                            success: function(a) {
                                if (a != -1) {
                                    var userInfo = JSON.parse(a);
                                    firebase.database().ref("users/" + userInfo["id"]).set({
                                        email: email,
                                        password: pin
                                    });
                                }
                            }
                        });
                        $("#edit-user-container").fadeOut(300);
                        $("#users").append(""+
                            "<tr>"+
                            "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+users.length+"</div></td>"+
                            "<td>"+firstName+" "+lastName+"</td>"+
                            "<td>"+email+"</td>"+
                            "<td>"+pin+"</td>"+
                            "<td>"+phone+"</td>"+
                            "<td><a class='verify-user' style='cursor: pointer; text-decoration: none; color: #3498db;'>Verifikasi</a></td>"+
                            "<td><a class='edit-user link'>Ubah</a></td>"+
                            "<td><a class='delete-user link'>Hapus</a></td>"+
                            "</tr>"
                        );
                    } else if (response == -1) {
                        show("Nama pengguna sudah digunakan");
                    } else if (response == -2) {
                        show("Nomor HP sudah digunakan");
                    } else if (response == -3) {
                        show("Email sudah digunakan");
                    } else {
                        show("Kesalahan: "+response);
                    }
                }
            });
        }
    });
    firebase.auth().createUserWithEmailAndPassword(email, pin).catch(function(error) {
    });
}

function closeEditUserDialog() {
    $("#edit-user-container").fadeOut(300);
}

function increaseMaxConn() {
    currentMaximumConnections++;
    $("#maximum-connections").val(currentMaximumConnections);
}

function decreaseMaxConn() {
    if (currentMaximumConnections > 1) {
        currentMaximumConnections--;
    }
    $("#maximum-connections").val(currentMaximumConnections);
}

function selectProfilePicture() {
    $("#edit-user-select-profile-picture").on("change", function() {
        var fr = new FileReader();
        fr.onload = function() {
            $("#edit-user-profile-picture").attr("src", fr.result);
        };
        profilePictureFile = $(this).prop("files")[0];
        fr.readAsDataURL(profilePictureFile);
    });
    $("#edit-user-select-profile-picture").click();
}

function generateRandomID() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}