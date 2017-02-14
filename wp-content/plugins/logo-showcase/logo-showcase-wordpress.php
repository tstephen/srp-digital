<?php
/*
Plugin Name: Logo Showcase
Plugin URI: http://themepoints.com/
Description: Logo Showcase plugin allow to Display a list of clients, supporters, partners or sponsors logos in your WordPress website easily.
Version: 1.6
Author: Themepoints
Author URI: http://themepoints.com
TextDomain: logoshowcase
License: GPLv2
*/


if ( ! defined( 'ABSPATH' ) )
die( "Can't load this file directly" );


define('LOGO_SHOWCASE_WP_PLUGIN_PATH', WP_PLUGIN_URL . '/' . plugin_basename( dirname(__FILE__) ) . '/' );
define('logo_showcase_wp_plugin_dir', plugin_dir_path( __FILE__ ) );



/*==========================================================================
	After setup plugins
==========================================================================*/

function logo_showcase_wordpress_init() {

	// include pricing post type
    include("inc/logo-showcase-wordpress-post-type.php");
	// register post type
	add_action('init', 'logo_showcase_wordpress_post_types_register');
	// custom title
	add_filter( 'enter_title_here', 'logo_showcase_wordpress_title' );
	// Include Meta Box Class File
	include( plugin_dir_path( __FILE__ ) . 'metabox/custom-meta-boxes.php' );
	// Include pricing theme File
	include( plugin_dir_path( __FILE__ ) . 'themes/logo-showcase-wordpress-themes.php' );	
	// enqueue scripts
	add_action('wp_enqueue_scripts', 'logo_showcase_wordpress_post_script');
	// add text domain
	add_action('plugins_loaded', 'logo_showcase_wordpress_load_textdomain');
	// admin enqueue scripts
	add_action('admin_enqueue_scripts', 'logo_showcase_wordpress_admin_enqueue_scripts');
	// add meta boxes
	add_action( 'add_meta_boxes', 'logo_showcase_wordpress_add_custom_box' );
	// Do something with the data entered
	add_action( 'save_post', 'logo_showcase_wordpress_save_postdata' );
	
	add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'custom_accordion_buy_action_links' );	
	// filter meta boxes
	add_filter( 'cmb_meta_boxes', 'logo_showcase_wordpress_filter_meta_box' );
	add_filter('widget_text', 'do_shortcode');	
}
add_action('after_setup_theme', 'logo_showcase_wordpress_init');


function custom_accordion_redirect_options_page( $plugin ) {
	if ( $plugin == plugin_basename( __FILE__ ) ) {
		exit( wp_redirect( admin_url( 'options-general.php' ) ) );
	}
}

add_action( 'activated_plugin', 'custom_accordion_redirect_options_page' );	




// admin menu
function custom_accordion_plugins_options_framwrork() {
	add_options_page( 'Pro Version Help & Features', '', 'manage_options', 'accordion-pro-v-features', 'tp_accordions_options_framework' );
}
add_action( 'admin_menu', 'custom_accordion_plugins_options_framwrork' );


if ( is_admin() ) : // Load only if we are viewing an admin page

function tp_accordions_options_framework_settings() {
	// Register settings and call sanitation functions
	register_setting( 'logo_showcase_options', 'tp_logo_showcase_options', 'tpls_logo_showcase_options' );
}
add_action( 'admin_init', 'tp_accordions_options_framework_settings' );



