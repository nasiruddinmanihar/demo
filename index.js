let tasks = [];
let subTaskCounter = 1;

function validateDates() {
  const startDate = new Date(document.getElementById("parentStartDate").value);
  const endDate = new Date(document.getElementById("parentEndDate").value);
  const startDateError = document.getElementById("startDateError");
  const endDateError = document.getElementById("endDateError");

  // Check if Start Date is after End Date
  if (startDate > endDate) {
    startDateError.textContent = "Start Date cannot be after End Date.";
  } else {
    startDateError.textContent = ""; // Clear error message if validation passes
  }

  // Check if End Date is before Start Date
  if (endDate < startDate) {
    endDateError.textContent = "End Date cannot be before Start Date.";
  } else {
    endDateError.textContent = ""; // Clear error message if validation passes
  }
}

function updateStatus() {
  const currentDate = new Date();
  const startDate = new Date(document.getElementById("parentStartDate").value);
  const endDate = new Date(document.getElementById("parentEndDate").value);
  const statusDropdown = document.getElementById("parentStatus");

  // Disable all options
  for (let i = 0; i < statusDropdown.options.length; i++) {
    statusDropdown.options[i].disabled = true;
  }

  // Enable options based on conditions
  if (currentDate < startDate) {
    enableOption("In-Progress");
    enableOption("Canceled");
  } else if (currentDate >= startDate && currentDate <= endDate) {
    enableOption("In-Progress");
    enableOption("Completed");
    enableOption("Canceled");
  } else if (currentDate > endDate) {
    enableOption("Completed");
    enableOption("Canceled");
    enableOption("Due-Passed");
  }

  // Function to enable a specific option
  function enableOption(optionValue) {
    const option = statusDropdown.querySelector(
      `option[value="${optionValue}"]`
    );
    if (option) {
      option.disabled = false;
    }
  }
}

function addSubTask() {
  const subTaskInputs = document.getElementById("subTaskInputs");

  // Create new set of subtask input fields
  const subTaskFields = document.createElement("div");
  const parentTaskId = document.getElementById("parentTaskId").value;
  const subTaskId = parentTaskId + "-" + subTaskCounter++;

  subTaskFields.innerHTML = `
    <h3>Sub-Task</h3>
    <label for="${subTaskId}">Sub-Task ID:</label>
    <input type="text" id="${subTaskId}" value="${subTaskId}" readonly><br>
    
    <label for="subTaskName">Sub-Task Name:</label>
    <input type="text" name="subTaskName" required><br>
    
    <label for="subStartDate">Start Date:</label>
    <input type="date" name="subStartDate" required><br>
    
    <label for="subEndDate">End Date:</label>
    <input type="date" name="subEndDate" required><br>
    
    <label for="subStatus">Status:</label>
    <select name="subStatus" required>
        <option value="In-Progress">In-Progress</option>
        <option value="Completed">Completed</option>
        <option value="DuePassed">DuePassed</option>
        <option value="Canceled">Canceled</option>
    </select><br>
    `;

  // Append the new set of subtask input fields to the container
  subTaskInputs.appendChild(subTaskFields);
}

function addTask(event) {
  event.preventDefault();

  const parentTaskId = document.getElementById("parentTaskId").value;
  const parentTaskName = document.getElementById("parentTaskName").value;
  const parentStartDate = document.getElementById("parentStartDate").value;
  const parentEndDate = document.getElementById("parentEndDate").value;
  const parentStatus = document.getElementById("parentStatus").value;

  // Get subtask inputs
  const subTaskInputs = document.querySelectorAll("#subTaskInputs > div");

  // Create an array to store subtasks
  const subTasks = [];

  // Iterate over subtask input sections and add them to the array
  subTaskInputs.forEach((input) => {
    const subTaskId = input.querySelector('input[type="text"]').value;
    const subTaskName = input.querySelector('input[name="subTaskName"]').value;
    const subStartDate = input.querySelector(
      'input[name="subStartDate"]'
    ).value;
    const subEndDate = input.querySelector('input[name="subEndDate"]').value;
    const subStatus = input.querySelector('select[name="subStatus"]').value;

    const subTask = {
      subTaskId: subTaskId,
      subTaskName: subTaskName,
      startDate: subStartDate,
      endDate: subEndDate,
      status: subStatus,
    };

    subTasks.push(subTask);
  });

  const parentTask = {
    taskId: parentTaskId,
    taskName: parentTaskName,
    startDate: parentStartDate,
    endDate: parentEndDate,
    status: parentStatus,
    subTasks: subTasks,
  };

  // Add parent task to tasks array
  tasks.push(parentTask);

  // Display updated tasks
  displayTasks();

  // Reset form
  document.getElementById("taskForm").reset();
}

