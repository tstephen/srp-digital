<?php
/**
 * SRP Digital functions and definitions
 *
 * @package SRP Digital
 */

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function srp_setup() {

  /*
   * Declare textdomain for this child theme.
   */
  load_child_theme_textdomain( 'srp-digital-2017', get_stylesheet_directory() . '/languages' );

  /*
   * Enable support for Post Thumbnails on posts and pages.
   *
   * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
   */
  add_image_size( 'boardwalk-featured-image', 980, 980, true );

}
add_action( 'after_setup_theme', 'srp_setup', 11 );

/**
 * Enqueue scripts and styles.
 */
function srp_scripts() {
  /* Dequeue*/
  wp_dequeue_style( 'boardwalk-lato-merriweather' );

  wp_dequeue_style( 'boardwalk-style' );

  if ( ( is_search() && have_posts() ) || is_archive() || is_home() ) {
    wp_dequeue_script( 'boardwalk-mousewheel' );
  }

  wp_dequeue_script( 'boardwalk-script' );

  /* Enqueue */
  wp_enqueue_style( 'srp-digital-2017-parent-style', get_template_directory_uri() . '/style.css' );

  if ( is_rtl() ) {
    wp_enqueue_style( 'srp-digital-2017-parent-style-rtl', get_template_directory_uri() . '/rtl.css', array( 'srp-digital-2017-parent-style' ) );
  }

    wp_enqueue_style( 'srp-digital-2017-style', get_stylesheet_uri(), array( 'srp-digital-2017-parent-style' ) );

    if ( ( is_search() && have_posts() ) || is_archive() || is_home() ) {
    wp_enqueue_script( 'srp-digital-2017-hentry', get_stylesheet_directory_uri() . '/js/hentry.js', array( 'jquery' ), '20150113', true );
  }

  wp_enqueue_script( 'srp-digital-2017-script', get_stylesheet_directory_uri() . '/js/srp-digital-2017.js', array( 'jquery' ), '20150113', true );
}
add_action( 'wp_enqueue_scripts', 'srp_scripts', 11 );

/**
 * Custom template tags for this theme.
 * Overrides same file in boardwalk base theme.
 */
#require get_stylesheet_directory() . '/inc/template-tags.php';

/**
 * Load Jetpack compatibility file.
 */
require get_stylesheet_directory() . '/inc/jetpack.php';

/**
 * Footer widget area below the featured posts.
 */
require get_stylesheet_directory() . '/inc/widgets.php';

/* Allow shortcodes in widget areas */
add_filter('widget_text', 'do_shortcode');
