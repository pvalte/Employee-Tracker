const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('./db/connection');

// db.promise().query(`SELECT * FROM department`)
//     .then(([rows, fields]) => {
//         console.log(rows);
//     })
//     .catch(console.log)
//     .then(() => db.end());

const getDepts = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT department.name FROM department;`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}
const viewDepts = async () => {
    const departmentArray = [];
    const choices = await getDepts();
    //console.log(choices);
    for (let i = 0; i < choices.length; i++) {
        departmentArray.push(choices[i].name);
    }
    console.log(departmentArray);
}
viewDepts();


// const getManagers = () => {
//     return new Promise((resolve, reject) => {
//         db.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS Name 
//         FROM employee;`, (err, res) => {
//             if (err) reject(err);
//             resolve(res);
//         });
//     });
// }
// const viewEmployeesNames = async () => {
//     const choices = await getManagers();
//     console.log(choices);
// }
// viewEmployeesNames();

const roleQuestions = [{
    type: 'input',
    message: 'What is the title of the new role?',
    name: 'title',
},
{
    type: 'input',
    message: 'What is the salary of the new role?',
    name: 'salary',
},
{
    //TODO: change to list of depts
    type: 'input',
    message: 'What is the department id for the new role?',
    name: 'department_id',
}]

const employeeQuestions = [{
    type: 'input',
    message: 'What is the first name of the new employee?',
    name: 'first',
},
{
    type: 'input',
    message: 'What is the last name of the new employee?',
    name: 'last',
},
{
    //TODO: change to list of roles
    type: 'input',
    message: 'What is the role of the new employee?',
    name: 'role',
},
{
    //TODO: change to list of employees
    type: 'input',
    message: 'Who is the manager of the new employee?',
    name: 'manage',
}]

const updateQuestions = [{
    //TODO: change to list of employees
    type: 'input',
    message: 'What is the name of the employee?',
    name: 'employee',
},
{
    //TODO: change to list of depts
    type: 'input',
    message: 'What is the name of the department?',
    name: 'department_id',
}]

//Functions
function printDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, function (err, results) {
        console.table(results);
    });
};

function printRoles() {
    const sql = `SELECT roles.id, roles.title, roles.salary, department.name 
            AS department
            FROM roles
            LEFT JOIN department 
            ON roles.department_id = department.id;`;
    db.query(sql, function (err, results) {
        console.table(results);
    });
};

function printEmployees() {
    //TO DO: Replace mnanager id with name
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary, department.name AS department, employee.manager_id
    FROM employee
    LEFT JOIN roles 
    ON employee.role_id = roles.id
    LEFT JOIN department 
    ON roles.department_id = department.id;`;

    db.query(sql, function (err, results) {
        console.table(results);
    });
};

//prompt user
function init() {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'QUIT']
    })
        .then(response => {
            if (response.action == 'view all departments') {
                printDepartments();
            }
            if (response.action == 'view all roles') {
                printRoles();
            }
            if (response.action == 'view all employees') {
                printEmployees();
            }
            if (response.action == 'add a department') {
                inquirer.prompt({
                    type: 'input',
                    message: 'What is the name of the department you would like to add?',
                    name: 'department',
                })
                    .then(response => {
                        const sql = `INSERT INTO department (name)
                        VALUES (?);`;
                        const params = [response.department];
                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log('Department added.');
                            printDepartments();
                        });
                    })
            }
            if (response.action == 'add a role') {
                inquirer.prompt(roleQuestions)
                    .then(response => {
                        const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?,?,?);`;
                        const params = [response.title, response.salary, response.department_id];
                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log('Role added.');
                            printRoles();
                        });
                    })
            }
            if (response.action == 'add an employee') {
                inquirer.prompt(employeeQuestions)
                    .then(response => {
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,?,?);`;
                        const params = [response.first, response.last, response.role, response.manager];
                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log('Employee added.');
                            printEmployees();
                        });
                    })
            }
            if (response.action == 'update an employee role') {
                //TO DO: update role for employee
                inquirer.prompt(updateQuestions)
                    .then(response => {
                        const sql = `UPDATE employees SET department_id = ? 
                    WHERE id = ?`;
                        const params = [response.employee, response.department_id];
                        db.query(sql, params, (err, result) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log('Updated employee role');
                        });
                    })
            }
            else {
                return;
            }
            //TO DO: make queries asynchronous
            //TO DO: restart ask
        })
};

//init();
