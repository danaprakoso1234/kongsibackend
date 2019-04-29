var vehicles = [];

$(document).ready(function() {
    getVehicles();
});

function getVehicles() {
    $.ajax({
        type: 'GET',
        url: PHP_URL+'get-vehicles.php',
        dataType: 'text',
        cache: false,
        success: function(a) {
            var vehiclesJSON = JSON.parse(a);
            for (var i=0; i<vehiclesJSON.length; i++) {
                var vehicle = vehiclesJSON[i];
                $("#vehicles").append(""
                    +"<tr>"
                    +"<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i + 1) + "</div></td>"
                    +"<td>"+vehicle["name"]+"</td>"
                    +"<td>"+vehicle["price_per_km"]+"</td>"
                    +"<td><a class='edit-vehicle link'>Ubah</a></td>"
                    +"<td><a class='delete-vehicle link'>Hapus</a></td>"
                    +"</tr>"
                );
                vehicles.push(vehicle);
            }
            setListeners();
        }
    });
}

function setListeners() {
    $(".edit-vehicle").on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = tr.parent().children().index(tr);
        var vehicle = vehicles[index];
        $("#edit-vehicle-title").html("Ubah Kendaraan");
        $("#edit-vehicle-name").val(vehicle["name"]);
        $("#edit-vehicle-price").val(vehicle["price_per_km"]);
        $("#edit-vehicle-ok").html("Ubah").on("click", function() {
            var name = $("#edit-vehicle-name").val().trim();
            var price = $("#edit-vehicle-price").val();
            $("#edit-vehicle-container").hide();
            showProgress("Menyimpan data kendaraan");
            var fd = new FormData();
            fd.append("id", vehicle["id"]);
            fd.append("name", name);
            fd.append("price", price);
            $.ajax({
                type: 'POST',
                url: PHP_URL+'edit-vehicle.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    hideProgress();
                    vehicles[index]["name"] = name;
                    vehicles[index]["price"] = price;
                    tr.find("td:eq(1)").html(name);
                    tr.find("td:eq(2)").html(price);
                }
            });
        });
        $("#edit-vehicle-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".delete-vehicle").on("click", function() {
        var td = $(this).parent();
        var tr = td.parent();
        var index = tr.parent().children().index(tr);
        var vehicle = vehicles[index];
        $("#confirm-title").html("Hapus Kendaraan");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus kendaraan ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
            showProgress("Menghapus kendaraan");
            var fd = new FormData();
            fd.append("vehicle_id", vehicle["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_URL+'delete-vehicle.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    vehicles.splice(index, 1);
                    hideProgress();
                }
            });
        });
    });
}

function closeEditVehicleDialog() {
    $("#edit-vehicle-container").fadeOut(300);
}

function addVehicle() {
    $("#edit-vehicle-name").val("");
    $("#edit-vehicle-price").val("");
    $("#edit-vehicle-title").html("Tambah Kendaraan");
    $("#edit-vehicle-container").css("display", "flex").hide().fadeIn(300);
    $("#edit-vehicle-ok").on("click", function() {
        var name = $("#edit-vehicle-name").val().trim();
        var price = $("#edit-vehicle-price").val();
        var fd = new FormData();
        fd.append("name", name);
        fd.append("price", price);
        $("#edit-vehicle-container").hide();
        showProgress("Menambah kendaraan");
        $.ajax({
            type: 'POST',
            url: PHP_URL+'create-vehicle.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(a) {
                var vehicle = {
                    "name": name,
                    "price_per_km": price
                };
                vehicles.push(vehicle);
                $("#vehicles").append(""
                    +"<tr>"
                    +"<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + vehicles.length + "</div></td>"
                    +"<td>"+name+"</td>"
                    +"<td>"+price+"</td>"
                    +"<td><a class='edit-vehicle link'>Ubah</a></td>"
                    +"<td><a class='delete-vehicle link'>Hapus</a></td>"
                    +"</tr>"
                );
                hideProgress();
                setListeners();
            }
        });
    });
}