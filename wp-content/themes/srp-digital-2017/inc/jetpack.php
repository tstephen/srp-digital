<?php
/**
 * Jetpack Compatibility File
 * See: http://jetpack.me/
 *
 * @package SRP Digital
 */

function srp_jetpack_setup() {
	/**
	 * Add theme support for Infinite Scroll.
	 * See: http://jetpack.me/support/infinite-scroll/
	 */
	add_theme_support( 'infinite-scroll', array(
		'container' => 'main',
		'footer'    => false,
		'wrapper'   => false,
	) );
}
add_action( 'after_setup_theme', 'srp-digital-2017_jetpack_setup', 11 );