function tp_accordions_options_framework() {

	if ( ! isset( $_REQUEST['updated'] ) ) {
		$_REQUEST['updated'] = false;
	} ?>


	<div class="wrap about-wrap">
		<h1>Welcome to Logo Showcase 1.6</h1>

		<div class="about-text">Thank you for using our Logo Showcase plugin free version.</div>
		
		<hr>

		<h3>We create a <a target="_blank" href="http://themepoints.com/product/logo-showcase-pro/">premium version</a> of this plugin with some amazing cool features?</h3>
		<br>

		<hr>

		<div class="feature-section two-col">
			<h2>Premium Version Amazing Features</h2>
			<div class="col">
				<ul>
					<li><span class="dashicons dashicons-yes"></span> All the features of the free version.</li>
					<li><span class="dashicons dashicons-yes"></span> Unique settings for each logo showcase slider.</li>
					<li><span class="dashicons dashicons-yes"></span> Fully Responsive Logo Showcase.</li>
					<li><span class="dashicons dashicons-yes"></span> Highly customized for User Experience.</li>
					<li><span class="dashicons dashicons-yes"></span> Supports unlimited logo showcase per page.</li>
					<li><span class="dashicons dashicons-yes"></span> Advanced Shortcode System.</li>
					<li><span class="dashicons dashicons-yes"></span> Unlimited logo Support.</li>
					<li><span class="dashicons dashicons-yes"></span> Drag & Drop Logo Items sorting.</li>
					<li><span class="dashicons dashicons-yes"></span> Touch & Swipe Enable.</li>
					<li><span class="dashicons dashicons-yes"></span> Logo Showcase with custom number.</li>
					<li><span class="dashicons dashicons-yes"></span> Custom Border Color.</li>
					<li><span class="dashicons dashicons-yes"></span> Custom Title Support.</li>
					<li><span class="dashicons dashicons-yes"></span> Show/Hide Title Option.</li>
					<li><span class="dashicons dashicons-yes"></span> Title Position Settings.</li>
					<li><span class="dashicons dashicons-yes"></span> Title Font Color.</li>
					<li><span class="dashicons dashicons-yes"></span> Auto Play Mode settings.</li>					
				</ul>
			</div>
			<div class="col">
				<ul>
					<li><span class="dashicons dashicons-yes"></span> Stop On Hover Settings.</li>
					<li><span class="dashicons dashicons-yes"></span> Control Slide Speed.</li>
					<li><span class="dashicons dashicons-yes"></span> Pagination settings.</li>
					<li><span class="dashicons dashicons-yes"></span> Different Pagination Style (Round/Square).</li>
					<li><span class="dashicons dashicons-yes"></span> Pagination Position (left/center/right).</li>
					<li><span class="dashicons dashicons-yes"></span> Navigation settings.</li>
					<li><span class="dashicons dashicons-yes"></span> Navigation Position (left/center/right).</li>
					<li><span class="dashicons dashicons-yes"></span> Grayscale Style.</li>
					<li><span class="dashicons dashicons-yes"></span> Grid Style.</li>
					<li><span class="dashicons dashicons-yes"></span> Tooltip Options.</li>
					<li><span class="dashicons dashicons-yes"></span> Widget Ready.</li>
					<li><span class="dashicons dashicons-yes"></span> Unlimited Domain.</li>
					<li><span class="dashicons dashicons-yes"></span> Clean Design & Code.</li>
					<li><span class="dashicons dashicons-yes"></span> Online Documentation.</li>
					<li><span class="dashicons dashicons-yes"></span> 24/7 Dedicated support forum.</li>
					<li><span class="dashicons dashicons-yes"></span> And Many More</li>
				</ul>
			</div>
		</div>

		<h2><a href="http://themepoints.com/product/logo-showcase-pro/" class="button button-primary button-hero" target="_blank">Buy Premium Version Only $13</a>
		</h2>
		<br>
		<br>
		<br>
		<br>

	</div>

	<?php
}


endif;  // EndIf is_admin()




register_activation_hook( __FILE__, 'accordion_pro_v_plugin_active_hook' );
add_action( 'admin_init', 'accordion_pro_main_active_redirect_hook' );

function accordion_pro_v_plugin_active_hook() {
	add_option( 'accordion_pro_plugin_active_redirect_hook', true );
}

function accordion_pro_main_active_redirect_hook() {
	if ( get_option( 'accordion_pro_plugin_active_redirect_hook', false ) ) {
		delete_option( 'accordion_pro_plugin_active_redirect_hook' );
		if ( ! isset( $_GET['activate-multi'] ) ) {
			wp_redirect( "options-general.php?page=accordion-pro-v-features" );
		}
	}
}






function themepoints_logo_showcase_submenu_pages() {
	
	add_submenu_page( 'edit.php?post_type=tplogoshowcase', __('Support', 'logoshowcase'), __('Support', 'logoshowcase'), 'manage_options', 'support', 'themepoints_logo_showcase_support_callback' );		
}

function themepoints_logo_showcase_support_callback() { 
	require_once(plugin_dir_path(__FILE__).'/inc/logo-showcase-admin-info.php');
}			
	
add_action('admin_menu', 'themepoints_logo_showcase_submenu_pages');


