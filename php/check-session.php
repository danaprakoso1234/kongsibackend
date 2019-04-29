<?php
session_id("kongsibe");
session_start();
if (!isset($_SESSION["user_id"]) || $_SESSION["user_id"] == '') {
    echo -1;
} else {
    echo 0;
}