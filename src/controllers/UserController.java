package controllers;

import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import data.UserDAO;
import entities.Score;
import entities.User;

@RestController
public class UserController {

	@Autowired
	private UserDAO userDAO;

	// Ping Pong To Test Connection Successful
	@RequestMapping(path = "/ping", method = RequestMethod.GET)
	public String ping() {
		return "pong";
	}

	// Returns All User
	@RequestMapping(path = "users", method = RequestMethod.GET)
	public List<User> index() {
		return userDAO.index();
	}

	// Returns A Single User With The Provided ID
	@RequestMapping(path = "users/{id}", method = RequestMethod.GET)
	public User show(@PathVariable int id) {
		return userDAO.show(id);
	}

	// Adds A New User
	@RequestMapping(path = "users", method = RequestMethod.POST)
	public void create(@RequestBody String jsonUser, HttpServletResponse response) {
		ObjectMapper mapper = new ObjectMapper();
		User newUser = null;

		try {
			newUser = mapper.readValue(jsonUser, User.class);
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
		response.setStatus(201);
		userDAO.create(newUser);
	}
	
	// Edit A User
	@RequestMapping(path = "users/{id}", method = RequestMethod.PUT)
	public User update(@PathVariable int id, @RequestBody String jsonUser) {
		ObjectMapper mapper = new ObjectMapper();
		User editUser = null;

		try {
			editUser = mapper.readValue(jsonUser, User.class);
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
		
		editUser = userDAO.update(id, editUser);
		return editUser;
	}
	
	// Delete A User
	@RequestMapping(path = "users/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable int id) {
		
		try {
			userDAO.destroy(id);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// Post A New Score
	@RequestMapping(path = "users/{id}/scores/{q_id}", method = RequestMethod.POST) 
	public void createScore(@PathVariable int id, @PathVariable int q_id,
							@RequestBody String jsonScore) {
		ObjectMapper mapper = new ObjectMapper();
		Score newScore = null;

		try {
			newScore = mapper.readValue(jsonScore, Score.class);
		} 
		catch (Exception e) {
			System.out.println("****************************************");
			System.out.println("****************************************");
			System.out.println("ERROR!!!!!!!!");
			System.out.println("****************************************");
			e.printStackTrace();
		}
		userDAO.createScore(newScore, id, q_id);
	}
	
	@RequestMapping(path = "users/{id}/scores", method = RequestMethod.GET)
	public Collection<Score> getScoresForUserById(@PathVariable("id") int id) {
		return userDAO.getScoresForUserById(id);
	}
	
}
