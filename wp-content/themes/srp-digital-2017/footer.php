<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package SRP Digital 2017
 */
?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer" role="contentinfo">

<?php if ( is_active_sidebar('footer-widget-area') ) : ?>
<div class="footer-widget-area">
     <?php dynamic_sidebar('footer-widget-area'); ?>
</div>
<?php endif; ?>

		<?php if ( has_nav_menu( 'social' ) ) : ?>
			<nav class="social-navigation" role="navigation">
				<?php
					wp_nav_menu( array(
						'theme_location'  => 'social',
						'container_class' => 'menu-social',
						'menu_class'      => 'clear',
						'link_before'     => '<span class="screen-reader-text">',
						'link_after'      => '</span>',
						'depth'           => 1,
					) );
				?>
			</nav><!-- .social-navigation -->
		<?php endif; ?>
		<div class="site-info">
			<a href="<?php echo esc_url( __( 'http://wordpress.org/', 'srp-digital-2017' ) ); ?>"><?php printf( __( 'Proudly powered by %s', 'srp-digital-2017' ), 'WordPress' ); ?></a>
			<span class="sep"> | </span>
			<?php printf( __( 'Theme: %1$s by %2$s.', 'srp-digital-2017' ), 'SRP Digital 2017', '<a href="/puffin-digital" rel="designer">Puffin  Digital</a>' ); ?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
