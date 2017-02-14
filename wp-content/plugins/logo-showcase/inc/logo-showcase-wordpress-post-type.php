<?php

	/*==========================================================================
		Register logo showcase WordPress Post Type
	==========================================================================*/

	function logo_showcase_wordpress_post_types_register(){
		$labels = array(
			'name'               => _x( 'Logo Showcase', 'post type general name', 'logoshowcase' ),
			'singular_name'      => _x( 'Logo Showcase', 'post type singular name', 'logoshowcase' ),
			'menu_name'          => _x( 'Logo Showcase', 'admin menu', 'logoshowcase' ),
			'name_admin_bar'     => _x( 'Logo Showcase', 'add new on admin bar', 'logoshowcase' ),
			'add_new'            => _x( 'Add New', 'Logo Showcase', 'logoshowcase' ),
			'add_new_item'       => __( 'Add New Logo Showcase', 'logoshowcase' ),
			'new_item'           => __( 'New Logo Showcase', 'logoshowcase' ),
			'edit_item'          => __( 'Edit Logo Showcase', 'logoshowcase' ),
			'view_item'          => __( 'View Logo Showcase', 'logoshowcase' ),
			'all_items'          => __( 'All Logo Showcase', 'logoshowcase' ),
			'search_items'       => __( 'Search Logo Showcase', 'logoshowcase' ),
			'parent_item_colon'  => __( 'Parent Logo Showcase:', 'logoshowcase' ),
			'not_found'          => __( 'No Logo Showcase found.', 'logoshowcase' ),
			'not_found_in_trash' => __( 'No PLogo Showcase found in Trash.', 'logoshowcase' )
		);

		$args = array(
			'labels'             => $labels,
			'description'        => __( 'Description.', 'logoshowcase' ),
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'Logo Showcase' ),
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title'),
		);
		register_post_type( 'tplogoshowcase', $args );
	}



	/*==========================================================================
		Change logo showcase WordPress Post Title
	==========================================================================*/	
	
	function logo_showcase_wordpress_title( $title ){

	  $screen = get_current_screen();
	  if  ( 'tplogoshowcase' == $screen->post_type ) {
		$title = 'Logo Showcase Title';
	  }  
	  return $title;
	}	
	
	
	
	
	
	
	
	
	
	/*==========================================================================
		Adds a box to the main column on the Post and Page edit screens
	==========================================================================*/

	function logo_showcase_wordpress_add_custom_box() {
			$screens = array( 'tplogoshowcase' );
			foreach ( $screens as $screen )
			{
			add_meta_box('logo_showcase_sectionid', __( 'logo Showcase Configure','logoshowcase' ),'logo_showcase_wordpress_inner_custom_box', $screen);
			}     
	}

	
	
	
	
	
	/*======================
		Plugin Action Links
	========================*/	

	function custom_accordion_buy_action_links( $links ) {
		$links[] = '<a href="http://themepoints.com/product/logo-showcase-pro/" style="color: red; font-weight: bold;" target="_blank">Buy Pro!</a>';
		return $links;
	}


	/*==========================================================================
		Prints the box content 
	==========================================================================*/

	function logo_showcase_wordpress_inner_custom_box() {
		global $post;
		// Use nonce for verification
		wp_nonce_field( plugin_basename( __FILE__ ), 'logo_showcase_wordpress_dynamicMeta_noncename' );
		?>
		<?php

		//get the saved meta as an arry
		
		$logo_showcase_columns_post_themes = get_post_meta( $post->ID, 'logo_showcase_columns_post_themes', true );
		$logo_showcase_columns_show_hide_pagination = get_post_meta( $post->ID, 'logo_showcase_columns_show_hide_pagination', true );
		$logo_showcase_columns_style_pagination = get_post_meta( $post->ID, 'logo_showcase_columns_style_pagination', true );
		$logo_showcase_columns_show_hide_pagination_position = get_post_meta( $post->ID, 'logo_showcase_columns_show_hide_pagination_position', true );
		$logo_showcase_columns_show_hide_navigation = get_post_meta( $post->ID, 'logo_showcase_columns_show_hide_navigation', true );
		$logo_showcase_columns_show_hide_grayscale = get_post_meta( $post->ID, 'logo_showcase_columns_show_hide_grayscale', true );
		$logo_showcase_columns_show_hide_tooltips = get_post_meta( $post->ID, 'logo_showcase_columns_show_hide_tooltips', true );
		$logo_showcase_columns_border_color = get_post_meta( $post->ID, 'logo_showcase_columns_border_color', true );
		$logo_showcase_columns_border_hover_color = get_post_meta( $post->ID, 'logo_showcase_columns_border_hover_color', true );
		$logo_showcase_columns_show_items = get_post_meta( $post->ID, 'logo_showcase_columns_show_items', true );
		$logo_showcase_free_show_title_hide = get_post_meta( $post->ID, 'logo_showcase_free_show_title_hide', true );
		$logo_showcase_columns_title_position = get_post_meta( $post->ID, 'logo_showcase_columns_title_position', true );
		$logo_showcase_columns_title_font_color = get_post_meta( $post->ID, 'logo_showcase_columns_title_font_color', true );
		$logo_showcase_columns_show_slide_speed = get_post_meta( $post->ID, 'logo_showcase_columns_show_slide_speed', true );
		$logo_showcase_columns_show_auto_play = get_post_meta( $post->ID, 'logo_showcase_columns_show_auto_play', true );
		$logo_showcase_columns_show_stop_hover_play = get_post_meta( $post->ID, 'logo_showcase_columns_show_stop_hover_play', true );
		$logo_showcase_columns_show_hide_navigation_position = get_post_meta( $post->ID, 'logo_showcase_columns_show_hide_navigation_position', true );
		
		
		?>	

		
		<div id="tabs-container">
			<ul class="tabs-menu">
				<li class="current"><a href="#tab-1"><?php _e('Settings', 'logoshowcase')?></a></li>
				<li><a href="#tab-2"><?php _e('Shortcode', 'logoshowcase')?></a></li>
			</ul>	
		
		
			<div class="tab">
				<div id="tab-1" class="tab-content">
					<div class="wrap">				
						<table class="form-table">
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_post_themes"><?php echo __('Themes:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_post_themes">
									<option value="theme1" <?php if($logo_showcase_columns_post_themes=='theme1') echo "selected"; ?> >Default</option>
									<option value="theme2" disabled >Grid Theme (Only for Pro) </option>									
								</select><br/>
								<span class="tp_accordions_pro_hint">Select Logo Showcase Themes.</span>
								</td>
							</tr>
							<tr valign="top" >
								<th scope="row" ><label style="padding-left:10px;" for="logo-showcase-column-border-color"><?php echo __('Border Color:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle; width:165px; ">
									<input  size='7' name='logo_showcase_columns_border_color' class='logo-showcase-column-border-color' id="logo-showcase-column-border-color" type='text' value='<?php echo sanitize_text_field($logo_showcase_columns_border_color) ?>' />
									<br/>
									<span class="tp_accordions_pro_hint">Choose Border Color.</span>
								</td>
							</tr>
							<tr valign="top" >
								<th scope="row" ><label style="padding-left:10px;" for="logo-showcase-column-border-hover-color"><?php echo __('Border Hover Color:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle; width:165px; ">
									<input  size='7' name='logo_showcase_columns_border_hover_color' class='logo-showcase-column-border-hover-color' id="logo-showcase-column-border-hover-color" type='text' value='<?php echo sanitize_text_field($logo_showcase_columns_border_hover_color) ?>' />
									<br/>
									<span class="tp_accordions_pro_hint">Choose Border Hover Color.</span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_items"><?php echo __('Show Items:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;width:165px;">
								<input size='5' placeholder="show items" name='logo_showcase_columns_show_items' class='logo-showcase-show-total-items' id="logo-showcase-show-total-items" type='text' value='<?php echo sanitize_text_field($logo_showcase_columns_show_items) ?>' />
								<br/>
								<span class="tp_accordions_pro_hint">Logo Showcase with custom number</span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_free_show_title_hide"><?php echo __('Show Hide Title:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_free_show_title_hide">
									<option value="block" <?php if($logo_showcase_free_show_title_hide=='block') echo "selected"; ?> >Show</option>				
									<option value="none" <?php if($logo_showcase_free_show_title_hide=='none') echo "selected"; ?> >Hide</option>				
								</select><br/>
								<span class="tp_accordions_pro_hint">Show/Hide Title.</span>
								</td>
							</tr>							
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_title_position"><?php echo __('Title Position:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_title_position">
									<option value="left" <?php if($logo_showcase_columns_title_position=='left') echo "selected"; ?> >Left</option>				
									<option value="center" <?php if($logo_showcase_columns_title_position=='center') echo "selected"; ?> >Center</option>				
									<option value="right" <?php if($logo_showcase_columns_title_position=='right') echo "selected"; ?> >Right</option>				
								</select><br/>
								<span class="tp_accordions_pro_hint">Choose Your Title Position.<span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>							
							<tr valign="top" >
								<th scope="row" ><label style="padding-left:10px;" for="logo_showcase_columns_title_font_color"><?php echo __('Title Font Color:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle; width:165px; ">
									<input  size='7' name='logo_showcase_columns_title_font_color' class='logo-showcase-column-title-font-color' id="logo-showcase-column-title-font-color" type='text' value='<?php echo sanitize_text_field($logo_showcase_columns_title_font_color) ?>' />
									<br/>
									<span class="tp_accordions_pro_hint">Choose Title Font Color.<span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>							
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_auto_play"><?php echo __('Auto Play Mode:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;width:165px;">
								<input size='5' placeholder="Auto Play Mode" name='logo_showcase_columns_show_auto_play' class='logo-showcase-show-total-items-auto_play' id="logo-showcase-show-total-items-auto-play" type='text' value='<?php echo sanitize_text_field($logo_showcase_columns_show_auto_play) ?>' />
								<br/>
								<span class="tp_accordions_pro_hint">Slide Speed. <span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_stop_hover_play"><?php echo __('Stop On Hover:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_show_stop_hover_play">
									<option value="true" <?php if($logo_showcase_columns_show_stop_hover_play=='true') echo "selected"; ?> >True</option>				
									<option value="false" <?php if($logo_showcase_columns_show_stop_hover_play=='false') echo "selected"; ?> >False</option>				
								</select><br/>
								<span class="tp_accordions_pro_hint">Stop On Hover.<span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>							
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_slide_speed"><?php echo __('SlideSpeed:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;width:165px;">
								<input size='5' placeholder="slide speed(Only Pro Version)" name='logo_showcase_columns_show_slide_speed' class='logo-showcase-show-total-items-slide-speed' id="logo-showcase-show-total-items-slide-speed" type='text' value='<?php echo sanitize_text_field($logo_showcase_columns_show_slide_speed) ?>' />
								<br/>
								<span class="tp_accordions_pro_hint">Slide Speed. <span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_hide_pagination"><?php echo __('Pagination:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_show_hide_pagination">
									<option value="true" <?php if($logo_showcase_columns_show_hide_pagination=='true') echo "selected"; ?> >True</option>				
									<option value="false" <?php if($logo_showcase_columns_show_hide_pagination=='false') echo "selected"; ?> >False</option>				
								</select><br/>
								<span class="tp_accordions_pro_hint">Show/Hide Pagination. <span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_style_pagination"><?php echo __('Pagination Style:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_style_pagination">
									<option value="20" <?php if($logo_showcase_columns_style_pagination=='20') echo "selected"; ?> >Round</option>				
									<option value="0" <?php if($logo_showcase_columns_style_pagination=='0') echo "selected"; ?> >Square</option>				
								</select><br/>
								<span class="tp_accordions_pro_hint">Choose Pagination Style.<span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_hide_pagination_position"><?php echo __('Pagination Position:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_show_hide_pagination_position">
									<option value="center" <?php if($logo_showcase_columns_show_hide_pagination_position=='center') echo "selected"; ?> >Default</option>		
									<option value="left" <?php if($logo_showcase_columns_show_hide_pagination_position=='left') echo "selected"; ?> >Bottom Left</option>
									<option value="right" <?php if($logo_showcase_columns_show_hide_pagination_position=='right') echo "selected"; ?> >Bottom Right</option>
								</select><br/>
								<span class="tp_accordions_pro_hint">Choose Your Pagination Position. <span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>								
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_hide_navigation"><?php echo __('Navigation:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_show_hide_navigation">
									<option value="true" <?php if($logo_showcase_columns_show_hide_navigation=='true') echo "selected"; ?> >True</option>				
									<option value="false" <?php if($logo_showcase_columns_show_hide_navigation=='false') echo "selected"; ?> >False</option>				
								</select><br/>
								<span class="tp_accordions_pro_hint">Show/Hide Navigation. <span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_hide_navigation_position"><?php echo __('Navigation Position:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_show_hide_navigation_position">
									<option value="default" <?php if($logo_showcase_columns_show_hide_navigation_position=='default') echo "selected"; ?> >Default</option>				
									<option value="topright" <?php if($logo_showcase_columns_show_hide_navigation_position=='topright') echo "selected"; ?> >Top Right</option>				
									<option value="topleft" <?php if($logo_showcase_columns_show_hide_navigation_position=='topleft') echo "selected"; ?> >Top Left</option>				
									<option value="topcenter" <?php if($logo_showcase_columns_show_hide_navigation_position=='topcenter') echo "selected"; ?> >Top Center</option>				
									<option value="bottomright" <?php if($logo_showcase_columns_show_hide_navigation_position=='bottomright') echo "selected"; ?> >Bottom Left</option>				
									<option value="bottomleft" <?php if($logo_showcase_columns_show_hide_navigation_position=='bottomleft') echo "selected"; ?> >Bottom Left</option>				
								</select><br/>
								<span class="tp_accordions_pro_hint">Select Navigation Position. <span class="only_pro_v">(Only Pro Version)</span></span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_hide_grayscale"><?php echo __('Grayscale Style:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_show_hide_grayscale">
									<option value="0" <?php if($logo_showcase_columns_show_hide_grayscale=='0') echo "selected"; ?> >Disable Grayscale</option>		
									<option value="100" <?php if($logo_showcase_columns_show_hide_grayscale=='100') echo "selected"; ?> >Enable Grayscale</option>
								</select><br/>
								<span class="tp_accordions_pro_hint">Set if you want to display the grayscale or not.<span class="only_pro_v">(Only Pro Version)</span> </span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row"><label style="padding-left:10px;" for="logo_showcase_columns_show_hide_tooltips"><?php echo __('Tooltip:', 'logoshowcase'); ?></label></th>
								<td style="vertical-align:middle;">
								<select class="timezone_string" name="logo_showcase_columns_show_hide_tooltips">
									<option value="block" <?php if($logo_showcase_columns_show_hide_tooltips=='block') echo "selected"; ?> >Enable Tooltip</option>		
									<option value="none" <?php if($logo_showcase_columns_show_hide_tooltips=='none') echo "selected"; ?> >Disable Tooltip</option>
								</select><br/>
								<span class="tp_accordions_pro_hint">Set if you want to display the Tooltip or not.<span class="only_pro_v">(Only Pro Version)</span> </span>
								</td>
							</tr>							
							
						</table>		
					</div>
				</div>
				<div id="tab-2" class="tab-content">	
					<div id="meta_inner">
						<div class="tp-accordions-pro-shortcodes">
							<h2><?php _e('Shortcodes', 'logoshowcase');?></h2>
							<p><?php _e('Use following shortcode to display the Logo Showcase anywhere:', 'logoshowcase');?></p>
							<textarea cols="30" rows="1" onClick="this.select();">[logo_showcase <?php echo 'id="'.$post->ID.'"';?>]</textarea>
							
							<p><?php _e('If you need to put the shortcode in theme file use this:', 'logoshowcase');?></p>            
							<textarea cols="54" rows="1" onClick="this.select();"><?php echo '<?php echo do_shortcode("[logo_showcase id='; echo "'".$post->ID."']"; echo '");?>';?></textarea>
						
						</div>
					</div>
				</div>
				
				
				
				
				
			</div>
		</div>	
				<?php

	}

	
	
	/*==========================================================================
		When the post is saved, saves our custom data
	==========================================================================*/	

	function logo_showcase_wordpress_save_postdata( $post_id ) {
		// verify if this is an auto save routine. 
		// If it is our form has not been submitted, so we dont want to do anything
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
			return $post_id;

		// verify this came from the our screen and with proper authorization,
		// because save_post can be triggered at other times
		if ( !isset( $_POST['logo_showcase_wordpress_dynamicMeta_noncename'] ) )
			return;

		if ( !wp_verify_nonce( $_POST['logo_showcase_wordpress_dynamicMeta_noncename'], plugin_basename( __FILE__ ) ) )
			return;

		// OK, we're authenticated: we need to find and save the data


		$logo_showcase_columns_post_themes = sanitize_text_field( $_POST['logo_showcase_columns_post_themes'] );
		$logo_showcase_columns_show_hide_pagination = sanitize_text_field( $_POST['logo_showcase_columns_show_hide_pagination'] );
		$logo_showcase_columns_style_pagination = sanitize_text_field( $_POST['logo_showcase_columns_style_pagination'] );
		$logo_showcase_columns_show_hide_pagination_position = sanitize_text_field( $_POST['logo_showcase_columns_show_hide_pagination_position'] );
		$logo_showcase_columns_show_hide_navigation = sanitize_text_field( $_POST['logo_showcase_columns_show_hide_navigation'] );
		$logo_showcase_columns_show_hide_grayscale = sanitize_text_field( $_POST['logo_showcase_columns_show_hide_grayscale'] );
		$logo_showcase_columns_border_color = sanitize_text_field( $_POST['logo_showcase_columns_border_color'] );
		$logo_showcase_columns_border_hover_color = sanitize_text_field( $_POST['logo_showcase_columns_border_hover_color'] );
		$logo_showcase_columns_show_items = sanitize_text_field( $_POST['logo_showcase_columns_show_items'] );
		$logo_showcase_free_show_title_hide = sanitize_text_field( $_POST['logo_showcase_free_show_title_hide'] );
		$logo_showcase_columns_title_position = sanitize_text_field( $_POST['logo_showcase_columns_title_position'] );
		$logo_showcase_columns_title_font_color = sanitize_text_field( $_POST['logo_showcase_columns_title_font_color'] );
		$logo_showcase_columns_show_slide_speed = sanitize_text_field( $_POST['logo_showcase_columns_show_slide_speed'] );
		$logo_showcase_columns_show_auto_play = sanitize_text_field( $_POST['logo_showcase_columns_show_auto_play'] );
		$logo_showcase_columns_show_stop_hover_play = sanitize_text_field( $_POST['logo_showcase_columns_show_stop_hover_play'] );
		$logo_showcase_columns_show_hide_navigation_position = sanitize_text_field( $_POST['logo_showcase_columns_show_hide_navigation_position'] );
		
		
		update_post_meta( $post_id, 'logo_showcase_columns_show_hide_pagination', $logo_showcase_columns_show_hide_pagination );
		update_post_meta( $post_id, 'logo_showcase_columns_style_pagination', $logo_showcase_columns_style_pagination );
		update_post_meta( $post_id, 'logo_showcase_columns_show_hide_pagination_position', $logo_showcase_columns_show_hide_pagination_position );
		update_post_meta( $post_id, 'logo_showcase_columns_show_hide_navigation', $logo_showcase_columns_show_hide_navigation );
		update_post_meta( $post_id, 'logo_showcase_columns_show_hide_grayscale', $logo_showcase_columns_show_hide_grayscale );
		update_post_meta( $post_id, 'logo_showcase_columns_show_hide_tooltips', $logo_showcase_columns_show_hide_tooltips );
		update_post_meta( $post_id, 'logo_showcase_columns_post_themes', $logo_showcase_columns_post_themes );
		update_post_meta( $post_id, 'logo_showcase_columns_border_color', $logo_showcase_columns_border_color );
		update_post_meta( $post_id, 'logo_showcase_columns_border_hover_color', $logo_showcase_columns_border_hover_color );
		update_post_meta( $post_id, 'logo_showcase_columns_show_items', $logo_showcase_columns_show_items );
		update_post_meta( $post_id, 'logo_showcase_free_show_title_hide', $logo_showcase_free_show_title_hide );
		update_post_meta( $post_id, 'logo_showcase_columns_title_position', $logo_showcase_columns_title_position );
		update_post_meta( $post_id, 'logo_showcase_columns_title_font_color', $logo_showcase_columns_title_font_color );
		update_post_meta( $post_id, 'logo_showcase_columns_show_slide_speed', $logo_showcase_columns_show_slide_speed );
		update_post_meta( $post_id, 'logo_showcase_columns_show_auto_play', $logo_showcase_columns_show_auto_play );
		update_post_meta( $post_id, 'logo_showcase_columns_show_stop_hover_play', $logo_showcase_columns_show_stop_hover_play );
		update_post_meta( $post_id, 'logo_showcase_columns_show_hide_navigation_position', $logo_showcase_columns_show_hide_navigation_position );
		
		
	}


	