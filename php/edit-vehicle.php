<?php
include 'db.php';
$vehicleID = intval($_POST["id"]);
$name = $_POST["name"];
$price = doubleval($_POST["price"]);
$c->query("UPDATE vehicles SET name='" . $name . "', price_per_km=" . $price . " WHERE id=" . $vehicleID);