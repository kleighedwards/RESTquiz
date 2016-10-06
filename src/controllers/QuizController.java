package controllers;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import data.QuizDAO;
import entities.Question;
import entities.Quiz;
import entities.Score;

@RestController
public class QuizController {

	@Autowired
	private QuizDAO quizDAO;

	// Test Connection Successful
	@RequestMapping(path = "/marco", method = RequestMethod.GET)
	public String ping() {
		return "polo";
	}

	// Returns All Quizzes
	@RequestMapping(path = "quizes", method = RequestMethod.GET)
	public List<Quiz> index() {
		return quizDAO.index();
	}

	// Returns A Single Quiz With The Provided ID
	@RequestMapping(path = "quizes/{id}", method = RequestMethod.GET)
	public Quiz show(@PathVariable int id) {
		return quizDAO.show(id);
	}

	// Adds A New Quiz
	@RequestMapping(path = "quizes", method = RequestMethod.POST)
	public void create(@RequestBody String jsonQuiz, HttpServletResponse response) {
		ObjectMapper mapper = new ObjectMapper();
		Quiz newQuiz = null;

		try {
			newQuiz = mapper.readValue(jsonQuiz, Quiz.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		response.setStatus(201);
		quizDAO.create(newQuiz);
	}
	
	// Delete A Quiz By ID
	@RequestMapping(path = "quizes/{id}", method = RequestMethod.DELETE)
	public void deleteQuiz(@PathVariable int id) {
		try {
			quizDAO.destroy(id);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// Edit A Quiz By ID
	@RequestMapping(path = "quizes/{id}", method = RequestMethod.PUT)
	public Quiz updateQuiz(@PathVariable int id, @RequestBody String jsonQuiz) {
		ObjectMapper mapper = new ObjectMapper();
		Quiz editQuiz = null;

		try {
			editQuiz = mapper.readValue(jsonQuiz, Quiz.class);
			System.out.println(editQuiz);
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
		
		editQuiz = quizDAO.updateQuiz(id, editQuiz);
		return editQuiz;
	}
	
	// Get All Scores Associated With Quiz By ID
	@RequestMapping(path = "quizes/{id}/scores", method = RequestMethod.GET)
	public List<Score> indexScores(@PathVariable int id) {
		List<Score> scores = quizDAO.indexScores(id);
		
		return scores;
	}
	
	// Add A Question To A Quiz
	@RequestMapping(path = "quizes/{id}/questions", method = RequestMethod.POST)
	public void createQuestion(@RequestBody String jsonQuestion, HttpServletResponse response,
							   @PathVariable int id) {
		ObjectMapper mapper = new ObjectMapper();
		Question newQuestion = null;

		try {
			newQuestion = mapper.readValue(jsonQuestion, Question.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		response.setStatus(201);
		quizDAO.createQuestion(id, newQuestion);
	}
	
	//Delete A Question From A Quiz
	@RequestMapping(path = "quizes/{id}/questions/{q_id}", method = RequestMethod.DELETE)
	public void deleteQuestion(@PathVariable int id, @PathVariable int q_id) {
		try {
			quizDAO.destroyQuestion(id, q_id);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
}
