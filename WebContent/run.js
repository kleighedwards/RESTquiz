window.addEventListener('load', function() {
  app.ajax("GET", "http://localhost:8080/Quiz/api/quizes/", function(request) {
    if (request.readyState === 4 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      // Call table builder function
      app.tableBuilder(
        data,
        "data-table",
        ["Quiz Name", "Take", "View", "Edit", "Delete"],
        // Custom function to build table body
        function(dataArr) {
        	console.log(dataArr)
          var tbody = document.createElement("tbody");
          dataArr.forEach(function(data,index,arr){
            var tr = document.createElement("tr");
            // Iterate over each object in dataArr
              for (property in data) {
            	  if (property === "name") {
            	  	if (Array.isArray(data[property])) {
            	  		var questionTextArr = [];
            	  		data[property].forEach(function(question){
            	  			questionTextArr.push(question.questionText);
            	  		})
            	  		data[property] = questionTextArr.join(": ");
            	  	}
                // Test if value is an object
                if (typeof data[property] === "object") {
                  var valuesArr = [];
                  // Add all values of object to array
                  for (p in data[property]) {
                    valuesArr.push(data[property][p])
                  }
                  // Reassign value with concatenated array of values
                  data[property] = valuesArr.join(", ");
                }
                var td = document.createElement("td");
                td.textContent = data[property];
                tr.appendChild(td);
              }
              }

              tr.appendChild(app.makeButtonsForTableToTake(data));
              tr.appendChild(app.makeButtonsForTableToView(data));
              tr.appendChild(app.makeButtonsForTableToEdit(data));
              tr.appendChild(app.makeButtonsForTableToDelete(data));

            tbody.appendChild(tr);

          });
          app.makeCreateQuizButton();
          return tbody;
        });
    }
  });
});
