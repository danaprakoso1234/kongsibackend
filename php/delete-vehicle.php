<?php
include 'db.php';
$vehicleID = intval($_POST["vehicle_id"]);
$c->query("DELETE FROM vehicles WHERE id=" . $vehicleID);