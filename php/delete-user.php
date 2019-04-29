<?php
include 'db.php';
$userID = $_POST["user_id"];
$c->query("DELETE FROM users WHERE id='" . $userID . "'");