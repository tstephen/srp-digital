<?php

define('P_API_URL', 'https://api.omny.link');
class FormsOptions {

    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;

    /**
     * Start up
     */
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'p_add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'p_page_init' ) );

        // Set class property
        $this->options = get_option( P_ID.'_options' );
    }

    public function is_logging_level_debug() {
      return isset( $this->options['log_level'] ) && ($this->options['log_level'] == 'debug');
    }

    public function is_logging_level_info() {
      return isset( $this->options['log_level'] ) && ($this->options['log_level'] == 'info' || $this->options['log_level'] == 'debug');
    }
    
    public function is_logging_level_warning() {
      return isset( $this->options['log_level'] ) && ($this->options['log_level'] == 'warning' || $this->options['log_level'] == 'info' || $this->options['log_level'] == 'debug');
    }
    
    public function is_logging_level_error() {
      return isset( $this->options['log_level'] ) && ($this->options['log_level'] == 'error' || $this->options['log_level'] == 'warning' || $this->options['log_level'] == 'info' || $this->options['log_level'] == 'debug');
    }
    
    public function is_fully_configured() {
      if (!empty($this->options['api_url'])
              && !empty($this->options['message_namespace'])
              && !empty($this->options['api_key'])
              && !empty($this->options['api_secret'])) {
          return True;
      } else {
          if (P_DEBUG) error_log(P_NAME.' not fully configured, please visit settings');
          return False;
      }
    }

    public function is_proxy_required() {
      if (!empty($this->options['api_key'])
              && !empty($this->options['api_secret'])) {
          return True;
      } else {
          return False;
      }
    }

    public function get_mail_addressee() {
      return $this->options['mail_addressee'];
    }

    public function get_proxy_path() {
      if (empty($this->options['proxy_path']))
        return '/wp-admin/admin-ajax.php';
      else
        return $this->options['proxy_path'];
    }

    public function get_message_namespace() {
      return $this->options['message_namespace'];
    }

    public function get_api_url() {
      if (isset( $this->options['api_url'] )) {
        return ends_with($this->options['api_url'], '/') ? $this->options['api_url'] : $this->options['api_url'].'/';
      } else {
        return P_API_URL;
      }
    }

    public function get_api_key() {
      return isset( $this->options['api_key'] ) ? $this->options['api_key'] : '';
    }

    public function get_api_secret() {
      return isset( $this->options['api_secret'] ) ? $this->options['api_secret'] : '';
    }
    /**
     * Add options page
     */
    public function p_add_plugin_page() {
        // This page will be under "Settings"
        add_options_page(
            P_NAME.' Settings Admin',
            P_NAME,
            'manage_options',
            'p_settings_admin',
            array( $this, 'p_create_admin_page' )
        );
    }


    /**
     * Options page callback
     */
    public function p_create_admin_page() {
        ?>
        <div class="wrap">
            <?php screen_icon(); ?>
            <h2><?php echo P_NAME; ?> Settings</h2>
            <form method="post" action="options.php">
            <?php
                // This prints out all hidden setting fields
                settings_fields( P_ID.'_option_group' );
                do_settings_sections( 'p_settings_admin' );
                submit_button();
            ?>
            </form>
        </div>
        <?php
    }

    /**
     * Register and add settings
     */
    public function p_page_init() {
        register_setting(
            P_ID.'_option_group', // Option group
            P_ID.'_options', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        add_settings_section(
            'p_setting_section_general', // ID
            'General Settings', // Title
            array( $this, 'p_print_general_section_info' ), // Callback
            'p_settings_admin' // Page
        );

        add_settings_field(
            'log_level', // ID
            'Enable logging level', // Label
            array( $this, 'p_log_level_callback' ), // Callback
            'p_settings_admin', // Page
            'p_setting_section_general' // Section
        );

        add_settings_field(
            'proxy_path', // ID
            'AJAX proxy path', // Label
            array( $this, 'p_proxy_path_callback' ), // Callback
            'p_settings_admin', // Page
            'p_setting_section_general' // Section
        );

        add_settings_section(
            'p_setting_section_standalone', // ID
            'Standalone Settings', // Title
            array( $this, 'p_print_standalone_section_info' ), // Callback
            'p_settings_admin' // Page
        );

        add_settings_field(
            'mail_addressee', // ID
            'Mail Addressee', // Label
            array( $this, 'p_mail_addressee_callback' ), // Callback
            'p_settings_admin',
            'p_setting_section_standalone'
        );

        add_settings_section(
            'p_setting_section_server', // ID
            'Server Settings', // Title
            array( $this, 'p_print_server_section_info' ), // Callback
            'p_settings_admin' // Page
        );

        add_settings_field(
            'api_url', // ID
            'API Server URL', // Label
            array( $this, 'p_api_url_callback' ), // Callback
            'p_settings_admin',
            'p_setting_section_server'
        );

        add_settings_field(
            'api_key', // ID
            'API Key', // Label
            array( $this, 'p_api_key_callback' ), // Callback
            'p_settings_admin',
            'p_setting_section_server'
        );

        add_settings_field(
            'api_secret', // ID
            'API Secret', // Label
            array( $this, 'p_api_secret_callback' ), // Callback
            'p_settings_admin',
            'p_setting_section_server'
        );

        add_settings_field(
            'message_namespace', // ID
            'Tenant Id', // Label
            array( $this, 'p_message_namespace_callback' ), // Callback
            'p_settings_admin', // Page
            'p_setting_section_server' // Section
        );

        add_settings_section(
            'p_setting_section_events', // ID
            'Event Settings', // Label
            array( $this, 'p_print_event_section_info' ), // Callback
            'p_settings_admin' // Page
        );

        add_settings_field(
            'post_published', // ID
            'When a post is published', // Label
            array( $this, 'p_post_published_callback' ), // Callback
            'p_settings_admin', // Page
            'p_setting_section_events' // Section
        );
    }

    /**
     * Sanitize each setting field as needed
     *
     * @param array $input Contains all settings fields as array keys
     */
    public function sanitize( $input ) {
        $new_input = array();
        if( isset( $input['api_url'] ) )
            $new_input['api_url'] = sanitize_text_field( $input['api_url'] );
        if( isset( $input['api_key'] ) )
            $new_input['api_key'] = sanitize_text_field( $input['api_key'] );
        if( isset( $input['api_secret'] ) )
            $new_input['api_secret'] = sanitize_text_field( $input['api_secret'] );

        if( isset( $input['mail_addressee'] ) )
            $new_input['mail_addressee'] = sanitize_text_field( $input['mail_addressee'] );

        if( isset( $input['debug'] ) )
            $new_input['debug'] = true ;

        if( isset( $input['log_level'] ) ) {
            error_log('Setting new logging level to: '.$input['log_level']);
            $new_input['log_level'] = $input['log_level'] ;
        }

        if( isset( $input['proxy_path'] ) )
            $new_input['proxy_path'] = sanitize_text_field( $input['proxy_path'] );
        else
            $new_input['proxy_path'] = '/wp-admin/admin-ajax.php';

        if( isset( $input['message_namespace'] ) )
            $new_input['message_namespace'] = sanitize_text_field( $input['message_namespace'] );

        if( isset( $input['post_published'] ) )
            $new_input['post_published'] = true ;

        return $new_input;
    }

    /**
     * Print the leader text for the general section.
     */
    public function p_print_general_section_info() {
        print '<p>The plugin can work in <b>stand-alone</b> mode or in <b>enhanced</b> server mode. To enable enhanced mode you need to register to use the API at <a href="http://omny.link" target="_blank">Omny.Link</a>.</p>';
    }

    /**
     * Output input for 'proxy_path' option.
     */
    public function p_proxy_path_callback() {
        printf(
            '<input id="proxy_path" name="'.P_ID.'_options[proxy_path]" placeholder="/wp-admin/admin-ajax.php" %s type="text"/>',
            isset( $this->options['proxy_path'] ) == True ? 'value="'.$this->options['proxy_path'].'"' : ''
        );
    }

    /**
     * Output drop down for logging level.
     */
    public function p_log_level_callback() {
        printf(
            '<select id="log_level" name="'.P_ID.'_options[log_level]"><option value="debug" %s>Debug</option><option value="info" %s>Info</option><option value="warning" %s>Warning</option><option value="error" %s>Error</option></select>',
            isset( $this->options['log_level'] ) && $this->options['log_level'] == 'debug' ? 'selected' : '',
            isset( $this->options['log_level'] ) && $this->options['log_level'] == 'info' ? 'selected' : '',
            isset( $this->options['log_level'] ) && $this->options['log_level'] == 'warning' ? 'selected' : '',
            isset( $this->options['log_level'] ) && $this->options['log_level'] == 'error' ? 'selected' : ''                                    
        );
    }
    
    /**
     * Print the leader text for the standalone section.
     */
    public function p_print_standalone_section_info() {
        print '<p>In stand-alone mode form contents are simply emailed to the specified addressee.</p>';
    }

    /**
     * Output textbox for 'mail_addressee' option.
     */
    public function p_mail_addressee_callback() {
        printf(
            '<input type="text" id="mail_addressee" name="'.P_ID.'_options[mail_addressee]" value="%s" />',
            isset( $this->options['mail_addressee'] ) ? esc_attr( $this->options['mail_addressee']) : ''
        );
    }

    /**
     * Print the leader text for the server section.
     */
    public function p_print_server_section_info() {
        print '<p>In enhanced mode form contents are sent as a JSON message to the Omny Link server where they can be handled by a custom workflow.</p>';
        print '<p>Request your trial Omny Link account <a href="http://omny.link/contact-us/">here</a>.</p>';
    }

    /**
     * Output textbox for 'message_namespace' option.
     */
    public function p_message_namespace_callback() {
        printf(
            '<input type="text" id="message_namespace" name="'.P_ID.'_options[message_namespace]" value="%s" />',
            isset( $this->options['message_namespace'] ) ? esc_attr( $this->options['message_namespace']) : ''
        );
    }

    /**
     * Output textbox for 'api_url' option.
     */
    public function p_api_url_callback() {
        printf(
            '<input type="text" id="api_url" name="'.P_ID.'_options[api_url]" value="%s" />',
            isset( $this->options['api_url'] ) ? esc_attr( $this->options['api_url']) : P_API_URL
        );
    }


    /**
     * Output textbox for 'api_url' option.
     */
    public function p_api_key_callback() {
        printf(
            '<input type="text" id="api_key" name="'.P_ID.'_options[api_key]" value="%s" />',
            isset( $this->options['api_key'] ) ? esc_attr( $this->options['api_key']) : ''
        );
    }


    /**
     * Output textbox for 'api_secret' option.
     */
    public function p_api_secret_callback() {
        printf(
            '<input type="text" id="api_secret" name="'.P_ID.'_options[api_secret]" value="%s" />',
            isset( $this->options['api_secret'] ) ? esc_attr( $this->options['api_secret']) : ''
        );
    }

    /**
     * Output checkbox for 'post_published' option.
     */
    public function p_post_published_callback() {
        //error_log('Write option named: '.$this->options['post_published']);
        printf(
            '<input type="checkbox" id="post_published" name="'.P_ID.'_options[post_published]" %s />',
            isset( $this->options['post_published'] ) && $this->options['post_published'] == True ? 'checked' : ''
        );
    }

    /**
     * Print the leader text for the events section.
     */
    public function p_print_event_section_info() {
        print 'Check the events you would like to publish:';
    }
}

function p_init_logging() {
  define("P_DEBUG", $GLOBALS['p_options']->is_logging_level_debug());
  define("P_INFO", $GLOBALS['p_options']->is_logging_level_info());
  define("P_WARNING", $GLOBALS['p_options']->is_logging_level_warning());
  define("P_ERROR", $GLOBALS['p_options']->is_logging_level_error());
  
  if (P_DEBUG) { 
    if (P_DEBUG) error_log(P_NAME.' debug logging is on');
    else if (P_INFO) error_log(P_NAME.' info logging is on');
    else if (P_WARNING) error_log(P_NAME.' warning logging is on');
    else if (P_ERROR) error_log(P_NAME.' error logging is on');
    else error_log('No '.P_NAME.' logging is on, configure it in the settings page');
  }
}

function starts_with($haystack, $needle) {
    return $needle === "" || strpos($haystack, $needle) === 0;
}
function ends_with($haystack, $needle) {
    return $needle === "" || substr($haystack, -strlen($needle)) === $needle;
}
