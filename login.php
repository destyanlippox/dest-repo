<!--Created by PhpStorm.-->
<!--User: Destyan Shorea-->
<!--Date: 6/1/2016-->
<!--Time: 1:31 PM-->

<?php include('includes/header.php');?>

<body class=" login">
<!-- BEGIN LOGO -->
<div class="logo">
    <a href="index.php"><img src="assets/pages/media/blog/logo-bsp.png" alt="Bee Solution Partners" /></a>
    <h2><span class="caption-subject font-white bold uppercase"><?php echo _('Project Management Information System');?></span></h2>
</div>
<!-- END LOGO -->
<!-- BEGIN LOGIN -->
<div class="content">
    <!-- BEGIN LOGIN FORM -->
    <form class="login-form" action="index.php" method="post">
        <h3 class="form-title">Login to your account</h3>
        <div class="alert alert-danger display-hide">
            <button class="close" data-close="alert"></button>
            <span> Enter any username and password. </span>
        </div>
        <div class="form-group">
            <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
            <label class="control-label visible-ie8 visible-ie9">Username</label>
            <div class="input-icon">
                <i class="fa fa-user"></i>
                <input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="Username" id="userName" name="username" autofocus /> </div>
        </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Password</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="Password" name="password" /> </div>
        </div>
        <div class="form-actions">
            <label class="checkbox">
                <input type="checkbox" name="remember" value="1" /> Remember me </label>
            <button type="submit" class="btn green pull-right"> Login </button>
        </div>

        <div>
            <h4><a href="javascript:;" id="forget-password"><span class="font-grey bold"> Forgot your password ? </span></a></h4>
        </div>
        <div class="create-account">
            <p>
            </p>
        </div>
    </form>
    <!-- END LOGIN FORM -->
    <!-- BEGIN FORGOT PASSWORD FORM -->
    <form class="forget-form" action="index.php" method="post">
        <h3>Forget Password ?</h3>
        <p> Enter your e-mail address below to reset your password. </p>
        <div class="form-group">
            <div class="input-icon">
                <i class="fa fa-envelope"></i>
                <input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="Email" name="email" id="fMail"/> </div>
        </div>
        <div class="form-actions">
            <button type="button" id="back-btn" class="btn red btn-outline">Back </button>
            <button type="submit" class="btn green pull-right"> Submit </button>
        </div>
    </form>
    <!-- END FORGOT PASSWORD FORM -->
    <!-- BEGIN REGISTRATION FORM -->
    <form >
    </form>
    <!-- END REGISTRATION FORM -->
</div>
<!-- END LOGIN -->

<p>
</p>
<?php include('includes/footer.php');?>