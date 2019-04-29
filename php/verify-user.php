<?php
include 'db.php';
$userID = $_POST["user_id"];
$c->query("UPDATE users SET confirmed=1 WHERE id='" . $userID . "'");