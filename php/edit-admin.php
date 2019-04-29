<?php
include 'db.php';
$adminId = $_POST["id"];
$email = $_POST["email"];
$password = $_POST["password"];
$c->query("UPDATE admins SET email='" . $email . "', password='" . $password . "' WHERE id='" . $adminId . "'");
echo 0;