function displayTasks() {
  const taskDisplay = document.getElementById("taskDisplay");
  taskDisplay.innerHTML = "<h2>Task Details</h2>";

  tasks.forEach((task) => {
    taskDisplay.innerHTML += `
       <h3>Parent-Tasks</h3>
        <div class="task-container">
          <table class="task-table">
            <tr>
              <th>Task ID</th>
              <th>Parent Task</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
            <tr id="taskRow_${task.taskId}">
              <td>${task.taskId}</td>
              <td>${task.taskName}</td>
              <td>${task.startDate}</td>
              <td>${task.endDate}</td>
              <td>${task.status}</td>
              <td>
                <button onclick="editTask('${task.taskId}')">Edit</button>
                <button onclick="deleteTask('${task.taskId}')">Delete</button>
             </td>
           
          
            </tr>
          </table>
          <h3>Sub-Tasks</h3>
          <table class="subtask-table">
            <tr>
              <th>Sub-Task ID</th>
              <th>Sub-Task Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
            ${task.subTasks
              .map(
                (subTask) => `
                <tr id="subTaskRow_${subTask.subTaskId}">
                    <td>${subTask.subTaskId}</td>
                    <td>${subTask.subTaskName}</td>
                    <td>${subTask.startDate}</td>
                    <td>${subTask.endDate}</td>
                    <td>${subTask.status}</td>
                    <td>
                    <button onclick="editSubTask('${subTask.subTaskId}')">Edit</button>
                    <button onclick="deleteSubTask('${subTask.subTaskId}')">Delete</button>
                    </td>
                    
                  </tr>
                `
              )
              .join("")}
          </table>
        </div>`;
  });
}

function editTask(taskId) {
    const task = tasks.find(task => task.taskId === taskId);
    if (task) {
        const newParentId = document.getElementById(`editTaskId_${taskId}`).value;

        // Validate the new Parent ID
        const isValidParentId = validateParentId(newParentId);

        if (!isValidParentId) {
            // If validation fails, display error message and return without making changes
            alert('Error: The Parent ID is already in use or has been deleted.');
            return;
        }

       const taskRow = document.getElementById(`taskRow_${taskId}`);
      taskRow.innerHTML = `
        <td><input type="text" id="editTaskId_${taskId}" value="${task.taskId}"></td>
        <td><input type="text" id="editTaskName_${taskId}" value="${task.taskName}"></td>
        <td><input type="date" id="editTaskStartDate_${taskId}" value="${task.startDate}"></td>
        <td><input type="date" id="editTaskEndDate_${taskId}" value="${task.endDate}"></td>
        <td><input type="text" id="editTaskStatus_${taskId}" value="${task.status}"></td>
        <td>
          <button onclick="saveTask('${taskId}')">Save</button>
          <button onclick="cancelEditTask('${taskId}')">Cancel</button>
        </td>
      `;
    }
}

function validateParentId(newParentId) {
    // Check if newParentId is already in use or has been deleted
    const existingTask = tasks.find(task => task.taskId === newParentId);
    const warningMessage = document.getElementById("warningMessage");

    if (!existingTask || existingTask.deleted) {
        warningMessage.textContent = "";
        return true; // Indicates valid newParentId
    } else {
        warningMessage.textContent = "Warning: This ID is already in use or has been deleted.";
        return false; // Indicates invalid newParentId
    }
}

function validateSubTaskId(newSubTaskId) {
    // Check if newSubTaskId is already in use or has been deleted
    // Iterate through all tasks and their subtasks to find a matching subtask ID
    const warningMessage = document.getElementById("warningMessage");

    for (const task of tasks) {
        for (const subTask of task.subTasks) {
            if (subTask.subTaskId === newSubTaskId) {
                // Subtask ID already exists, display warning message and return false
                warningMessage.textContent = "Warning: This Sub-Task ID is already in use.";
                return false;
            }
        }
    }
    // If the Subtask ID is not found in any existing subtasks, clear warning message and return true
    warningMessage.textContent = "";
    return true;
}

function saveTask(taskId) {
    const task = tasks.find(task => task.taskId === taskId);
    if (task) {
        task.taskId = document.getElementById(`editTaskId_${taskId}`).value;
        task.taskName = document.getElementById(`editTaskName_${taskId}`).value;
        task.startDate = document.getElementById(`editTaskStartDate_${taskId}`).value;
        task.endDate = document.getElementById(`editTaskEndDate_${taskId}`).value;
        task.status = document.getElementById(`editTaskStatus_${taskId}`).value;

        displayTasks(); // Refresh the displayed tasks
    }
}

