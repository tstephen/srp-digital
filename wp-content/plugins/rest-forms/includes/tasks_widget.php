<?php
//require_once("options.php");
// Creating the widget 
class p_tasks_widget extends WP_Widget {

  function __construct() {
    parent::__construct(
      // Base ID of your widget
      'p_tasks_widget', 

      // Widget name will appear in UI
      __('Omny Link Tasks Widget', 'p_tasks_widget_domain'), 

      // Widget description
      array( 'description' => __( 'Display your upcoming tasks from Omny Link', 'p_tasks_widget_domain' ), ) 
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

    if (is_user_logged_in()) { 
    $options = new FormsOptions();
    $base_url = $options->get_api_url();
    $namespace = $options->get_message_namespace();

    $ol_usr = get_user_meta(get_current_user_id(), 'ol_username', true);
    $ol_pwd = get_user_meta(get_current_user_id(), 'ol_password', true);

    // This is where you run the code and display the output
    ?>
      <div id="tasksTemplate" style="display:none">
        <ul>
          {{#tasks}}
            <li><a class="p-task" href="<?php echo $base_url ?>work.html?id=<?php echo $base_url ?>{{selfRef}}" target="_newTab">{{name}} {{businessKey}}</a><br/><span class="p-task-secondary">{{age}}</span></li>
          {{/tasks}}
          {{^tasks}}
            <li>Yah! You're up to date.</li>
          {{/tasks}}
        </ul>
        {{#tasks}}
          <button class="btn btn-default" onclick="window.open('<?php echo $base_url ?>work.html')">View All</button>
        {{/tasks}}
    </div>
    <section id="tasks"> </section>
    <script type="text/javascript">
      jQuery(document).ready(function() { 
        $p.username = '<?php echo $ol_usr ?>';
        $p.password = '<?php echo $ol_pwd ?>';
        $p.fetchAndRender('<?php echo $base_url.$namespace ?>/tasks/<?php echo $ol_usr ?>/?limit=<?php echo $instance['limit'] ?>','tasks','#tasksTemplate','#tasks');
      });
    </script>
    <?php
    } else { 
    ?>
      <section> 
        <p>Please <a href="/login">login</a> to see your task list</p>
      </section>
    <?php
    }
    echo $args['after_widget'];
  }
		
  // Widget Backend 
  public function form( $instance ) {
    if ( isset( $instance[ 'title' ] ) ) {
      $title = $instance[ 'title' ];
    } else {
      $title = __( 'Top Tasks', 'p_tasks_widget_domain' );
    }
    if ( isset( $instance[ 'limit' ] ) ) {
      $limit = $instance[ 'limit' ];
    } else {
      $limit = __( '10', 'p_tasks_widget_domain' );
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
} // Class p_tasks_widget ends here

// Register and load the widget
function p_tasks_load_widget() {
	register_widget( 'p_tasks_widget' );
}
add_action( 'widgets_init', 'p_tasks_load_widget' );
?>
