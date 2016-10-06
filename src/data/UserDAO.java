package data;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import entities.User;

@Transactional
public class UserDAO {

	@PersistenceContext
	private EntityManager em;

	// Inject Autowired bCrypt Bean
	@Autowired
	BCryptPasswordEncoder passwordEncoder;

	// Get All Users
	public List<User> index() {
		String query = "Select u from User u";
		List<User> users = em.createQuery(query, User.class).getResultList();

		return users;
	}

	// Get User By ID
	public User show(int id) {
		return em.find(User.class, id);
	}

	// Add New User
	public void create(User user) {
		// Extract Raw Password
		String rawPassword = user.getPassword();
		// Encode Raw Password
		String encodedPassword = passwordEncoder.encode(rawPassword);
		// Reset the User's Password to the Encoded One
		user.setPassword(encodedPassword);
		// Persist the User
		em.persist(user);
		// Force EntityManager to Persist Immediately
		em.flush();
		// Return the Persisted User
	}

	// Edit User
	public User update(int id, User user) {
		User editUser = em.find(User.class, id);

		// Set New Username
		editUser.setUsername(user.getUsername());

		// Set New Password After Encryption
		String rawPassword = user.getPassword();
		String encodedPassword = passwordEncoder.encode(rawPassword);
		editUser.setPassword(encodedPassword);
		em.merge(editUser);

		return editUser;
	}

	// Delete User
	public void destroy(int id) {
		User deleteUser = em.find(User.class, id);

		em.remove(deleteUser);
	}
}
