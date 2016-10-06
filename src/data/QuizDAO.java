package data;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import entities.Question;
import entities.Quiz;
import entities.Score;

@Transactional
public class QuizDAO {

	@PersistenceContext
	private EntityManager em;

	// Get All Quizzes
	public List<Quiz> index() {
		String query = "Select q from Quiz q";
		List<Quiz> quizes = em.createQuery(query, Quiz.class).getResultList();
		return quizes;
	}

	// Get Quiz By ID
	public Quiz show(int id) {
		return em.find(Quiz.class, id);
	}

	// Add New Quiz
	public void create(Quiz quiz) {
		em.persist(quiz);
		em.flush();
	}

	// Delete Quiz
	public void destroy(int id) {
		Quiz deleteQuiz = em.find(Quiz.class, id);

		String query = "Select s from Score s " 
				+ "JOIN Quiz q ON s.quiz_id = q.id " + "WHERE q.id = ?1";
		List<Score> scores = em.createQuery(query, Score.class).setParameter(1, id).getResultList();

		for (Score score : scores) {
			em.remove(score);
		}

		em.remove(deleteQuiz);
	}

	// Edit Quiz
	public Quiz updateQuiz(int id, Quiz quiz) {
		Quiz editQuiz = em.find(Quiz.class, id);
		System.out.println("Managed: " + editQuiz);
		System.out.println("Managed ID: " + editQuiz.getId());
		System.out.println("Unmanaged JSON object: " + quiz);
		System.out.println("Unmanaged JSON ID: " + quiz.getId());
		// Update Name
		editQuiz.setName(quiz.getName());

		em.persist(editQuiz);

		return editQuiz;
	}

	// Get All Scores Associated With A Quiz
	public List<Score> indexScores(int id) {
		String query = "Select s from Score s " + "JOIN Quiz q ON s.quiz_id = q.id " + "WHERE q.id = ?1";
		List<Score> scores = em.createQuery(query, Score.class).setParameter(1, id).getResultList();

		return scores;
	}

	// Add A New Question (And Associated Answers)
	public void createQuestion(int id, Question question) {
		Quiz quiz = em.find(Quiz.class, id);
		question.setQuiz(quiz);

		em.persist(question);
		em.flush();
	}

	// Delete Quiz Question
	public void destroyQuestion(int id, int qId) {
		Quiz quiz = em.find(Quiz.class, id);
		Question deleteQuestion = em.find(Question.class, qId);

		quiz.getQuestions().remove(deleteQuestion);

		em.remove(deleteQuestion);
		em.flush();
	}
}
