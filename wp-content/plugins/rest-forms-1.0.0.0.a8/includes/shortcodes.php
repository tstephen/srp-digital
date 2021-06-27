<?php

  // shortcode [p_form id="id of form post" title="Form label"]
  function p_form_shortcode( $atts, $content = null ) {
    $a = shortcode_atts( array(
      'business_description' => null,
      'button_text' => 'Submit',
      'callback' => null,
      'id' => '',
      'msg_display' => 'both',
      'msg_name' => '',
      'msg_pattern' => 'none',
      'proxy' => 'false',
      'redirect_to' => '',
      'title' => '',
    ), $atts );
    $options = new FormsOptions();
    if ($options->is_proxy_required()) $a['proxy'] = 'true';
    ob_start();

    $form = get_post($a['id']);
    if ($a['msg_name']=='') $a['msg_name'] = $form->post_name;

    $form_content = $form->post_content;
    $form_content = apply_filters('the_content', $form_content);
    $form_content = str_replace(']]>', ']]&gt;', $form_content);

    $temp_content .= '<script>';
    $temp_content .= '  webshims.setOptions("waitReady", false);';
    // No UK locale, but AU sets date format just fine!
    $temp_content .= '  webshims.activeLang("en-AU");';
    $temp_content .= '  webshims.setOptions("forms-ext", { types: "date", "widgets": { "openOnFocus": true, "startView": 0 } });';
    $temp_content .= '  webshims.polyfill("forms forms-ext");';
    $temp_content .= '</script>';

    $temp_content .= '<form class="p-form" id="'.$form->post_name.'-form">';
    if ($a['msg_display']=='both' || $a['msg_display'=='top']) {
      $temp_content .= '<div class="p-messages"></div>';
    }

    $temp_content .= $form_content;

    $temp_content .= '<script type="text/javascript">';
    $temp_content .= 'var $params = {';
    foreach ($_REQUEST as $k => $v) {
      $temp_content .= $k.':"'.$v.'",';
    }
    if (!empty( $content )) {
      $form_consts = explode(',', $content);
      foreach($form_consts as $c) {
        $arr = explode('=',$c);
        //$temp_content .= ('<input id="'.$arr[0].'" value="'.$arr[1].'" type="hidden"/>');
        if (!empty($arr[0])) $temp_content .= $arr[0].':"'.$arr[1].'",';
      }
    }
    $temp_content .= 'ip:"'.$_SERVER["REMOTE_ADDR"].'",';
    $temp_content .= 'admin_email:"'.get_option( 'admin_email' ).'"};</script>';

    if (empty($a['redirect_to'])) { 
      if (P_DEBUG) error_log('no redirect');
      $a['redirect_to'] = 'undefined';
    } else { 
      if (P_DEBUG) error_log('with redirect');
      $a['redirect_to'] = '\''.$a['redirect_to'].'\'';
    }
    if ($a['msg_display']=='both' || $a['msg_display'=='bottom']) {
      $temp_content .= '<div class="p-messages"></div>';
    }
    if (substr_count($a['msg_name'], '.') < 2) {
      $a['msg_name'] = $options->get_message_namespace().'.'.$a['msg_name'];
    }
    $temp_content .= '<button class="btn" data-p-action="$p.sendMessageIfValid(\''.$form->post_name.'-form\',\''.$a['msg_pattern'].'\', \''.$a['msg_name'].'\', $p.'.str_replace('-','_',$form->post_name).'_form,'.$a['redirect_to'].',\''.$a['callback'].'\','.$a['proxy'].',\''.$a['business_description'].'\');" id="btn-'.$form->post_name.'" form="'.$form->post_name.'" type="button">'.$a['button_text'].'</button>';
    $temp_content .= '</form>';

    ob_end_clean();
    return $temp_content;
  }
  add_shortcode( 'p_form', 'p_form_shortcode' );

?>
