<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link type="text/css" rel="stylesheet" href="static/css/bootstrap.css">
    <link type="text/css" rel="stylesheet" href="static/css/carbosem.css">
    <link rel="shortcut icon" href="static/image/favicon.ico" type="image/x-icon" />
    <link rel="icon" href="static/image/favicon.ico" type="image/x-icon" />
    <meta property="og:title" content="CarboSem" />
    <meta property="og:description" content="Carbon Semantics" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://carbosem.herokuapp.com/" />
    <meta property="og:image" content="static/image/logo.png" />
    <script type="text/javascript" src="static/js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="static/js/d3.v3.min.js"></script>
    <script type="text/javascript" src="static/js/carbosem.js"></script>
    <title>Carbon Semantics</title>
</head>

<body>
    <div role="navigation" class="container-fluid well navbar navbar-default navbar-static-top nav-container" id="container">
        <form role="search" class="form-inline" id="search">
            <div class="form-group">
                <input type="text" value="" placeholder="Search for MicroRNA" class="form-control" name="search">
                <button class="btn btn-default" type="submit">Search</button>
            </div>
        </form>
    </div>
    <div id="graph">
    </div>
    <div class="container-fluid well navbar navbar-default navbar-fixed-bottom nav-container">
         <footer>Copyright &copy; 2017 Aly Shmahell</footer>
    </div>
</body>

</html>