function editSubTask(subTaskId) {
    const [taskId, subTaskIndex] = subTaskId.split('-');

    const task = tasks.find(task => task.taskId === taskId);
    if (task && task.subTasks[subTaskIndex]) {
        const newSubTaskId = document.getElementById(`editSubTaskId_${subTaskId}`).value;

        // Validate the new Subtask ID
        const isValidSubTaskId = validateSubTaskId(newSubTaskId);

        if (!isValidSubTaskId) {
            // If validation fails, display error message and return without making changes
            alert('Error: The Subtask ID is already in use or has been deleted.');
            return;
        }
      const subTask = task.subTasks[subTaskIndex];
      const subTaskRow = document.getElementById(`subTaskRow_${subTaskId}`);
      subTaskRow.innerHTML = `
        <td><input type="text" id="editSubTaskId_${subTaskId}" value="${subTask.subTaskId}" readonly></td>
        <td><input type="text" id="editSubTaskName_${subTaskId}" value="${subTask.subTaskName}"></td>
        <td><input type="date" id="editSubTaskStartDate_${subTaskId}" value="${subTask.startDate}"></td>
        <td><input type="date" id="editSubTaskEndDate_${subTaskId}" value="${subTask.endDate}"></td>
        <td><input type="text" id="editSubTaskStatus_${subTaskId}" value="${subTask.status}"></td>
        <td>
          <button onclick="saveSubTask('${subTaskId}')">Save</button>
          <button onclick="cancelEditSubTask('${subTaskId}')">Cancel</button>
        </td>
      `;
    }
  }

function cancelEditTask(taskId) {
    const task = tasks.find(task => task.taskId === taskId);
    if (task) {
        const taskRow = document.getElementById(`taskRow_${taskId}`);
        taskRow.innerHTML = `
            <td>${task.taskId}</td>
            <td>${task.taskName}</td>
            <td>${task.startDate}</td>
            <td>${task.endDate}</td>
            <td>${task.status}</td>
            <td>
                <button onclick="editTask('${taskId}')">Edit</button>
                <button onclick="deleteTask('${taskId}')">Delete</button>
            </td>
        `;
    }
}

function cancelEditSubTask(subTaskId) {
    const task = tasks.find(task => task.subTasks.some(subTask => subTask.subTaskId === subTaskId));
    if (task) {
        const subTask = task.subTasks.find(subTask => subTask.subTaskId === subTaskId);
        const subTaskRow = document.getElementById(`subTaskRow_${subTaskId}`);
        if (subTask) {
            subTaskRow.innerHTML = `
                <td>${subTask.subTaskId}</td>
                <td>${subTask.subTaskName}</td>
                <td>${subTask.startDate}</td>
                <td>${subTask.endDate}</td>
                <td>${subTask.status}</td>
                <td>
                    <button onclick="editSubTask('${subTaskId}')">Edit</button>
                    <button onclick="deleteSubTask('${subTaskId}')">Delete</button>
                </td>
            `;
        }
    }
}


function saveSubTask(subTaskId) {
    const subTask = tasks.flatMap(task => task.subTasks).find(subTask => subTask.subTaskId === subTaskId);
    if (subTask) {
        subTask.subTaskId = document.getElementById(`editSubTaskId_${subTaskId}`).value;
        subTask.subTaskName = document.getElementById(`editSubTaskName_${subTaskId}`).value;
        subTask.startDate = document.getElementById(`editSubTaskStartDate_${subTaskId}`).value;
        subTask.endDate = document.getElementById(`editSubTaskEndDate_${subTaskId}`).value;
        subTask.status = document.getElementById(`editSubTaskStatus_${subTaskId}`).value;

        displayTasks(); // Refresh the displayed tasks
    }
}

function showAllTasks() {
  displayTasks();
}

function searchTasks() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const searchType = document.getElementById("searchType").value;
  const filteredTasks = tasks.filter((task) => {
    // Check if the search input matches any attribute of the task
    return task[searchType].toLowerCase().includes(searchInput);
  });
  if (filteredTasks.length > 0) {
    displayFilteredTasks(filteredTasks);
  } else {
    alert("No matching tasks found!");
  }
}

function displayFilteredTasks(filteredTasks) {
  const taskDisplay = document.getElementById("taskDisplay");
  taskDisplay.innerHTML = "<h2>Filtered Task Details</h2>";

  // Loop through filtered tasks and display details
  filteredTasks.forEach((task) => {
    taskDisplay.innerHTML += `
        <div>
          <p><strong>Task ID:</strong> ${task.taskId}</p>
          <p><strong>Task Name:</strong> ${task.taskName}</p>
          <p><strong>Start Date:</strong> ${task.startDate}</p>
          <p><strong>End Date:</strong> ${task.endDate}</p>
          <p><strong>Status:</strong> ${task.status}</p>
          <!-- Display subtasks -->
          <ul>
            ${task.subTasks
              .map(
                (subTask) => `
              <li><strong>Sub-Task:</strong> ${subTask.subTaskName}</li>
              <li><strong>Start Date:</strong> ${subTask.startDate}</li>
              <li><strong>End Date:</strong> ${subTask.endDate}</li>
              <li><strong>Status:</strong> ${subTask.status}</li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
  });
}


function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      displayTasks();
    }
}

function deleteSubTask(subTaskId) {
    const parentTask = tasks.find(task => task.subTasks.some(subTask => subTask.subTaskId === subTaskId));
    if (parentTask) {
      const subTaskIndex = parentTask.subTasks.findIndex(subTask => subTask.subTaskId === subTaskId);
      if (subTaskIndex !== -1) {
        parentTask.subTasks.splice(subTaskIndex, 1);
        displayTasks();
      }
    }
}

// Add form submit event listener
document.getElementById("taskForm").addEventListener("submit", addTask);
