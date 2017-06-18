<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link type="text/css" rel="stylesheet" href="static/css/bootstrap.css">
    <link type="text/css" rel="stylesheet" href="static/css/bootstrap.min.css">
    <link type="text/css" rel="stylesheet" href="static/css/carbosem.css">
    <link rel="shortcut icon" href="static/image/favicon.ico" type="image/x-icon" />
    <link rel="icon" href="static/image/favicon.ico" type="image/x-icon" />
    <meta property="og:title" content="CarboSem" />
    <meta property="og:description" content="Carbon Semantics" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://carbosem.herokuapp.com/" />
    <meta property="og:image" content="static/image/logo.png" />
    <script type="text/javascript" src="static/js/jquery-3.2.1.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script type="text/javascript" src="static/js/carbosem.js"></script>
    <script type="text/javascript" src="static/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="static/js/bootstrap.js"></script>
    <title>Carbon Semantics</title>
</head>

<body>

    <nav class="navbar-inverse">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#targetNavBar">
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>                        
                </button>
            <a class="navbar-brand" href="/">Carbon Semantics</a>
        </div>
        <div class="collapse navbar-collapse" id="targetNavBar">
            <form role="search" class="navbar-form navbar-left" id="search">
                <div class="form-group">
                    <input type="text" value="" placeholder="Search for Sequences" class="form-control" name="search">
                    <button class="btn btn-primary" type="submit">Search</button>
                </div>
            </form>
        </div>
    </nav>
    <canvas></canvas>
    <footer class="footer-text navbar-inverse navbar-fixed-bottom">Copyright &copy; 2017 Aly Shmahell</footer>
</body>

</html>
