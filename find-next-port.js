#! /usr/bin/node

var apacheconf = require('apacheconf'),
    walk = require('walk');

var ports = [];

var walker = walk.walk('/etc/apache2/sites-enabled/', {
  followLinks: true
});

walker.on('file', function(root, stat, next) {
  var file = root + stat.name;

  apacheconf(file, function(error, conf, parser) {
    if (error) throw error;

    ports.push(parseInt(conf.Listen[0]));

    next();
  });

});

walker.on('end', function() {
  ports.sort();
  var nextPort = ports[ports.length - 1] + 1;
  console.log('Next available port is: ' + nextPort);
});
