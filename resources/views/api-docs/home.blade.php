<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <title>Dashboard info</title>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd;">
        <a class="navbar-brand" href="#">Wishlist app APIs</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="/api/v1/dashboard">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/api/v1/products">Wishlist</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/api/v1/customers">Customers</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/api/v1/configure-theme-api-docs">Configure-theme</a>
            </li>
          </ul>
        </div>
      </nav>
    <br>
    <h2>Dashboard data</h2>
    <h3>
        <span class="badge badge-primary mr-1">GET</span><span class="badge badge-secondary">/api/v1/dashboard</span>
    </h3>
    <h5><i>Response: <b>200</b></i></h5>
    <hr>
    <pre><code id=api></code></pre>
</body>
<script>
/**
 * Pretty Print JSON Objects.
 * Inspired by http://jsfiddle.net/unLSJ/
 *
 * @return {string}    html string of the formatted JS object
 * @example:  var obj = {"foo":"bar"};  obj.prettyPrint();
 */
Object.prototype.prettyPrint = function(){
    var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
    var replacer = function(match, pIndent, pKey, pVal, pEnd) {
        var key = '<span class="json-key" style="color: brown">',
            val = '<span class="json-value" style="color: navy">',
            str = '<span class="json-string" style="color: olive">',
            r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    };

    return JSON.stringify(this, null, 3)
               .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
               .replace(/</g, '&lt;').replace(/>/g, '&gt;')
               .replace(jsonLine, replacer);
}


var account = {!! json_encode($dashboard_data) !!};

document.getElementById('api').innerHTML = account.prettyPrint();

  </script>
  <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</html>