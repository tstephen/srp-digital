<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package SRP Digital
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="hfeed site">
  <a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'boardwalk' ); ?></a>

  <header id="masthead" class="site-header" role="banner">
    <div class="site-branding">
      <?php boardwalk_the_site_logo(); ?>
      <div class="clear">
        <h1 class="site-title">
          <a class="visible-xs" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">Sustainable<br/>Resourcing</a>
          <a class="hidden-xs" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
        </h1>
        <h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
      </div>
    </div><!-- .site-branding -->
    <?php if ( is_active_sidebar( 'sidebar-1' ) || has_nav_menu( 'primary' ) ) : ?>
      <button class="sidebar-toggle" aria-expanded="false" ><span class="screen-reader-text"><?php _e( 'Toggle Sidebar', 'boardwalk' ); ?></span></button>
    <?php endif; ?>
    <div class="<?php echo is_user_logged_in() ? 'logout' : 'login' ?>">
      <?php
        $usr = wp_get_current_user();
/* WP-MEMBERS approach
        if (is_user_logged_in()) { ?> 
          <a class="logout dashicons dashicons-migrate color-5" href="/?a=logout"></a>
          <!--a class="" href="/profile"><?php echo get_avatar($usr->ID, 46); ?></a--> <?php
          echo get_avatar($usr->ID, 46);
        } else {
          ?> <a class="login color-4" href="/login">Login</a> <?php
          ?> <a class="register color-5" href="/register">Register</a> <?php
        }*/
      ?>
      <a class="login color-4" href="https://trakeo.com:8443/login">Login</a>
      <a class="register color-5" href="/register">Register</a>
    </div>
  </header><!-- #masthead -->

  <div id="content" class="site-content">
