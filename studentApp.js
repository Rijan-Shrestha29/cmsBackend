const readline = require("readline");

// Create interface for input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let students = [];

// Function to ask student details
function addStudent() {
  rl.question("Enter Student Name: ", (name) => {
    rl.question("Enter Age: ", (age) => {
      rl.question("Enter Grade: ", (grade) => {

        // Store student
        students.push({
          name,
          age,
          grade
        });

        console.log("\nStudent added successfully!\n");

        showMenu();
      });
    });
  });
}

// Function to show all students
function showStudents() {
  if (students.length === 0) {
    console.log("\nNo students added yet.\n");
  } else {
    console.log("\nStudent List:\n");
    console.table(students); // Built-in table view
  }

  showMenu();
}

// Menu
function showMenu() {
  console.log("1. Add Student");
  console.log("2. View Students");
  console.log("3. Exit");

  rl.question("\nChoose option: ", (choice) => {
    if (choice === "1") {
      addStudent();
    } else if (choice === "2") {
      showStudents();
    } else if (choice === "3") {
      console.log("Goodbye!");
      rl.close();
    } else {
      console.log("Invalid option\n");
      showMenu();
    }
  });
}

// Start program
console.log("=== Student Management Console App ===\n");
showMenu();