<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Controllo se la richiesta è una POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents('php://input'); // Prendo il corpo della richiesta POST
    $decoded_data = json_decode($json_data, true); // Decodifico il JSON
    header('Content-Type: application/json'); // Setto la risposta in JSON

    // Errore durante la decodifica del JSON
    if ($decoded_data === null || json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400); // Codice HTTP di errore
        echo json_encode(array(
            'code' => '01',
            'message' => 'Error while parsing the request.'
        ));
        exit;
    }
    
    // Prendo la lingua
    $lang = $decoded_data['lang'] ?? "en";
    $allowed_languages = ['en', 'it', 'es', 'de', 'fr']; // Elenco delle lingue consentite
    if (!in_array($lang, $allowed_languages)) {
        $lang = 'en'; // Imposta un valore predefinito se la lingua non è nell'elenco
    }

    // Carico le traduzioni della lingua richiesta
    $translations = @include("lang/$lang.php");
    if (!$translations) {
        http_response_code(500); // Codice HTTP di errore
        echo json_encode(array(
            'code' => '09',
            'message' => "A generic error occurred."
        ));
        exit;
    }

    // Controllo che i dati ricevuti siano presenti e nel formato giusto
    $partecipanti = $decoded_data['partecipanti']; // Mi salvo la lista
    if (!isset($partecipanti) || !is_array($partecipanti)) {
        http_response_code(400); // Codice HTTP di errore
        echo json_encode(array(
            'code' => '02',
            'message' => $translations['message.required.fields']
        ));
        exit;
    }
    
    // Valido i campi email e nome dei partecipanti
    foreach ($partecipanti as $partecipante) {
        $email = filter_var($partecipante['email'], FILTER_VALIDATE_EMAIL);
        $nome = $partecipante['nome'];
        if ($email === false || $nome === false) {
            http_response_code(422); // Codice HTTP di errore
            echo json_encode(array(
                'code' => '03',
                'message' => $translations['message.data.not.valid.1'] . ' ' . $partecipante['nome'] . ' ' . $translations['message.data.not.valid.2']
            ));
            exit;
        }
    }

    // Estraggo le coppie
    $coppie = assegnaRegali($partecipanti);
    if(!$coppie) { // Impossibile trovare tutte le coppie
        http_response_code(409); // Codice HTTP di errore
        echo json_encode(array(
            'code' => '04',
            'message' => $translations['message.extraction.not.possible']
        ));
        exit;
    }

    // Mando le email
    $messaggi = inviaEmail($coppie, $translations);
    $errore = array_filter($messaggi, function ($msg) { // Verifico la presenza di errori con codice '07'
        return $msg['code'] === '07';
    });

    // Se c'è un errore con codice '07'
    if (!empty($errore)) {
        http_response_code(503); // Codice HTTP di errore
        echo json_encode(array( // Errore durante l'invio delle email
            'code' => '05',
            'message' => $translations['message.error.sending.email'],
            'listaMessaggi' => $messaggi
        ));
        exit;
    }

    // Messaggio successo
    http_response_code(200); // Codice HTTP di successo
    echo json_encode(array(
        'code' => '00',
        'message' => $translations['message.extraction.success'],
        'listaMessaggi' => $messaggi
    ));
}

/* ----------------------- Estrazione delle coppie ----------------------- */

// Estraggo persona
function scegliCasuale($lista) {
    $indiceCasuale = random_int(0, count($lista) - 1);
    return $lista[$indiceCasuale];
}

// Prendo un destinatario valido
function scegliDestinatarioValido($persona, $lista, $regaliFatti) {
    $destinatariValidi = array_filter($lista, function($p) use ($persona, $regaliFatti) {
        return !in_array($p['id'], $persona['esclusi']) &&
               !in_array($p['id'], $regaliFatti) &&
               $p['id'] !== $persona['id'] &&
               ($p['destinatario'] === null || $p['destinatario'] !== $persona['id']);
    });

    if (count($destinatariValidi) === 0) return null;
    return scegliCasuale(array_values($destinatariValidi));
}

