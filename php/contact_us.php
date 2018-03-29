<?php
header("Access-Control-Allow-Origin: *");

$myemail = 'fiveyventures@gmail.com';//<-----Put Your email address here.

$data=json_decode(file_get_contents('php://input'),true);
$name=$data['name']['$modelValue'];
$email=$data['email']['$modelValue'];
$phone=$data['phone']['$modelValue'];
$message=$data['message']['$modelValue'];


$to = $myemail;
$email_subject = "Contact form submission: $name";
$email_body = "You have received a new message. ".
" Here are the details:
\nName: $name ".
"\nPhone: $phone".
"\nEmail: $email".
"\nMessage: $message\n";
$headers = "From: $myemail\n";
$headers .= "Reply-To: $email";
mail($to,$email_subject,$email_body,$headers);

?>