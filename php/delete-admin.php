<?php
include 'db.php';
$adminId = $_POST["admin_id"];
$c->query("DELETE FROM admins WHERE id='" . $adminId . "'");