<?php
include 'db.php';
$name = $_POST["name"];
$price = doubleval($_POST["price"]);
$c->query("INSERT INTO vehicles (name, price_per_km) VALUES ('" . $name . "', " . $price . ")");