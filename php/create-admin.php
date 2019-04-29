<?php
include 'db.php';
$email = $_POST["email"];
$password = $_POST["password"];
$adminID = uniqid();
$c->query("INSERT INTO admins (id, email, password) VALUES ('" . $adminID . "', '" . $email . "', '" . $password . "')");
echo $adminID;