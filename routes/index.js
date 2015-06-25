var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);

/*GET authos page.*/
router.get('/author', function(req,res){
	res.render('author',{title: 'Armando Loureiro López',foto1:'/images/foto.jpg'});
});

module.exports = router;
