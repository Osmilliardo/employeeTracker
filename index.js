const { prompt } = require('inquirer');
const db = require('./db');

function main() {
    prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE'
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Remove Role',
                    value: 'REMOVE_ROLE'
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPT'
                },
                {
                    name: 'Remove Department',
                    value: 'REMOVE_DEPT'
                },
                {
                    name: 'View all Employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View Employees by Department',
                    value: 'EMPLOYEE_BY_DEPARTMENT'
                },
                {
                    name: 'View Employees by Manager',
                    value: 'EMPLOYEE_BY_MANAGER'
                },
                {
                    name: 'View all Roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'View all Departments',
                    value: 'VIEW_DEPT'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_ROLE'
                },
                {
                    name: 'Update Employee Manager',
                    value: 'UPDATE_MANAGER'
                },
                {
                    name: 'Quit',
                    value: 'QUIT'
                }
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        switch (choice) {
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'REMOVE_EMPLOYEE':
                removeEmployee();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'REMOVE_ROLE':
                removeRole();
                break;
            case 'ADD_DEPT':
                addDept();
                break;
            case 'REMOVE_DEPT':
                removeDept();
                break;
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            case 'EMPLOYEE_BY_DEPARTMENT':
                employeeByDept();
                break;
            case 'EMPLOYEE_BY_MANAGER':
                employeeByManager();
                break;
            case 'VIEW_ROLES':
                viewRoles();
                break;
            case 'VIEW_DEPT':
                viewDept();
                break;
            case 'UPDATE_ROLE':
                updateEmployeeRole();
                break;
            case 'UPDATE_MANAGER':
                updateManager();
                break;
                default:
                    quit();
        }
    })
}

//adds employee
function addEmployee() {
    prompt([
        {
            message: 'What is the employees first name?',
            name: 'first_name'
        },
        {
            message: 'What is the employess last name?',
            name: 'last_name'
        }
    ])
        //saves the responses as the employees first and last name
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

        //finds all defined roles and turns them into an array
        db.findAllRoles()
        .then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }));

          //lists the role array as list of choices to select for the employee
          prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices
          })
            .then(res => {
              let roleId = res.roleId;

              //finds all employess with roles that are defined as manager and makes an array
              db.findAllEmployees()
                .then(([rows]) => {
                  let employees = rows;
                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));

                  managerChoices.unshift({ name: "None", value: null });

                  //lists the manager array to select for the employee
                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                  })
                    .then(res => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName
                      }

                      //adds the new employee to the database
                      db.createEmployee(employee);
                    })
                    .then(() => console.log(
                      `Added ${firstName} ${lastName} to the database`
                    ))
                    .then(() => main())
                })
            })
        })
    })
}

//deletes employee
function removeEmployee() {
    db.findAllEmployees()
        //sets all employess as an array
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
            }));
            
            //sets the array as a list of choices for removal
            prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee do you want to remove?",
                choices: employeeChoices
            }
            ])
            .then(res => db.removeEmployee(res.employeeId))
            .then(() => console.log("Removed employee from the database"))
            .then(() => loadMainPrompts())
        })
}

//adds roles
function addRole() {
    db.findAllDepartments()
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      prompt([
        {
          name: "title",
          message: "What is the name of this role?"
        },
        {
          name: "salary",
          message: "What is the salary of this role?"
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does this role belong to?",
          choices: departmentChoices
        }
      ])
        .then(role => {
          db.createRole(role)
            .then(() => console.log(`Added ${role.title}`))
            .then(() => main())
        })
    })
}

//deletes roles
function removeRole() {}

//adds departments
function addDept() {}

//deletes departments
function removeDept() {}

//view all employees
function viewEmployees() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows
        console.log('\n');
        console.table(employees);
    })
    .then(() => main());
}

//view employees in a given department
function employeeByDept() {
    //puts all defined departments into an array
    db.findAllDept()
    .then(([rows]) => {
        let dept = rows;
        const deptChoice = dept.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        //uses the array as a list of choices for departments to sort by
        prompt([
            {
                type: 'list',
                name: 'dept',
                message: 'View employees from which department?',
                choices: deptChoice
            }
        ])
        //takes the department choice and lists all employees assigned to that department
        .then(res => db.findEmployeesByDept(res.departmentId))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => main())
    });
}

//view all employees under a specific manager
function employeeByManager() {
    //grabs all employees that are managers and sets them as an array
    db.findAllEmployees()
        .then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            
            //makes the array the choices for a prompt
            prompt([
                {
                    type: 'list',
                    name: 'manage',
                    message: 'Which manager do you want to see the employees for?',
                    choices: managerChoices
                }
            ])
                //lists all the employees under that manager, or logs that there is none
                .then(res => db.findEmployeesByManager(res.managerId))
                .then(([rows]) => {
                    let employees = rows;
                    console.log('\n');
                    if (employees.length === 0) {
                        console.log('The selected manager has no employees');
                    } else {
                        console.log(employees);
                    }
                })
                .then(() => main())
        });
}

//view all roles
function viewRoles() {}

//view all departments
function viewDept() {}

//update an employees role
function updateEmployeeRole() {}

//update an employees manager
function updateManager() {}

//quit the application
function quit() {
    console.log('Goodbye');
    process.exit();
}