// Eseguo l'estrazione
function assegnaRegali($persone) {
    $regaliFatti = [];
    $success = false;
    $count = 0;
    $maxTentativi = 100000; // 100 mila tentativi massimi
    usort($persone, function($a, $b) { // Ordino la lista di partecipanti in base al numero di esclusi
        return count($b['esclusi']) - count($a['esclusi']);
    });

    // Ciclo finché non ho estratto tutti i regali
    while (!$success) {
        $regaliFatti = [];
        foreach ($persone as &$persona) {
            $persona['destinatario'] = null;
        }
        unset($persona);
        $count++;

        // Estraggo i regali
        for ($i = 0; $i < count($persone); $i++) {
            $persona = $persone[$i];
            $destinatario = scegliDestinatarioValido($persona, $persone, $regaliFatti);
            if ($destinatario) {
                $regaliFatti[] = $destinatario['id'];
                $persone[$i]['destinatario'] = $destinatario['id'];
            } else {
                break;
            }
        }

        $success = count($regaliFatti) === count($persone);
        if ($count > $maxTentativi) return false;
    }

    return $persone;
}

/* ----------------------- Manda email ----------------------- */

// Mando le mail
function inviaEmail($partecipanti, $translations) {
    $mail = new PHPMailer(true);
    $listaMessaggi = array(); // Lista di messaggi di errore o successo
    $emailTemplate = getEmailTemplate($translations); // Carico la mail HTML
    foreach ($partecipanti as $partecipante) { // Ciclo i partecipanti
        $email = $partecipante['email'];
        $nome = $partecipante['nome'];
        $nomeDestinatario = getNameById($partecipante['destinatario'], $partecipanti); // Prendo il nome partendo dall'ID

        // Sostituisco i segnaposto nell'email
        $emailContent = str_replace('{nome}', $nome, $emailTemplate);
        $emailContent = str_replace('{nomeDestinatario}', $nomeDestinatario, $emailContent);

        try {
            // Configurazione del mailer per ogni destinatario
            $mail->isHTML(true); // Marco come HTML
            $mail->setFrom('brumaombra@altervista.org', 'Secret Santa');
            $mail->clearAddresses();
            $mail->addAddress($email, htmlspecialchars($nome));
            $mail->Subject = $translations['email.subject'];
            $mail->Body = $emailContent;

            // Mando la mail
            if ($mail->send()) { // Successo
                $listaMessaggi[] = array(
                    'code' => '00',
                    'message' => $translations['message.email.success.1'] . ' ' . $email . ' ' . $translations['message.email.success.2']
                );
            } else { // Errore
                $listaMessaggi[] = array(
                    'code' => '06',
                    'message' => $translations['message.email.error'] . ' ' . $email
                );
            }
        } catch (Exception $e) {
            $listaMessaggi[] = array(
                'code' => '07',
                'message' => $translations['message.email.error'] . ' ' . $email
            );
        }
    }
    return $listaMessaggi;
}

// Prendo il nome del partecipante dal suo ID
function getNameById($id, $lista) {
    foreach ($lista as $persona) {
        if ($persona['id'] === $id) {
            return $persona['nome'];
        }
    }
    return null;
}

// Prendo il template della mail
function getEmailTemplate($translations) {
    $emailTemplate = file_get_contents('./email/email_template.html');
    if ($emailTemplate === false) { // Errore durante la lettura del file
        http_response_code(500); // Codice HTTP di errore
        echo json_encode(array(
            'code' => '08',
            'message' => $translations['message.read.email.template.error']
        ));
        exit;
    }

    // Sostituisco i segnaposto nell'email
    $emailTemplate = str_replace('{email.hi}', $translations['email.hi'], $emailTemplate);
    $emailTemplate = str_replace('{email.text.1}', $translations['email.text.1'], $emailTemplate);
    $emailTemplate = str_replace('{email.text.2}', $translations['email.text.2'], $emailTemplate);
    $emailTemplate = str_replace('{email.text.3}', $translations['email.text.3'], $emailTemplate);
    $emailTemplate = str_replace('{email.text.4}', $translations['email.text.4'], $emailTemplate);
    $emailTemplate = str_replace('{email.footer.text}', $translations['email.footer.text'], $emailTemplate);
    return $emailTemplate;
}

?>