var http = require('http');
var pg = require('pg');

var conString = "postgres://dmac@127.0.0.1";

var server = http.createServer(function(req, res) {

  // get a pg client from the connection pool
  pg.connect(conString, function(err, client, done) {

    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;

      // An error occurred, remove the client from the connection pool.
      // A truthy value passed to done will remove the connection from the pool
      // instead of simply returning it to be reused.
      // In this case, if we have successfully received a client (truthy)
      // then it will be removed from the pool.
      done(client);
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };

  

      // get the race results for user
      client.query('SELECT (raceID) AS FROM results', function(err, result) {

        // handle an error from the query
        if(handleError(err)) return;

        // return the client to the connection pool for other requests to reuse
        done();
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('You are visitor number ' + result.rows[0].count);
      });
    });
  });
})

server.listen(3001)