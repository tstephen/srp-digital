# Posts or pages on home page?
`index.php` provides the grid of post thumbnails. Inside it uses have_posts to iterate the posts. There is no such thing as have_pages (see https://wordpress.org/support/topic/calling-pages-instead-of-posts/ for commentary). 

Hence used posts on home page. To avoid them having a date on, mark them as 'sticky'. Fursther customisation would be possible by overriding the boardwalk_entry_meta function in boardwalk/inc/template_tags.php
