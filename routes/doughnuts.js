exports.register = function (server, options, next) {
  server.route([
    { // INDEX. Get all
      method: 'GET',
      path: '/doughnuts',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('doughnuts').find().toArray(function (err, results) {
          if (err) { return reply(err); }

          reply.view('doughnuts/index', {doughnuts: results});
        });
      }
    },
    { // SHOW. Get 1
      method: 'GET',
      path: '/doughnuts/{id}',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        var id = ObjectID(request.params.id);

        db.collection('doughnuts').findOne({"_id": id}, function (err, doughnut) {
          if (err) { return reply(err); }

          console.log(doughnut);

          reply.view('doughnuts/show', {doughnut: doughnut});
        });
      }
    },
    { // CREATE. Create new
      method: 'POST',
      path: '/doughnuts',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var style = request.payload.style;
        var flavor = request.payload.flavor;

        db.collection('doughnuts').insert({style: style, flavor: flavor}, function (err, doc) {
          if (err) { return reply(err); }

          reply.redirect('/doughnuts');
        });
      }
    },
    { // DESTROY. Delete 1
      method: 'POST',
      path: '/doughnuts/{id}/destroy',
      handler: function (request, reply) {
        var db       = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        var id = ObjectID(request.params.id);

        db.collection('doughnuts').remove({"_id": id}, function (err, doc) {
          if (err) { return reply(err); }
          reply.redirect('/doughnuts');
        });
      }
    },
    { // UPDATE. Update 1
      method: 'POST',
      path: '/doughnuts/{id}/update',
      handler: function (request, reply) {
        var db       = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        var id = ObjectID(request.params.id);
        var style = request.payload.style;
        var flavor = request.payload.flavor;

        db.collection('doughnuts').findOneAndUpdate(
          {"_id": id},
          {style: style, flavor: flavor},
          function (err, doc) {
            if (err) { return reply(err); }

            reply.redirect('/doughnuts/' + id );
          }
        );
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'doughnuts-api',
  version: '0.0.1'
};