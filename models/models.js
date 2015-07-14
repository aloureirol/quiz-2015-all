//models.js construye la DB importando el modelo de quiz.js
//sequelize.sync() construye la DB según define el modelo

var path = require('path');

//Postgress DATABASE_URL = postgress://user:passwd@host:port/database
//SQLite    DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	= (url[6]||null);
var user	= (url[2]||null);
var pwd		= (url[3]||null);
var protocol	= (url[1]||null);
var dialect	= (url[1]||null);
var port	= (url[5]||null);
var host	= (url[4]||null);
var storage	= process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar DB SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
		{dialect:	protocol,
		protocol:	protocol,
		port:		port,
		host:		host,
		storage:	storage, //solo SQLite (.env)
		omitNull:	true	//Solo Postgtree
		}
		);

//Imporar la definición de la table Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //exportar definición de tabla Quiz

//creamos e inicializamos la tabla de preguntas en DB
sequelize.sync().then(function(){
	//succes(..) antes ahora then(..) ejecuta el manejador una vez creada 		//la tabla
	Quiz.count().then(function(count){
		if(count===0){ //La tabla se inicializa solo si está vacía
			Quiz.create({pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			});
			Quiz.create({pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa'
			})
			.success(function(){console.log('DB Inicializada');
					console.log('Servidor iniciado en el puerto 5000');});
		};	
	});
});
