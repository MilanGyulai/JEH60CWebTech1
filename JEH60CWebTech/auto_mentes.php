<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $jsonInput = file_get_contents('php://input');
    $ujAutoAdat = json_decode($jsonInput, true);

    $fajlUt = './json/autok.json';

    if (file_exists($fajlUt)) {
        $jelenlegiJson = file_get_contents($fajlUt);
        $adatok = json_decode($jelenlegiJson, true);
    } else {
        $adatok = ["autok" => [], "utolso_frissites" => ""];
    }

    $ujId = 1;
    if (!empty($adatok['autok'])) {
        $utolsoAuto = end($adatok['autok']);
        $ujId = $utolsoAuto['id'] + 1;
    }
    
    $ujAutoAdat['id'] = $ujId;

    $adatok['autok'][] = $ujAutoAdat;
    $adatok['utolso_frissites'] = date("Y-m-d H:i:s");

    if (file_put_contents($fajlUt, json_encode($adatok, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(["status" => "success", "message" => "Sikeres mentés!", "id" => $ujId]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Nem sikerült írni a fájlt."]);
    }
}
?>