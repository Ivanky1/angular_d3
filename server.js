function Server() {}

Server.prototype.bootstrap = function(env) {
    this.express = require('express');
    this.app = this.express();
    this.clientRouter = this.express.Router();
    this.apiRouter = this.express.Router();
    this.env = env;

    this.app.disable('x-powered-by'); // Отключение версии сервера экспресс из браузера
    this.app.set('view engine', 'jade');
    this.app.set('view cache', env == 'production');


    this.setupRouting();

    this.app.listen(4731)
}

Server.prototype.setupRouting = function() {
    var path = require('path');

    this.app.use('/build', this.express.static(path.join(__dirname, 'build'), {
        maxAge: this.env == 'production' ? 31536000  : 0
    }));
    this.app.use('/vendor', this.express.static(path.join(__dirname, 'vendor'), {
        maxAge: this.env == 'production' ? 31536000  : 0
    }));

    this.apiRouter.get('/:dummy?*', function(req, res) {
        res.json({
            message: 'Welcome to Rest API',
            description: 'TEst!!!!'
        });
    })

    this.clientRouter.get('/', function(req, res) {
        res.render('index', {
           pageTitle: 'Главная страница'
        });
    })

    this.app.get('/partials/pallete', function (req, res) {
        res.render('partials/pallete');
    });

    this.app.get('/data', function(req, res) {
        res.json({
            "core.gear": [
                [8, 5, 9, 2,
                    {
                        innerRadius: 2.5,
                        outerRadius: 5
                    },
                    {
                        innerRadius: 2.5,
                        outerRadius: 8
                    }]
            ],

            // holeRadius, hHoleCount, vHoleCount
            "core.rect": [
                [2.5, 1, 1],
                [2.5, 2, 1],
                [2.5, 3, 1],
                [2.5, 4, 1],
                [2.5, 5, 1],
                [2.5, 2, 2],
                [2.5, 3, 3],
                [2.5, 4, 4]
            ],

            // outerHexSize, innerHexSize
            "core.screw": [
                [4, 2]
            ]
        })
    })

    this.app.use('/api', this.apiRouter);
    this.app.use('/', this.clientRouter);
}

var server = Object.create(Server.prototype);
server.bootstrap(process.env.NODE_ENV || 'development');

