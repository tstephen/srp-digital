<?php

function Logo_Showcase_wordpress_table_body($postid){
	
		$featuress = get_post_meta( $postid, 'logo_showcase_columns');
		$logo_showcase_columns_post_themes = get_post_meta( $postid, 'logo_showcase_columns_post_themes', true );
		$logo_showcase_columns_border_color = get_post_meta( $postid, 'logo_showcase_columns_border_color', true );
		$logo_showcase_columns_border_hover_color = get_post_meta( $postid, 'logo_showcase_columns_border_hover_color', true );
		$logo_showcase_columns_show_items = get_post_meta( $postid, 'logo_showcase_columns_show_items', true );
		$logo_showcase_free_show_title_hide = get_post_meta( $postid, 'logo_showcase_free_show_title_hide', true );
		$logo_showcase_columns_show_hide_pagination = get_post_meta( $postid, 'logo_showcase_columns_show_hide_pagination', true );
		$logo_showcase_columns_show_hide_navigation = get_post_meta( $postid, 'logo_showcase_columns_show_hide_navigation', true );
		
		
		// content
		$tp_accordions_table_field_content_font_color = get_post_meta( $postid, 'tp_accordions_table_field_content_font_color', true );
		$tp_accordions_table_field_content_font_size = get_post_meta( $postid, 'tp_accordions_table_field_content_font_size', true );
		$tp_accordions_table_field_content_bg_color = get_post_meta( $postid, 'tp_accordions_table_field_content_bg_color', true );

		
		
		
		
		if($logo_showcase_columns_post_themes=="theme1")
			
			{
			$logo_showcase_columns_border_color = get_post_meta( $postid, 'logo_showcase_columns_border_color', true );
			if(empty($logo_showcase_columns_border_color))
			{
				$logo_showcase_columns_border_color = "#ddd";
			}
			$logo_showcase_columns_show_items = get_post_meta( $postid, 'logo_showcase_columns_show_items', true );
			if(empty($logo_showcase_columns_show_items))
			{
				$logo_showcase_columns_show_items = "5";
			}					
				
				
				?>
				<?php $rndn = rand(1,1000); ?>
				<?php
				$logotesting ='';
					$logotesting.='<div class="logo-showcase-free-area">';
						$logotesting.='<div id="logo-showcase-wordpress_'.$rndn.'" class="owl-carousel">';
						foreach ($featuress as $feature) {
							$img = wp_get_attachment_image( $feature['logo_showcase_uploader'], 'thumb-full', false );
							$logotesting.='<div class="lsw_logo_container">';
								$logotesting.='<div class="lsw_container">';
								$logotesting.='<a class="lsw_logo_link" href="'.$feature['logo_showcase_link_url'].'" target="'.$feature['logo_showcase_link_target'].'">'.$img.'
								</a>
								<span class="" style="display:'.$logo_showcase_free_show_title_hide.'">'.$feature['logo_showcase_title'].'</span>								
								';
								$logotesting.='</div>';
							$logotesting.='</div>';
						};
						$logotesting.='</div>';			
				
						$logotesting.='
							<style type="text/css">
								.lsw_logo_container {
								  margin: 6px;
								};
								.lsw_logo_container .lsw_container img {
								  border-radius: 0;
								  box-shadow: none;
								  display: block;
								  margin: 0 auto;
								  transition: all 0.22s linear 0s;
								}

								.lsw_logo_container a.lsw_logo_link {
								  display: block;
								  padding: 6px;
								  transition: all 0.3s linear 0s;
								  box-shadow: none;
								}
								#logo-showcase-wordpress_'.$rndn.' .lsw_logo_container a.lsw_logo_link {
								  border: 1px solid '.$logo_showcase_columns_border_color.';
								}
								#logo-showcase-wordpress_'.$rndn.' .lsw_logo_container a.lsw_logo_link:hover {
								  border: 1px solid '.$logo_showcase_columns_border_hover_color.';
								}								
								#logo-showcase-wordpress_'.$rndn.' .owl-controls .owl-buttons{
								  position: absolute;
								  right: 0;
								  top: -34px;
								}
								#logo-showcase-wordpress_'.$rndn.'.owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span {
								  opacity: 1;
								}								
								#logo-showcase-wordpress_'.$rndn.' .owl-controls .owl-buttons div {
								  background: transparent none repeat scroll 0 0;
								  border: 1px solid '.$logo_showcase_columns_border_color.';
								  border-radius: 1px;
								  color: '.$logo_showcase_columns_border_color.';
								  font-size: 22px;
								  height: 27px;
								  line-height: 23px;
								  margin: 2px;
								  opacity: 1;
								  padding: 0;
								  transition: all 0.3s linear 0s;
								  width: 27px;
								  z-index: 999;
								}
								#logo-showcase-wordpress_'.$rndn.'.owl-theme .owl-controls .owl-page span {
								  background: '.$logo_showcase_columns_border_color.' none repeat scroll 0 0;
								  border-radius: 20px;
								  display: block;
								  height: 12px;
								  margin: 5px 7px;
								  opacity: 0.5;
								  width: 12px;
								}								
							</style>
						';				
						$logotesting.='
							<script type="text/javascript">
								jQuery(document).ready(function($) {

								  $("#logo-showcase-wordpress_'.$rndn.'").owlCarousel({

									autoPlay: true,
									items : '.$logo_showcase_columns_show_items.',
									itemsTablet : [768, 3],
									itemsMobile : [479, 2],
									pagination : true,
									navigation : false,
									navigationText : ["‹","›"],	
									slideSpeed: 1000,

								  });

								});				
							</script>
						';				
				
					$logotesting.='</div>';
				
				return $logotesting;
			}
		else
			{
            
            echo 'Nothing Found!!';

			}

}

?>