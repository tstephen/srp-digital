<?php

  function p_form_init() {

  	$labels = array(
      'name'                => _x( P_NAME, 'Post Type General Name', 'p_form' ),
      'singular_name'       => _x( rtrim(P_NAME,'s'), 'Post Type Singular Name', 'p_form' ),
      'menu_name'           => __( P_NAME, 'p_form' ),
  		'parent_item_colon'   => __( 'Parent Form:', 'p_form' ),
  		'all_items'           => __( 'All Forms', 'p_form' ),
  		'view_item'           => __( 'View Form', 'p_form' ),
  		'add_new_item'        => __( 'Add New Form', 'p_form' ),
  		'add_new'             => __( 'Add New', 'p_form' ),
  		'edit_item'           => __( 'Edit Form', 'p_form' ),
  		'update_item'         => __( 'Update Form', 'p_form' ),
  		'search_items'        => __( 'Search Form', 'p_form' ),
  		'not_found'           => __( 'Not found', 'p_form' ),
  		'not_found_in_trash'  => __( 'Not found in Trash', 'p_form' ),
  	);
  	$args = array(
  		'label'               => __( 'p_form', 'p_form' ),
  		'description'         => __( 'A simple, semantic form compatible with Omny Link data and action binding', 'p_form' ),
  		'labels'              => $labels,
  		'supports'            => array( 'title', 'editor', 'author', 'revisions', ),
  		'taxonomies'          => array( 'category', 'post_tag' ),
  		'hierarchical'        => false,
  		'public'              => true,
  		'show_ui'             => true,
  		'show_in_menu'        => true,
  		'show_in_nav_menus'   => true,
  		'show_in_admin_bar'   => true,
  		'menu_position'       => 20,
      'menu_icon'           => plugins_url('../images/omny-greyscale-icon-20x20.png', __FILE__),
  		'can_export'          => true,
  		'has_archive'         => false,
  		'exclude_from_search' => false,
  		'publicly_queryable'  => true,
  		'capability_type'     => 'page',
  	);
  	register_post_type( 'p_form', $args );

  }

  // Hook into the 'init' action
  add_action( 'init', 'p_form_init', 0 );

  /**
   * Adds meta boxes to the form editing screen
   */
  function p_custom_meta() {
    add_meta_box( 'p_meta_domain', __( 'Add pre-defined field', P_TEXT_DOMAIN ), 'p_meta_domain_callback', 'p_form', 'side', 'high');
    add_meta_box( 'p_meta', __( 'Generate custom field', P_TEXT_DOMAIN ), 'p_meta_callback', 'p_form', 'side', 'high');
    add_meta_box( 'p_meta_help', __( 'Help on form controls', P_TEXT_DOMAIN ), 'p_meta_help_callback', 'p_form', 'normal', 'high');
    //remove_meta_box( 'postcustom' , 'p_form' , 'normal' );
  }
  add_action( 'add_meta_boxes', 'p_custom_meta' );

  /**
   * Outputs the meta box containing tools for creating form controls.
   */
  function p_meta_callback( $post ) {
    wp_nonce_field( basename( __FILE__ ), 'p_nonce' );
    // TODO not sure why this is not being called on init, but it is not
    p_load_scripts();
    ?>

    <p>
      <label for="ctrlType"><?php _e( 'Control Type', P_TEXT_DOMAIN )?></label><br/>
      <select name="ctrlType" id="ctrlType" onchange="$p.addControlOptions()">
        <option value="checkbox"><?php _e( 'Checkbox', P_TEXT_DOMAIN )?></option>';
        <option value="email"><?php _e( 'Email', P_TEXT_DOMAIN )?></option>';
        <option value="tel"><?php _e( 'Telephone', P_TEXT_DOMAIN )?></option>';
        <option value="number"><?php _e( 'Number', P_TEXT_DOMAIN )?></option>';
        <option value="radio"><?php _e( 'Radio Group', P_TEXT_DOMAIN )?></option>';
        <option value="select"><?php _e( 'Select', P_TEXT_DOMAIN )?></option>';
        <option value="text" selected><?php _e( 'Text', P_TEXT_DOMAIN )?></option>';
        <option value="textarea"><?php _e( 'Textarea', P_TEXT_DOMAIN )?></option>';
        <option value="url"><?php _e( 'Url', P_TEXT_DOMAIN )?></option>';
      </select>
    </p>

    <p>
      <label for="ctrlLabel"><?php _e( 'Label', P_TEXT_DOMAIN )?></label><br/>
      <input type="text" name="ctrlLabel" id="ctrlLabel" value="<?php if ( isset ( $p_stored_meta['ctrlLabel'] ) ) echo $p_stored_meta['ctrlLabel'][0]; ?>" />
    </p>

    <p>
      <label for="ctrlId"><?php _e( 'Id', P_TEXT_DOMAIN )?></label><br/>
      <input type="text" name="ctrlId" id="ctrlId" value="<?php if ( isset ( $p_stored_meta['ctrlId'] ) ) echo $p_stored_meta['ctrlId'][0]; ?>" />
    </p>

    <p>
      <label for="ctrlPlaceholder"><?php _e( 'Placeholder', P_TEXT_DOMAIN )?></label><br/>
      <input type="text" name="ctrlPlaceholder" id="ctrlPlaceholder" value="<?php if ( isset ( $p_stored_meta['ctrlPlaceholder'] ) ) echo $p_stored_meta['ctrlPlaceholder'][0]; ?>" />
    </p>

    <p id="ctrlOptionsPara" style="display:none">
      <label for="ctrlOptions"><?php _e( 'Options (comma-separated list)', P_TEXT_DOMAIN )?></label><br/>
      <input type="text" name="ctrlOptions" id="ctrlOptions" value="<?php if ( isset ( $p_stored_meta['ctrlOptions'] ) ) echo $p_stored_meta['ctrlOptions'][0]; ?>" />
    </p>

    <p id="ctrlValuePara">
      <label for="ctrlValue"><?php _e( 'Initial value', P_TEXT_DOMAIN )?></label><br/>
      <input type="text" name="ctrlValue" id="ctrlValue" value="<?php if ( isset ( $p_stored_meta['ctrlValue'] ) ) echo $p_stored_meta['ctrlValue'][0]; ?>" />
    </p>

    <p>
      <span><?php _e( 'Required?', P_TEXT_DOMAIN )?></span>
      <div class="prfx-row-content">
        <label for="ctrlRequired">
          <input type="checkbox" name="ctrlRequired" id="ctrlRequired" value="yes" <?php if ( isset ( $prfx_stored_meta['ctrlRequired'] ) ) checked( $prfx_stored_meta['ctrlRequired'][0], 'yes' ); ?> />
          <?php _e( '', P_TEXT_DOMAIN )?>
        </label>
      </div>
    </p>

    <p>
      <input type="button" id="addCtrl" class="button"
          onclick="$p.addControl();"
          value="<?php _e( 'Add control', P_TEXT_DOMAIN )?>" />
    </p>

    <?php
  }

  /**
   * Outputs the meta box containing tools for creating form controls.
   */
  function p_meta_domain_callback( $post ) {
    wp_nonce_field( basename( __FILE__ ), 'p_nonce' );
    // TODO not sure why this is not being called on init, but it is not
    p_load_scripts();
    $options = new FormsOptions();
    ?>

    <p>
      <label for="domainCtrl"><?php _e( 'Field Name', P_TEXT_DOMAIN )?></label><br/>
      <input class="autocomplete" data-p-ready="$p.initDomainModel()" type="text" name="domainCtrl" id="domainCtrl" />
    </p>

    <p>
      <input type="button" id="addDomainCtrl" class="button"
          onclick="$p.addDomainControl();"
          value="<?php _e( 'Add control', P_TEXT_DOMAIN )?>" />
    </p>

    <?php
  }

  /**
   * Outputs the meta box containing tools for creating form controls.
   */
  function p_meta_help_callback( $post ) {
error_log('Called help renderer');
    wp_nonce_field( basename( __FILE__ ), 'p_nonce' );
    // TODO not sure why this is not being called on init, but it is not
    p_load_scripts();
    ?>
    <p>
      Form controls can take advantage of any HTML features, so for example to make something a required field simply use the required attribute on any form control. Similarly, standard html layout tags such as &lt;ul> and &lt;span> may be used.
    </p>
    <p>
      To provide a rich user interface including labels, hint text and validation with the minimum form definition <i><?php echo P_NAME ?></i> enhances the form at runtime based on the following rules, <b><em>if</em> the control has the 'decorate' CSS class:</b>
      <ul style="list-style-type:circle;margin-left:30px;">
        <li>Every form field is wrapped in a &lt;div> to keep label, field and hint together</li>
        <li><b>name attribute: </b>Provides the text for the field's label.</li>
        <li><b>title attribute: </b>Provides the hint text displayed, by default, on error.</li>
        <li><b>id attribute: </b>Is used as the JavaScript variable binding. So a field with id 'fName' in a form whose slug is 'contact' can be accessed in JavaScript at <code>$p.contact.fName</code>.</li>
      </ul>
    <?php
  }
?>
