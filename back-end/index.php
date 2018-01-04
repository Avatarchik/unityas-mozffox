<?php
/**
 * index.php
 * Back-end to UnityAS-MozFFox add-on. It gets the generated CSV and gives it back as a downloaded file.
 * Jonas de A Luz Jr. < contact at jonasluz dot com >
 * 
 */

    $user   = $_POST['U3Das_FFox_User'];
    $csv    = $_POST['U3Das_FFox_CSV'];

    header('Content-Type: text/csv; charset=utf-8');
    header("Content-Disposition: attachment; filename=UnityAssetStore-$user.csv");

    file_put_contents('php://output', $csv);
?>