<?php

  /**
   * REST API to register new WordPress users.
   */
  function p_register_async_callback() {
    require_once( plugin_dir_path( __FILE__ ).'options.php' );
    p_init_logging();

    if (P_DEBUG) error_log('Call to p_register_async_callback');
    $user_id = get_current_user_id();
  	$user_name = $_POST['log'];
    $user_pass = $_POST['pwd'];
    if ($user_id == 0) {
      $user_id = username_exists( $user_name );
      if ( !$user_id and email_exists($user_name) == false ) {
        if ($user_pass == null) {
	         $user_pass = wp_generate_password( $length=12, $include_standard_special_chars=false );
	      }
        $user_id = wp_create_user( $user_name, $user_pass, $user_name );
        if (P_DEBUG) error_log('Created user id '.$user_id.' with username: '.$user_name);

        // Now store any user info we have received
        foreach($_POST as $key=>$value) {
          if ($key != 'log' && $key != 'action') {
            if(P_DEBUG) error_log( "Storing user field: $key=$value" );
            update_user_meta( $user_id, $key, $value );
          }
        }

        $xmlResponse = new WP_Ajax_Response(array(
           'what'=>'Registration',
           'action'=>'p_register_async',
           'id'=>1,
           'data'=>'Created user id '.$user_id.' with username: '.$user_name));
        $xmlResponse->send();
      } else {
        if (P_DEBUG) error_log('Either username '.$user_name.' or email '.$user_name.' already exists');
        $xmlResponse = new WP_Ajax_Response(array(
           'what'=>'Registration',
           'action'=>'p_register_async',
           'id'=>new WP_Error('already_registered',$user_name." already registered")));
        $xmlResponse->send();
      }
    } else {
      if (P_DEBUG) error_log('Attempt to register '.$user_name.' when already logged in with id: '.$user_id);
      $xmlResponse = new WP_Ajax_Response(array(
         'what'=>'Registration',
         'action'=>'p_register_async',
         'id'=>new WP_Error('already_logged_in',"You're already logged in with user id: ".$user_id.", cannot register as: ".$user_name)));
      $xmlResponse->send();
    }
  	die(); // this is required to return a proper result
  }
  if (P_DEBUG) error_log('Adding register ajax action');
  add_action( 'wp_ajax_p_register_async', 'p_register_async_callback' );
  add_action( 'wp_ajax_nopriv_p_register_async', 'p_register_async_callback' );

  function p_send_mail_callback() {
    require_once( plugin_dir_path( __FILE__ ).'options.php' );
    p_init_logging();

    if (P_DEBUG) error_log('Call to p_send_mail_callback');

    $options = get_option( P_ID.'_options' );
    $to = $options['mail_addressee'];
    if (empty($to)) {
      if (P_DEBUG) error_log('Skip mail because no addressees set');
    } else {
      if (P_DEBUG) error_log('Sending mail to: '.$to);
      $subject = 'Trial request';
      $json = urldecode($_POST['json']);
      if (P_DEBUG) error_log('JSON received'.$json);
      $a = json_decode($json, true);
      //if (P_DEBUG) error_log('parsed: '.$a);
      $message = '<div align="center"><table style="width:6.25in" border="0" cellpadding="0" cellspacing="0" width="600"><tbody>';
      $message .= '<tr><td colspan="3" style="border:none;border-bottom:solid #d4d4d4 1.0pt;padding:7.5pt 7.5pt 7.5pt 7.5pt"><p  style="text-align:center" align="center"><strong><i><span style="font-size:15.0pt;font-family:&quot;Arial&quot;,&quot;sans-serif&quot;;color:#4696d1">'.$a['pn'].'Trial Request</span></i></strong><i><span style="font-size:15.0pt;font-family:&quot;Arial&quot;,&quot;sans-serif&quot;;color:#4696d1"><u></u><u></u></span></i></p></td></tr><tr style="height:3.75pt"><td colspan="3" style="background:#e2ecf1;padding:7.5pt 7.5pt 7.5pt 7.5pt;height:3.75pt"></td></tr>';
      foreach ($a as $key => $value) {
        $message .= '<tr><td style="border-top:none;border-left:none;border-bottom:solid #d4d4d4 1.0pt;border-right:solid #d4d4d4 1.0pt;padding:7.5pt 7.5pt 7.5pt 7.5pt"><div ><strong><span style="font-size:9pt;font-family:Arial,sans-serif">'.$key.':</span></strong><span style="font-size:9pt;font-family:Arial,sans-serif"></span></div></td><td style="border:none;border-bottom:solid #d4d4d4 1.0pt;padding:7.5pt 7.5pt 7.5pt 7.5pt"><div><span style="font-size:9pt;font-family:Arial,sans-serif">'.$value.'</span></div></td><td style="padding:7.5pt 7.5pt 7.5pt 7.5pt"></td></tr><tr><td style="border-top:none;border-left:none;border-bottom:solid #d4d4d4 1.0pt;border-right:solid #d4d4d4 1.0pt;padding:7.5pt 7.5pt 7.5pt 7.5pt">';
      }
      $message .= '</tbody></table></div>';
      //if (P_DEBUG) error_log('Constructed message'.$message);
      $headers = array('Content-Type: text/html; charset=UTF-8');
      wp_mail( $to, $subject, $message, $headers );
  	}
    die(); // this is required to return a proper result
  }
  if (P_DEBUG) error_log('Adding send mail ajax action');
  add_action( 'wp_ajax_p_send_mail', 'p_send_mail_callback' );
  add_action( 'wp_ajax_nopriv_p_send_mail', 'p_send_mail_callback' );

  function p_proxy_callback() {
    require_once( plugin_dir_path( __FILE__ ).'options.php' );
    p_init_logging();

    if (P_DEBUG) error_log('Call to p_proxy_callback');

    if ($_SERVER['REQUEST_METHOD']=='GET') {
      $msg = $_REQUEST['query'];
      $msg_field = 'query';
    } else {
      $msg = $_REQUEST['json'];
      $msg_field = 'json';
    }
    $msg = str_replace('\\','',$msg);

    $headers[] = '';

    if ($p_options == null) $p_options = new FormsOptions();
    $msg_namespace = $p_options->get_message_namespace();
    // NOTE this will be already prefixed with tenant id / msg ns by shortcode
    $msg_name = $_REQUEST['msg_name'];
    if ($_REQUEST['executionId'] == null && !endsWith($msg_name,'.json')) {
      $msg_name = $msg_name.'.json';
    }

    if ($_REQUEST['executionId']==null) {
      // Url for starting a new process
      $url = $p_options->get_api_url().'msg/'.$p_options->get_message_namespace().'/'.$msg_name;
    } else {
      // Url to update an existing process
      $url = $p_options->get_api_url().$p_options->get_message_namespace().'/messages/'.$msg_name.'/'.$_REQUEST['executionId'];
    }
    $origin = home_url();
    if (P_DEBUG || P_INFO) {
      error_log('Notifying server: ');
      error_log('  Verb: '.$_SERVER['REQUEST_METHOD']);
      error_log('  URL: '.$url);
      error_log('  Origin: '.$origin);
      error_log('  Message name: '.$msg_name);
      error_log('  JSON: '.$msg);
      error_log('  Execution id: '.$_REQUEST['executionId']);
    }
    //$response = http_post_fields(P_API_URL.$msg_name, array('timeout'=>1), $fields);

    if ($_SERVER['REQUEST_METHOD']=='GET') {
      // IMPLIED curl_setopt($curl_handle, CURLOPT_HTTPGET, TRUE);
      $url = $url.'?'.$msg_field.'='.urlencode($msg);
      if (P_DEBUG) error_log('  query string:'.$url);
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array( 'Origin: '.$origin ));
    } else if ($_REQUEST['executionId'] != null) {
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $msg);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Origin: '.$origin,
        'Content-Type: application/json'
      ));
    } else {
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_POST, true);
      $fields = array(
        $msg_field => $msg,
        'businessDescription' => $_REQUEST['businessDescription']
      );
      curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array( 'Origin: '.$origin ));
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, $p_options->get_api_key().":".$p_options->get_api_secret());
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); 

    $response = curl_exec($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (P_INFO || $http_status >=300) error_log('Response from '.$url.': '.$http_status);
    curl_close($ch);
    echo $response;

    die(); // this is required to return a proper result

    // If we had a callback do that too

  }
  if (P_DEBUG) error_log('Adding proxy ajax action');
  add_action( 'wp_ajax_p_proxy', 'p_proxy_callback' );
  add_action( 'wp_ajax_nopriv_p_proxy', 'p_proxy_callback' );

  function p_domain_callback() {
    require_once( plugin_dir_path( __FILE__ ).'options.php' );
    p_init_logging();

    if (P_DEBUG) error_log('Call to p_domain_callback');
    p_internal_proxy_callback('/domain-model/');
  } 
  if (P_DEBUG) error_log('Adding domain ajax action');
  add_action( 'wp_ajax_p_domain', 'p_domain_callback' );
  add_action( 'wp_ajax_nopriv_p_domain', 'p_domain_callback' );

  function p_resource_callback() {
    require_once( plugin_dir_path( __FILE__ ).'options.php' );
    p_init_logging();

    if (P_DEBUG) error_log('Call to p_resource_callback');
    p_internal_proxy_callback($_REQUEST['resource']);
  } 
  if (P_DEBUG) error_log('Adding resource ajax action');
  add_action( 'wp_ajax_p_resource', 'p_resource_callback' );
  add_action( 'wp_ajax_nopriv_p_resource', 'p_resource_callback' );

  function p_internal_proxy_callback( $resource ) {
    require_once( plugin_dir_path( __FILE__ ).'options.php' );
    p_init_logging();

    if (P_DEBUG) error_log('Call to p_domain_callback');

    if ($p_options == null) $p_options = new FormsOptions();
    $url = $p_options->get_api_url().$p_options->get_message_namespace().$resource;
    $token = p_get_jwt_token($p_options);
    if (P_DEBUG) {
      error_log('Fetch resource: ');
      error_log('  URL: '.$url);
      error_log('  token: '.$token);
    }

    $response = wp_remote_get( $url, array(
	'method' => 'GET',
	'timeout' => 45,
	'redirection' => 5,
	'httpversion' => '1.0',
	'blocking' => true,
	'headers' => array( 
           'Cache-Control' => 'no-cache',
           'Content-Type' => 'application/json',
           'Origin' => home_url(),
           'X-Requested-With' => 'XMLHttpRequest',
           'X-Authorization' => 'Bearer '.$token
        )
    ));
    if ( is_wp_error( $response ) ) {
      $error_message = $response->get_error_message();
      error_log("Unable to GET: ".$error_message);
    } else if ($response['response']['code']>=300) {
      error_log("Unable to GET: ".$response['body']);
    } else {
      error_log("GET successful: ".$response['response']['code']);
    }

    echo $response['body'];

    die(); // this is required to return a proper result
  }

  function p_get_jwt_token($p_options) {
    $url = $p_options->get_api_url().'auth/login';
    if (P_DEBUG) {
      error_log('Attempt to login: '.$url);
    }
    $response = wp_remote_post( $url, array(
	'method' => 'POST',
	'timeout' => 45,
	'redirection' => 5,
	'httpversion' => '1.0',
	'blocking' => true,
	'headers' => array(
          'Cache-Control' => 'no-cache',
          'Content-Type' => 'application/json',
          'X-Requested-With' => 'XMLHttpRequest',
          'Origin' => home_url()
        ),
	'body' => '{ "username": "'.$p_options->get_api_key().'",'
           .'"password": "'.$p_options->get_api_secret().'" }',
	'cookies' => array()
      )
    );
    if ( is_wp_error( $response ) ) {
      $error_message = $response->get_error_message();
      error_log("Unable to login: ".$error_message);
    } else if ($response['response']['code']>=300) {
      error_log("Unable to login: ".$response['body']);
    } else {
      error_log("login successful: ".$response['response']['code']);
      if (P_DEBUG) error_log( $response['body'] );
      return json_decode( $response['body'], true )['token'];
    }
  }

  function startsWith($haystack, $needle) {
      // search backwards starting from haystack length characters from the end
      return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
  }
  function endsWith($haystack, $needle) {
      // search forward starting from end minus needle length characters
      return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
  }
?>
