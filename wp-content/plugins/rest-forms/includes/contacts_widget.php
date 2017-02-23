<?php
//require_once("options.php");
// Creating the widget 
class p_contacts_widget extends WP_Widget {

  function __construct() {
    parent::__construct(
      // Base ID of your widget
      'p_contacts_widget', 

      // Widget name will appear in UI
      __('Omny Link Contacts Widget', 'p_contacts_widget_domain'), 

      // Widget description
      array( 'description' => __( 'Display recently added or updated contacts', 'p_contacts_widget_domain' ), ) 
    );
  }

  // Creating widget front-end
  // This is where the action happens
  public function widget( $args, $instance ) {
    $title = apply_filters( 'widget_title', $instance['title'] );
    // before and after widget arguments are defined by themes
    echo $args['before_widget'];
    if ( ! empty( $title ) )
      echo $args['before_title'] . $title . $args['after_title'];

    $options = new FormsOptions();
    $base_url = $options->get_api_url();
    $namespace = $options->get_message_namespace();

    // This is where you run the code and display the output
    ?>
      <div id="contactsTemplate" style="display:none">
        <ul>
          {{#contacts}}
            <li><a class="p-contact" href="<?php echo $base_url.$namespace ?>.html?id=<?php echo $base_url ?>{{selfRef}}" target="_newTab">{{firstName}} {{lastName}}</a><br/><span class="p-contact-secondary">{{age}}</span></li>
          {{/contacts}}
        </ul>
        <button class="btn btn-default" onclick="window.open('<?php echo $base_url.$namespace ?>.html')">View All</button>
    </div>
    <section id="contacts"> </section>
    <script type="text/javascript">
      jQuery(document).ready(function() { 
        $p.fetchAndRender('/wp-admin/admin-ajax.php?action=p_resource&resource=/contacts/?limit=<?php echo $instance['limit'] ?>','contacts','#contactsTemplate','#contacts');
      });
    </script>
    <?php
    echo $args['after_widget'];
  }
		
  // Widget Backend 
  public function form( $instance ) {
    if ( isset( $instance[ 'title' ] ) ) {
      $title = $instance[ 'title' ];
    } else {
      $title = __( 'Recent Contacts', 'p_contacts_widget_domain' );
    }
    if ( isset( $instance[ 'limit' ] ) ) {
      $limit = $instance[ 'limit' ];
    } else {
      $limit = __( '10', 'p_contacts_widget_domain' );
    }

    // Widget admin form ?>
    <p>
      <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label> 
      <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
    </p>
    <p>
      <label for="<?php echo $this->get_field_id( 'limit' ); ?>"><?php _e( 'Limit:' ); ?></label> 
      <input class="widefat" id="<?php echo $this->get_field_id( 'limit' ); ?>" name="<?php echo $this->get_field_name( 'limit' ); ?>" type="number" value="<?php echo esc_attr( $limit ); ?>" />
    </p>
    <?php 
  }
	
    // Updating widget replacing old instances with new
  public function update( $new_instance, $old_instance ) {
    $instance = array();
    $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
    $instance['limit'] = ( ! empty( $new_instance['limit'] ) ) ? strip_tags( $new_instance['limit'] ) : '';
    return $instance;
  }
} // Class p_contacts_widget ends here

// Register and load the widget
function p_contacts_load_widget() {
	register_widget( 'p_contacts_widget' );
}
add_action( 'widgets_init', 'p_contacts_load_widget' );
?>
