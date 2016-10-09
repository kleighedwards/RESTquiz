var app = (function() {
	var module = {};
	module.tableBuilder = function(dataArr, location, headers, dataBuilderFunc) {
		var table = document.createElement("table");
		table.id = "quizTable";

		if (headers) {
			table.appendChild(createTableHeadersFromParameterArr(headers));
		} else {
			table.appendChild(createTableHeader(dataArr[0]));
		}

		if (dataBuilderFunc) {
			table.appendChild(dataBuilderFunc(dataArr));
		} else {
			table.appendChild(createTableBody(dataArr));
		}

		var containerDiv = document.getElementById(location);
		containerDiv.appendChild(table);
	};

	var createTableHeader = function(dataObj) {
		var thead = document.createElement("thead");
		var headRow = document.createElement("tr");
		for (header in dataObj) {
			var th = document.createElement("th");
			th.textContent = header;
			headRow.appendChild(th);
		}
		thead.appendChild(headRow);
		return thead;
	};

	var createTableHeadersFromParameterArr = function(headers) {
		var thead = document.createElement("thead");
		var headRow = document.createElement("tr");

		headers.forEach(function(value, index, array) {
			var th = document.createElement("th");
			th.textContent = value;
			headRow.appendChild(th);
		});

		thead.appendChild(headRow);
		return thead;
	}

	var createTableBody = function(dataArr) {
		var tbody = document.createElement("tbody");
		dataArr.forEach(function(data, index, arr) {
			var tr = document.createElement("tr");
			for (property in data) {
				var td = document.createElement("td");
				td.textContent = data[property];
				tr.appendChild(td);
			}

			tr.appendChild(makeButtonsForTableToTake(data));
			tr.appendChild(makeButtonsForTableToView(data));
			tr.appendChild(makeButtonsForTableToEdit(data));
			tr.appendChild(makeButtonsForTableToDelete(data));

			tbody.appendChild(tr);
		});
		return tbody;
	};

	module.makeButtonsForTableToTake = function(dataObj) {
		var td = document.createElement("td");
		var takeBtn = document.createElement("button");
		takeBtn.setAttribute("quiz_id", dataObj.id);
		takeBtn.textContent = "Take";

		takeBtn.addEventListener('click', function(e) {
			var quizId = e.target.getAttribute("quiz_id");
			console.log(quizId);
			module.ajax("GET", "http://localhost:8080/Quiz/api/quizes/"
					+ quizId, function(req) {
				// Allow User To Take Selected Quiz
				if (req.readyState === 4 && req.status < 400) {
					// Find Table And Create Button By Id And Remove From Dom
					var table = document.getElementById("quizTable");
					table.parentElement.removeChild(table);

					var createButton = document.getElementById("createQuizBtn");
					createButton.parentElement.removeChild(createButton);

					var quiz = dataObj;

					console.log("Printing Quiz");
					console.log(quiz);

					var name = quiz.name;
					// Create Header With Quiz Name
					var h1 = document.createElement("h1");
					h1.textContent = name;
					document.body.appendChild(h1);

					console.log("Printing Questions");
					console.log(quiz.questions);
					var questions = quiz.questions;

					var inputArray = [];
					var userInput = null;
					var totalScore = 0;
					var userId = 1;

					var questionForm = document.createElement("form");
					var submitForm = document.createElement("input");
					submitForm.setAttribute("type", "submit");
					submitForm.addEventListener("click", function(e) {
						var counter = 0;
						inputArray.forEach(function(correct, value, array) {
							if (correct === true) {
								counter++;
							}
						})
						totalScore = parseInt((counter / (inputArray.length)) * 100);
						console.log(totalScore);


						var obj = {
							value : totalScore,
							quizID : quizId
						};

						var jsonString = JSON.stringify(obj);

						var newXhr = new XMLHttpRequest();
						newXhr.open("POST", "http://localhost:8080/Quiz/api/users/"
								+ userId + "/scores/" + quizId);

						newXhr.setRequestHeader('Content-type', 'application/json');

						newXhr.onreadystatechange = function() {
							if (newXhr.readyState === 4 && newXhr.status < 400) {
								console.log(newXhr.status);
								console.log(newXhr.responseText);
							}
							if (newXhr.readyState === 4 && newXhr.status >= 400) {
								console.error(newXhr.status + ': '
										+ newXhr.responseText);
							}
						};
						newXhr.send(jsonString);

						alert("Your Score! " + totalScore +"%");
					})

					questions.forEach(function(question, index, array) {
						for (var variable in question) {
							if( variable === "questionText") {
								var questionText = document.createElement("p");
								questionText.textContent = question[variable];
								questionText.className = "questions";
								document.body.appendChild(questionText);

							} // Close If for questionText
							if( variable === "answers" ) {
								console.log("Printing Answers");
								console.log(question[variable]);

								question[variable].forEach(function(answer, index, array) {
									console.log(answer.answerText);

									var answerForm = document.createElement("form");
									var answerOpBtns = document.createElement("input");
									answerOpBtns.setAttribute("type", "radio");
									answerOpBtns.id = answer.id;
									answerOpBtns.value = answer;

									var answerOptions = document.createElement("span");
									answerOptions.textContent = answer.answerText;
									answerOptions.className = "answers";

									answerForm.appendChild(answerOpBtns);
									answerForm.appendChild(answerOptions);

									answerOpBtns.addEventListener("click", function(e) {
										userInput = answer.correct;
										console.log(userInput);
										inputArray.push(userInput);
										console.log(inputArray);

										console.log(e.target);
									})

									document.body.appendChild(answerForm);
									return

								}) // Close Answers For Each
							} // Close If Answers
						} // Close forIn
					}) // Close forEach
					questionForm.appendChild(submitForm);
					document.body.appendChild(questionForm);
				} //Close if (req.readyState ===4 )
			}) // Close module.ajax
		}); //Close takeBtn.addEventListener

		td.appendChild(takeBtn);
		return td;
	}; //Close viewBtn.addEventListener

	module.makeButtonsForTableToView = function(dataObj) {
		var td = document.createElement("td");
		var viewBtn = document.createElement("button");
		viewBtn.setAttribute("quiz_id", dataObj.id);
		viewBtn.textContent = "View";

		viewBtn.addEventListener('click', function(e) {
			var quizId = e.target.getAttribute("quiz_id");
			console.log(quizId);
			module.ajax("GET", "http://localhost:8080/Quiz/api/quizes/"
					+ quizId, function(req) {
				if (req.readyState === 4 && req.status < 400) {
					// Find Table By Id And Remove It From Dom
					var table = document.getElementById("quizTable");
					table.parentElement.removeChild(table);

					var createButton = document.getElementById("createQuizBtn");
					createButton.parentElement.removeChild(createButton);

					var h1 = document.createElement("h1");
					h1.textContent = dataObj.name;
					document.body.appendChild(h1);

					var userTable = document.createElement("table");
					var userHeader = document.createElement("thead");
					var userBody = document.createElement("tbody");

					var headerRow = document.createElement("tr");
					var username = document.createElement("th");
					username.textContent = "Username";
					var score = document.createElement("th");
					score.textContent = "Score";

					headerRow.appendChild(username);
					headerRow.appendChild(score);
					userHeader.appendChild(headerRow);
					userTable.appendChild(userHeader);

					var newXhr = new XMLHttpRequest();
					newXhr.open("GET", "http://localhost:8080/Quiz/api/quizes/"
					+ quizId + "/scores");

					newXhr.onreadystatechange = function() {
						if (newXhr.readyState === 4 && newXhr.status < 400) {
							console.log(newXhr.status);
							console.log(newXhr.responseText);
							var scoreArr = JSON.parse(newXhr.responseText);

							scoreArr.forEach(function(score, index, array) {
								var tr = document.createElement("tr");
								var td = document.createElement("td");
								var td2 = document.createElement("td");
								td.textContent = "testUser";
								td2.textContent = score.value;
								console.log(score);

								tr.appendChild(td);
								tr.appendChild(td2);
								userBody.appendChild(tr);
							})

							userTable.appendChild(userBody);
							document.body.appendChild(userTable);
						}
						if (newXhr.readyState === 4 && newXhr.status >= 400) {
							console.error(newXhr.status + ': '
									+ newXhr.responseText);
						}
					};
					newXhr.send(null);
				} //Close if (req.readyState ===4 )
			}) // Close module.ajax
		}); //Close viewBtn.addEventListener

		td.appendChild(viewBtn);
		return td;
	}; // Close module.makeButtonsForTableToView

	module.makeButtonsForTableToEdit = function(dataObj) {
		var td = document.createElement("td");
		var editBtn = document.createElement("button");
		editBtn.setAttribute("quiz_id", dataObj.id);
		editBtn.textContent = "Edit";

		editBtn.addEventListener('click', function(e) {
			var quizId = e.target.getAttribute("quiz_id");
			console.log(quizId);
			module.ajax("GET", "http://localhost:8080/Quiz/api/quizes/"
					+ quizId, function(req) {
				if (req.readyState === 4 && req.status < 400) {
					// Find Table By Id And Remove It From Dom
					var table = document.getElementById("quizTable");
					table.parentElement.removeChild(table);
					var createButton = document.getElementById("createQuizBtn");
					createButton.parentElement.removeChild(createButton);

					// Create A Form To Edit Quiz
					var editForm = document.createElement("form");
					editForm.id = "editForm";

					// Create An Input Field
					var quizName = document.createElement('input');
					quizName.name = 'quiz_name';
					quizName.id = 'quiz_name';
					quizName.type = 'text';
					quizName.placeholder = 'Quiz Name';

					editForm.appendChild(quizName);

					// Create A Submit Input
					var submit = document.createElement('input');
					submit.name = 'submitEdit';
					submit.name = 'submitEdit';
					submit.type = 'submit';
					submit.value = 'Edit Quiz Name';

					submit.addEventListener('click',
						function(e) {
							e.preventDefault();

							var form = e.target.parentElement;
							console.log(form.quiz_name.value);

							var obj = {
								name : form.quiz_name.value
							};
							var jsonString = JSON.stringify(obj);

							console.log(jsonString);

							var xhr = new XMLHttpRequest();
							xhr.open('PUT',
									'http://localhost:8080/Quiz/api/quizes/'
											+ quizId);

							// Let the server know what we are sending it
							xhr.setRequestHeader('Content-type',
									'application/json');

							xhr.onreadystatechange = function() {
								if (xhr.readyState === 4 && xhr.status < 400) {
									console.log(xhr.status);
									console.log(xhr.responseText);
								}
								if (xhr.readyState === 4 && xhr.status >= 400) {
									console.error(xhr.status + ': '
											+ xhr.responseText);
								}
							};
							xhr.send(jsonString);

							form.reset();
							location.reload();
						});
				editForm.appendChild(submit);
				document.body.appendChild(editForm);
				}
			});

		});

		td.appendChild(editBtn);
		return td;
	};

	module.makeButtonsForTableToDelete = function(dataObj) {
		var td = document.createElement("td");
		var deleteBtn = document.createElement("button");
		deleteBtn.setAttribute("quiz_id", dataObj.id);
		deleteBtn.textContent = "Delete";

		deleteBtn.addEventListener('click', function(e) {
			var quizId = e.target.getAttribute("quiz_id");
			console.log(quizId);
			module.ajax("GET", "http://localhost:8080/Quiz/api/quizes/"
				+ quizId, function(req) {
					if (req.readyState === 4 && req.status < 400) {
						var xhr = new XMLHttpRequest();
						xhr.open('DELETE', 'http://localhost:8080/Quiz/api/quizes/'
												+ quizId);

						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4 && xhr.status < 400) {
								console.log(xhr.status);
								console.log(xhr.responseText);
							}
							if (xhr.readyState === 4 && xhr.status >= 400) {
								console.error(xhr.status + ': '
										+ xhr.responseText);
							}
						};
						xhr.send(null);
					};
					location.reload();
			});
	});
			td.appendChild(deleteBtn);
			return td;
};

	module.makeCreateQuizButton = function() {
		var createQuizBtn = document.createElement("button");
		createQuizBtn.textContent = "Create A New Quiz";
		createQuizBtn.id = "createQuizBtn";

		createQuizBtn.addEventListener('click', function(e) {
			// Find Table By Id And Remove It From Dom
			var table = document.getElementById("quizTable");
			table.parentElement.removeChild(table);
			var createButton = document.getElementById("createQuizBtn");
			createButton.parentElement.removeChild(createButton);

			// Create A Form To Create New Quiz
			var createForm = document.createElement("form");
			createForm.id = "createForm";

			// Create An Input Field
			var quizName = document.createElement('input');
			quizName.name = 'quiz_name';
			quizName.id = 'quiz_name';
			quizName.type = 'text';
			quizName.placeholder = 'Quiz Name';

			createForm.appendChild(quizName);

			// Create A Submit Input
			var submit = document.createElement('input');
			submit.name = 'submitNew';
			submit.name = 'submitNew';
			submit.type = 'submit';
			submit.value = 'Create Quiz';

			submit.addEventListener('click', function(e) {
				e.preventDefault();

				var form = e.target.parentElement;
				console.log(form.quiz_name.value);

				var obj = {
					name : form.quiz_name.value
				};
				var jsonString = JSON.stringify(obj);

				console.log(jsonString);

				var xhr = new XMLHttpRequest();
				xhr.open('POST', 'http://localhost:8080/Quiz/api/quizes/');

				// Let the server know what we are sending it
				xhr.setRequestHeader('Content-type', 'application/json');

				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4 && xhr.status < 400) {
						console.log(xhr.status);
						console.log(xhr.responseText);
					}
					if (xhr.readyState === 4 && xhr.status >= 400) {
						console.error(xhr.status + ': ' + xhr.responseText);
					}
				};

				xhr.send(jsonString);

				form.reset();
				location.reload();
			});

			createForm.appendChild(submit);
			document.body.appendChild(createForm);

		});

		var createDiv = document.getElementById('create-button')
		createDiv.appendChild(createQuizBtn);
		document.body.appendChild(createDiv);
	}

	module.ajax = function(method, url, callback, requestBody) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);

		// Account for different Http Methods I.E. (GET, PUT, DELETE, etc)
		if (requestBody) {
			xhr.setRequestHeader("Content-type", "application/json");
		} else {
			requestBody = null;
		}

		xhr.onreadystatechange = function() {
			callback(xhr);
		};

		xhr.send(requestBody);
	};

	return module;
})();
