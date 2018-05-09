<?php
/*
 * Plugin Name: Omny Link Forms
 * Plugin URI: http://omny.link/omny-link-forms/
 * Description: Integrates web APIs with your WordPress app.
 * Author: Copyright 2013-18 Tim Stephenson.
 * Version: 1.0.0 alpha9
 * License: GPLv2 or later
 */

  define("P_ID", 'rest-forms');
  define('P_VERSION', '1.0.0-alpha9');
  define("P_NAME", 'Omny Link Forms');
  define("P_TEXT_DOMAIN", 'p-textdomain');

  require_once(dirname(__FILE__)."/includes/options.php");
  if ($GLOBALS['p_options'] == null) $GLOBALS['p_options'] = new FormsOptions();
  p_init_logging();

  require_once(dirname(__FILE__)."/includes/ajax_support.php");
  require_once(dirname(__FILE__)."/includes/contacts_widget.php");
  require_once(dirname(__FILE__)."/includes/events.php");
  require_once(dirname(__FILE__)."/includes/tasks_widget.php");
  require_once(dirname(__FILE__)."/includes/shortcodes.php");
  require_once(dirname(__FILE__)."/includes/tasks_widget.php");
  require_once(dirname(__FILE__)."/includes/forms.php");

  if ( is_admin() ) {
    // admin only actions
  } else {
    // front end only
  }
  add_action( 'wp_enqueue_scripts', 'p_load_scripts' );
  add_action( 'wp_head', 'p_load_styles' );

  function p_footer() {
    if (P_DEBUG) echo 'Running '.P_NAME.' plugin in debug mode!';
    if ($p_options == null) $p_options = new FormsOptions();
    if ($p_options->is_fully_configured()) {
    ?>
      <script type="text/javascript">jQuery(document).ready(function(){
        $p.server='<?php echo $p_options->get_api_url(); ?>';
        $p.tenant='<?php echo $p_options->get_message_namespace(); ?>';
        $p.proxyApi = '<?php echo $p_options->is_proxy_required() ?>'==1 ? true : false;
        $p.proxyPath = '<?php echo $p_options->get_proxy_path() ?>';
        jQuery.ajaxSetup({xhrFields: {withCredentials: true}});
      });</script>
    <?php
    }
  }
  add_action( 'wp_footer', 'p_footer' );

  function p_load_styles() {
    if ( is_admin() ) {
      /* Currently empty */
    } else {
      wp_enqueue_style(
        P_ID.'-frontend',
        plugins_url( P_VERSION.'/css/frontend.css', __FILE__ ),
        array(),
        null /* Force no version as query string */
      );
    }
  }

  function p_load_scripts() {
    if (P_DEBUG) error_log('Loading scripts for '.P_ID.' plugin');
    // used for both admin and front end

    wp_enqueue_script(
      'i18n',
      plugins_url( P_VERSION.'/js/i18n.js', __FILE__ ),
      array(),
      null, /* Force no version as query string */
      true /* Force load in footer */
    );

    if ( is_admin() ) {
      wp_enqueue_script(
        P_ID.'-admin',
        plugins_url( P_VERSION.'/js/admin'.(P_DEBUG ? '' : '.min').'.js', __FILE__ ),
        array( 'jquery', 'jquery-ui-autocomplete' ),
        null, /* Force no version as query string */
        true /* Force load in footer */
      );
    } else {
      wp_enqueue_script(
        P_ID.'-client',
        plugins_url( P_VERSION.'/js/frontend'.(P_DEBUG ? '' : '.min').'.js', __FILE__ ),
        array( 'jquery', 'jquery-ui-autocomplete' ),
        null, /* Force no version as query string */
        true /* Force load in footer */
      );
      wp_enqueue_script(
        'webshim-modernizr',
        '//cdn.jsdelivr.net/webshim/1.12.4/extras/modernizr-custom.js',
        array( 'jquery' ),
        null, /* Force no version as query string */
        false /* Force load in header */
      );
      wp_enqueue_script(
        'webshim',
        '//cdn.jsdelivr.net/webshim/1.12.4/polyfiller.js',
        array( 'jquery' ),
        null, /* Force no version as query string */
        false /* Force load in header */
      );
      wp_enqueue_script(
        'moustache.js',
        plugins_url( P_VERSION.'/js/moustache.js', __FILE__ ),
        array(),
        null, /* Force no version as query string */
        true /* Force load in footer */
      );
      wp_enqueue_script(
        'autoNumeric',
        plugins_url( P_VERSION.'/js/autoNumeric'.(P_DEBUG ? '' : '.min').'.js', __FILE__ ),
        array(),
        null, /* Force no version as query string */
        true /* Force load in footer */
      );
    }
  }

?>
