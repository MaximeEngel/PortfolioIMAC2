<?php

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $nomprenom = strip_tags(trim($_POST["nomprenom"]));
		$nomprenom = str_replace(array("\r","\n"),array(" "," "),$nomprenom);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);

        // Check that data was sent to the mailer.
        if ( empty($nomprenom) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            // http_response_code(400);
            echo "Oops! Merci de remplir correctement tous les champs du formulaire et de le renvoyer.";
            exit;
        }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "maximeengel@gmail.com";

        // Set the email subject.
        $subject = "Portfolio: Message de $nomprenom";

        // Build the email content.
        $email_content = "Name: $nomprenom\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
        $email_headers = "From: $nomprenom <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            // http_response_code(200);
            echo "Je vous remervie pour votre message !";
        } else {
            // Set a 500 (internal server error) response code.
            // http_response_code(500);
            echo "Oops! Un problème est survenu, merci d'envoyer un message à <a data-hover='maximeengel@gmail.com' href='mailto:maximeengel@gmail.com' class='btn-noirBlanc'>maximeengel@gmail.com</a>.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        // http_response_code(403);
        echo "Un problème est survenu, merci de réessayer.";
    }

?>