/*==========================================================================
	pricing table wordpress enqueue scripts
==========================================================================*/
function logo_showcase_wordpress_post_script()
	{
    wp_enqueue_script("jquery-ui-sortable");
    wp_enqueue_script("jquery-ui-draggable");
    wp_enqueue_script("jquery-ui-droppable");
	wp_enqueue_style('logo-showcase-style', LOGO_SHOWCASE_WP_PLUGIN_PATH.'css/logo-showcase-wordpress.css');	
	wp_enqueue_style('logo-showcase-owl', LOGO_SHOWCASE_WP_PLUGIN_PATH.'css/owl.carousel.css');	
	wp_enqueue_style('logo-showcase-owl-theme', LOGO_SHOWCASE_WP_PLUGIN_PATH.'css/owl.theme.css');	
	wp_enqueue_style('logo-showcase-owl-transitions', LOGO_SHOWCASE_WP_PLUGIN_PATH.'css/owl.transitions.css');	
	wp_enqueue_script('logo-showcase-owl-js', plugins_url('js/owl.carousel.js', __FILE__), array('jquery'), '2.4', true);	
	}


/*==========================================================================
	logo showcase wordpress Load Translation
==========================================================================*/
function logo_showcase_wordpress_load_textdomain(){
	load_plugin_textdomain('logoshowcase', false, dirname( plugin_basename( __FILE__ ) ) .'/languages/' );
}




/*==========================================================================
	logo showcase wordpress Admin enqueue scripts
==========================================================================*/
function logo_showcase_wordpress_admin_enqueue_scripts(){
		global $typenow;

		if(($typenow == 'tplogoshowcase')){
	    wp_enqueue_style('logo-showcase-admin-css', LOGO_SHOWCASE_WP_PLUGIN_PATH.'admin/css/logo-showcase-backend-admin.css');

		wp_enqueue_script('logo-showcase-admin-js', LOGO_SHOWCASE_WP_PLUGIN_PATH.'admin/js/logo-showcase-backend-admin.js', array('jquery'), '1.0.0', true );			
		
        wp_enqueue_style('wp-color-picker');	
        wp_enqueue_script( 'logo_showcase_color_picker', plugins_url('admin/js/color-picker.js', __FILE__ ), array( 'wp-color-picker' ), false, true );
        wp_enqueue_script("jquery-ui-sortable");
        wp_enqueue_script("jquery-ui-draggable");
        wp_enqueue_script("jquery-ui-droppable");		
		}
}




/*==========================================================================
	pricing table wordpress meta boxes
==========================================================================*/

function logo_showcase_wordpress_filter_meta_box( $meta_boxes ) {
  $meta_boxes[] = array(

    'id'          => 'lowo_showcase_wordpress_feature',
    'title'       => 'Logo Showcase Column Features',
    'pages'       => array('tplogoshowcase'),
    'context'     => 'normal',
    'priority'    => 'high',
    'show_names'  => true, 
    'fields' => array(

      array(
        'id'   => 'logo_showcase_columns',
        'name'    => 'Logo Showcase Details',
        'type' => 'group',
        'repeatable'     => true,
        'repeatable_max' => 8,
        
        'fields' => array(

          array(
            'id'              => 'logo_showcase_title',
            'name'            => 'Logo Title',                
            'type'            => 'text',
            'cols'            => 4
            ),          

			
          array(
            'id'              => 'logo_showcase_link_url',
            'name'            => 'Url',                
            'type'            => 'text_url',
            'default'         => '#',
            'cols'            => 4              
            ),

          array(
            'id'              => 'logo_showcase_link_target',
            'name'            => 'Target Link (_self/_blank)',                
            'type'            => 'text',
            'cols'            => 4,
            'default'         => '_self'
            ),
			
          array(
            'id'              => 'logo_showcase_uploader',
            'name'            => 'Upload Logo',                
            'type'            => 'image',
            'cols'            => 4
            )
			

          )
      )
  )
);


return $meta_boxes;
}


/*==========================================================================
	Logo Showcase wordpress register shortcode
==========================================================================*/
function logo_showcase_wordpress_shortcode_register($atts, $content = null){
	$atts = shortcode_atts(
		array(
			'id' => "",
		), $atts);
		global $post;
		$post_id = $atts['id'];
		
		$content = '';
        $content.= Logo_Showcase_wordpress_table_body($post_id);
		return $content;
}

// shortcode hook
add_shortcode('logo_showcase', 'logo_showcase_wordpress_shortcode_register');


