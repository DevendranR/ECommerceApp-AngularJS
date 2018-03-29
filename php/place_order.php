<?php
header("Access-Control-Allow-Origin: *");

$to = 'fiveyventures@gmail.com';
$subject = 'You have received an order';

$data1=json_decode(file_get_contents('php://input'),true);


$name = $data1['cust']['name'];
$phone = $data1['cust']['email'];
$email = $data1['cust']['phone'];

$from = $email;

// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
 
// Create email headers
$headers .= 'From: '.$from."\r\n".
    'Reply-To: '.$email."\r\n" .
    'X-Mailer: PHP/' . phpversion();
 
// Compose a simple HTML email message
$message = '<html><body>';
$message .= '<h4">Hi FiveYventures!</h4>';
$message .= '<h5>Your have received an order</h5>';
$message .= '<p>Name:'.$name.'<br>Email:'.$email.'<br>Phone:'.$phone.'</p>';
$message .= '<table class="table" style="border:1px"><thead style="font-size:14px;background-color:grey;color:white"><tr><td>Product Id</td><td>Product Name</td><td>Product Type</td><td>Quantity</td><td>Quantity Type</td><td>Category</td></tr></thead><tbody style="font-size:12px;">';
for ($i = 0; $i < count($data1['cart']); $i++) {
$message .='<tr><td>'.$data1['cart'][$i]['Id'].'</td><td>'.$data1['cart'][$i]['Name'].'</td><td>'.$data1['cart'][$i]['Type'].'</td><td>'.$data1['cart'][$i]['Quantity'].'</td><td>'.$data1['cart'][$i]['QuantityType'].'</td><td>'.$data1['cart'][$i]['Diameter'].'</td></tr>';
}
$message .=	'</tbody></table>';			
$message .= '</body></html>';
$message .= '<h5>Regards</h5><br><h5>'.$name.'</h5>';

// Sending email
mail($to, $subject, $message, $headers)
?>