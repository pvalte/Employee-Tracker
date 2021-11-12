const inquirer = require('inquirer');
//const mysql = require('mysql2');
const cTable = require('console.table');
//const db = require('./db/connection');
//var db = require('mysql2-promise')();
const mysql = require('mysql2/promise');

async function getDepts() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT department.name FROM department`;
    const [rows, fields] = await db.execute(sql);
    return rows;
}

async function getRoles() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT roles.title FROM roles`;
    const [rows, fields] = await db.execute(sql);
    return rows;
}

async function getManagers() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT employee.first_name FROM employee`;
    const [rows, fields] = await db.execute(sql);
    return rows;
}

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
async function printDepartments() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT * FROM department`;
    const [rows, fields] = await db.execute(sql);
    console.table(rows);
};

async function printRoles() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT roles.id, roles.title, roles.salary, department.name 
            AS department
            FROM roles
            LEFT JOIN department 
            ON roles.department_id = department.id;`;
    const [rows, fields] = await db.execute(sql);
    console.table(rows);
};

async function printEmployees() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    //TO DO: Replace mnanager id with name
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary, department.name AS department, employee.manager_id, cast(NULL as varchar)
    FROM employee
    WHERE manager_id IS NULL
    LEFT JOIN roles 
    ON employee.role_id = roles.id
    LEFT JOIN department 
    ON roles.department_id = department.id
    LEFT JOIN CONCAT(employee.first_name, " ", employee.last_name) AS manager
    ON employee.manager_id = employee.id;`;
    const [rows, fields] = await db.execute(sql);
    console.table(rows);
};

async function addDepartment(response) {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `INSERT INTO department (name) VALUES (?);`;
    const params = [response.department];
    const [rows, fields] = await db.execute(sql, params);
    console.log('Department added.');
    printDepartments();
};

async function getDeptId(response) {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT id FROM department WHERE name = '${response.department}';`;
    const [rows, fields] = await db.execute(sql);
    return rows[0].id;
}

async function addRole(response) {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const deptId = await getDeptId(response);

    const sql = `INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?);`;
    const params = [response.title, response.salary, deptId];
    const [rows, fields] = await db.execute(sql, params);
    console.log('Role added.');
    printRoles();
};

async function getRoleId(response) {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT id FROM roles WHERE title = '${response.role}';`;
    const [rows, fields] = await db.execute(sql);
    return rows[0].id;
}

async function getManagerId(response) {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT id FROM employee WHERE first_name = '${response.manager}';`;
    const [rows, fields] = await db.execute(sql);
    return rows[0].id;
}

async function addEmployee(response) {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const roleId = await getRoleId(response);
    const managerId = await getManagerId(response);

    const sql = `INSERT INTO employee (first_name, last_name, roleId, managerId)
    VALUES (?,?,?,?);`;
    const params = [response.first, response.last, roleId, managerId];
    const [rows, fields] = await db.execute(sql, params);
    console.log('Employee added.');
    printEmployees();
};


//prompt user
async function init() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    },
        console.log('Connected to the employees database.')
    );
    const deptArray = await getDepts();
    const roleArray = await getDepts();
    const managerArray = await getDepts();
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
                .then(response => {addDepartment(response)})
            }
            if (response.action == 'add a role') {
                deptChoices = [];
                for (let i = 0; i < deptArray.length; i++) {
                    deptChoices.push(deptArray[i].name);
                }
                inquirer.prompt([{
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
                    name: "department",
                    type: "list",
                    message: "Please select a department: ",
                    choices: deptChoices
                }])
                .then(response => {addRole(response)})
            }
            if (response.action == 'add an employee') {
                roleChoices = [];
                for (let i = 0; i < roleArray.length; i++) {
                    roleChoices.push(roleArray[i].title);
                }

                managerChoices = [];
                for (let i = 0; i < managerArray.length; i++) {
                    managerChoices.push(managerArray[i].first_name);
                }
                
                inquirer.prompt({
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
                    type: 'list',
                    message: 'What is the role of the new employee?',
                    name: 'role',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    message: 'Who is the manager of the new employee?',
                    name: 'manager',
                    choices: managerChoices
                })
                    .then(response => {addEmployee(response)})
            }
            // if (response.action == 'update an employee role') {
            //     //TO DO: update role for employee
            //     inquirer.prompt(updateQuestions)
            //         .then(response => {
            //             const sql = `UPDATE employees SET department_id = ? 
            //         WHERE id = ?`;
            //             const params = [response.employee, response.department_id];
            //             db.query(sql, params, (err, result) => {
            //                 if (err) {
            //                     console.log(err);
            //                     return;
            //                 }
            //                 console.log('Updated employee role');
            //             });
            //         })
            // }
            else {
                return;
            }
            //TO DO: make queries asynchronous
            //TO DO: restart ask
        })
};

init();
