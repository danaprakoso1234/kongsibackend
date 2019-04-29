<?php
include 'db.php';
$userId = $_POST["id"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$pin = $_POST["pin"];
$profilePictureURL = $_POST["profile_picture_url"];
$c->query("UPDATE users SET email='" . $email . "', phone='" . $phone . "', pin='" . $pin . "', first_name='" . $firstName . "', last_name='" . $lastName . "', profile_picture_url='" . $profilePictureURL . "' WHERE id='" . $userId . "'");
echo 0;