//importamos el modelo preguta-respuesta, para poder acceder a la DB
var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye: quizId

exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{next(new Error('No existe quizId= ' + quizId));}
		}
	).catch(function(error) {next(error);});
};

//GET /quizes/question
exports.question = function(req,res){
	models.Quiz.findAll().success(function(quiz){
		res.render('quizes/question',{pregunta:quiz[0].pregunta});
	})
};

//GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.findAll().success(function(quiz){
		if(req.query.respuesta === quiz[0].respuesta){
			res.render('quizes/answer',{respuesta:'Correcto'});
		}else{
			res.render('quizes/answer',{respuesta:'Incorrecto'});	
		}
	})
};

//GET /quizes
exports.index=function(req,res){
	if(req.query.search !== undefined){		//Comprobamos si es la carga incial o 
																				//o una busqueda
		models.Quiz.findAll({where:["pregunta like ?",'%'+req.query.search.replace(" ","%")+'%']}).then(function(quizes){
		res.render('quizes/index',{quizes: quizes, errors: []});
	})
}else{
		models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index',{quizes: quizes, errors: []});
	})
}
};

//GET /quizes/:id
exports.show=function(req,res){
		res.render('quizes/show',{quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer=function(req,res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, 
		respuesta: resultado,
		errors: []});
};

//GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build( //build propiedad de sequelize crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tematica: "Temática"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build (req.body.quiz);
	
	quiz
		.validate()
		.then(
			function(err){
				if(err){
					res.render('quizes/new', {quiz: quiz, errors: err.errors});
				}else{
		//guarda en DB los campos pregunta y respuesta de quiz
				quiz
				.save({fields: ["pregunta","respuesta", "tematica"]})
				.then(function(){res.redirect('/quizes')})	//Redirección URL relativo, lista de preguntas
			}
		}
	);
};

//GET /quizes/:id/edit
exports.edit =  function(req, res){
	var quiz = req.quiz;	//autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//POST /quizes/update
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

		req.quiz
		.validate()
		.then(
			function(err){
				if(err){
					res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
				}else{
		//guarda en DB los campos pregunta y respuesta de quiz
				req.quiz
				.save({fields: ["pregunta","respuesta","tematica"]})
				.then(function(){res.redirect('/quizes')})	//Redirección URL relativo, lista de preguntas
			}
		}
	);
};

//DELETE /quizes/:id
exports.destroy = function(req,res) {
	req.quiz.destroy().then( function(){
		res.redirect('/quizes');	
	}).catch(function(error){next(error)});
};
