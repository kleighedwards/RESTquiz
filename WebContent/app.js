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
					+ quizId, function() {
				// do something when data comes back
			})
		});

		td.appendChild(takeBtn);
		return td;
	};

	module.makeButtonsForTableToView = function(dataObj) {
		var td = document.createElement("td");
		var viewBtn = document.createElement("button");
		viewBtn.setAttribute("quiz_id", dataObj.id);
		viewBtn.textContent = "View";

		viewBtn.addEventListener('click', function(e) {
			var quizId = e.target.getAttribute("quiz_id");
			console.log(quizId);
			module.ajax("GET", "http://localhost:8080/Quiz/api/quizes/"
					+ quizId, function() {
				// do something when data comes back
			})
		});

		td.appendChild(viewBtn);
		return td;
	};

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

					// Create A Form To Create New Quiz
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
