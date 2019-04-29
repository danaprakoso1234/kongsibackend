<?php
session_id("kongsibackend");
session_start();
unset($_SESSION["kongsibackend_user_id"]);
session_destroy();