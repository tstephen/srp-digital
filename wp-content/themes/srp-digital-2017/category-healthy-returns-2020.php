<?php get_header(); ?>

<div class="container">
  <div class="row">
    <div class="col-md-4 col-xs-12">
      <img class="img-responsive" src="/wp-content/uploads/2017/02/SDU-logo1.jpg"/>
    </div>
    <div class="col-md-4 col-xs-12">
      <img class="img-responsive" src="/wp-content/uploads/2017/11/EEVS-supporter-logo.jpg"/>
    </div>
    <div class="col-md-4 col-xs-12">
      <img class="img-responsive" src="/wp-content/uploads/2017/12/puffin-digital-healthy-returns-supporter-logo.png"/>
    </div>
  </div><!-- /.row -->

  <div class="row">
    <div class="col-xs-12 col-sm-12">
      <div id="content" role="main" style="min-height: 150px;">
        
    <article role="article" class="page type-page status-publish">
        <header>
            <h1>Healthy Returns by 2020: health and social care carbon and cost benefit curve</h1>
        </header>
        <p>Welcome to the online tool for carbon and cost saving for the NHS, public health and social care system. Savings presented here have been calculated for the health and care sector in England using existing case studies and research evidence with an assumption of moderate implementation in five years.</p>
<p><span style="text-decoration: underline;">Please note:</span> <em>This resource is intended to provide an overview of carbon and cost reduction opportunities, as well as a framework within which users can develop their own analysis. The figures are derived from specific case studies and as such will not be equally applicable for every organisation. Developing local business cases will require local technical and economic assessments. This tool identifies the potential opportunities, interventions to investigate and scale of savings and is not a substitute for the usual financial analysis required to assemble a case for investment.</em></p>
            </article>
      </div><!-- /#content -->
    </div>
  </div><!-- /.row -->

  </div><!-- /.container -->

  <div class="showcase">
    <?php if ( have_posts() ) : ?>
      <?php while ( have_posts() ) : the_post(); /* Start the Loop */ ?>

        <div class="row">
          <div class="col-xs-4 featured-img">
            <?php the_post_thumbnail('post-thumbnail', ['class' => 'img-circle img-responsive', 'title' => 'Feature image']) ?>
          </div>
          <div class="col-xs-8">
            <h3><a href="<?php the_permalink(); ?>"><?php the_title() ; ?></a></h3>
            <?php the_excerpt() ; ?>
          </div>
        </div>

      <?php endwhile; ?>
    <?php endif; ?>
  </div>

<div class="row footer-supporter-area" style="clear:both">
  <div class="container">
     <div class="col-sm-4"><h4>SDU</h4>			<div class="textwidget"><p>We support the NHS, public health and social care to embed and promote the three elements of sustainable development - environmental, social and financial. </p>
<p>The Unit is jointly funded by, and accountable to, NHS England and Public Health England to ensure that the health and care system fulfils its potential as a leading sustainable and low carbon service.</p>
<p><a href="//www.sduhealth.org.uk">www.sduhealth.org.uk</a></p>
    </div>
</div>
<div class="col-sm-4"><h4>EEVS</h4>
  <div class="textwidget"><p>EEVS is the UK’s leading provider of performance assurance, analysis and information services in relation to energy efficiency. As well as working with clients to develop performance governance and management strategies for larger schemes, since 2011 EEVS has evaluated the performance of over 400 individual energy and carbon saving investments to the global good practice standard, IPMVP.</p>
    <p><a href="//www.eevs.co.uk/">www.eevs.co.uk</a></p>
  </div>
</div>
<div class="col-sm-4"><h4>Puffin Digital</h4>
  <div class="textwidget"><p>Puffin Digital is a UK based provider of supply chain sustainability software to the Health sector.</p>
  <p>We have a decade of experience designing and managing systems to anlyse, measure and reduce a range of social and environmental impacts of organisations just like yours.</p>
  <p><a href="/puffin-digital/">Contact Us</a></p>
  </div>
</div>
</div>

<script type='text/javascript' src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script>
<link rel='stylesheet' id='bootstrap-css-css'  href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' type='text/css' media='all' />
<link rel='stylesheet' id='healthy-css'  href='/wp-content/themes/srp-digital-2017/css/healthy.css' type='text/css' media='all' />

<?php get_sidebar(); ?>
<?php get_footer(); ?>
