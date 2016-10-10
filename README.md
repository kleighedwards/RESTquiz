Skill Distillery Week 12 Project

Taking Quizzes using REST API and JavaScript\

Project Overview

	Allow the user to take a variety of quizzes and see their score upon completion.

	Upon launching the program, the user is shown a table with three available quizzes to take. 

	If the user selects the “Take” option, they will be shown the questions and answer options for that particular quiz. The user may click the “Submit” button at the bottom of the page once they have completed the quiz and see the percentage of correct answers they chose. 

	These scores are persisted in the database and may be viewed when selecting the “View” option from the list of quizzes. Selecting the “View” option will show the user all the scores associated with that particular quiz. As this program has no login functionality, the user is defaulted to the “testUser”.

	If the user selects the “Edit” option, they may change the name of a quiz. 

	If the user selects the “Delete” option, that quiz is removed from the table and from the database.

	The user may also choose to create a new quiz. This option, however, only allows users to name a new quiz. There is no functionality to add questions and answers to this new quiz at this time. 

Stumbling Blocks

	My code became repetitious quite quickly. I am not yet comfortable with how XMLHttpRequests work within JavaScript, so I was reluctant to break my monolithic functions into something more succinct for fear of breaking functionality. 

	I also ran into a great deal of issues persisting a score in my database due to foreign key constraints with a required User object. I was unable to pass a User object (or even a 		User ID) in my JSON  to persist the scores. I ultimately made the User a JSONBackReference to work around this issue. However, this meant I was unable to retrieve User data when retrieving Scores.
