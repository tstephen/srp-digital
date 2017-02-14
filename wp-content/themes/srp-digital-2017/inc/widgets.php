<?php

function srp_widgets_init() {

  /*
   * Footer (three widget areas)
   */
  register_sidebar( array(
    'name'            => __( 'Footer', 'srp-digital-2017' ),
    'id'              => 'footer-widget-area',
    'description'     => __( 'The footer widget area', 'srp-digital-2017' ),
    'before_widget'   => '<nav class="%1$s %2$s footer-entry">',
    'after_widget'    => '</nav>',
    'before_title'    => '<h4 class="footer-title">',
    'after_title'     => '</h4>',
  ) );

}
add_action( 'widgets_init', 'srp_widgets_init' );
