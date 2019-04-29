<?php
include 'db.php';
$userId = $_POST["user_id"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$phone = $_POST["phone"];
$email = $_POST["email"];
$pin = $_POST["pin"];
$profilePictureURL = $_POST["profile_picture_url"];
$results = $c->query("SELECT * FROM users WHERE email='" . $email . "'");
if ($results && $results->num_rows > 0) {
    echo -2;
    return;
}
$c->query("INSERT INTO users (id, phone, email, pin, confirmed, first_name, last_name, profile_picture_url) VALUES ('" . $userId . "', '" . $phone . "', '" . $email . "', '" . $pin . "', 0, '" . $firstName . "', '" . $lastName . "', '" . $profilePictureURL . "')");
echo 0;