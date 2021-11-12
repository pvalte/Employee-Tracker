const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('./db/connection');

//Functions
function printDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

function printRoles() {
    const sql = `SELECT roles.id, roles.title, roles.salary, department.name 
            AS department
            FROM roles
            LEFT JOIN department 
            ON roles.department_id = department.id;`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

function printEmployees() {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'employees'
    });
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary, department.name AS department, CONCAT(e.first_name, ' ' ,e.last_name) AS manager
    FROM employee
    INNER JOIN roles 
    ON employee.role_id = roles.id
    INNER JOIN department 
    ON roles.department_id = department.id
    LEFT JOIN employee e on employee.manager_id = e.id;`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

function addDepartment(response) {
    inquirer.prompt({
        type: 'input',
        message: 'What is the name of the department you would like to add?',
        name: 'department',
    })
        .then(response => {
            const sql = `INSERT INTO department (name) VALUES (?);`;
            const params = [response.department];
            db.query(sql, params, (err, res) => {
                if (err) throw err;
                console.log('Department added.');
                init();
            })
        })
};

var deptArr = [];
function getDepts() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            deptArr.push(res[i].name);
        }
    })
    return deptArr;
}

function addRole() {
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
        choices: getDepts()
    }])
        .then(response => {
            const deptId = getDepts().indexOf(response.department) + 1;

            const sql = `INSERT INTO roles (title, salary, department_id)
            VALUES (?,?,?);`;
            const params = [response.title, response.salary, deptId];
            db.query(sql, params, (err, res) => {
                if (err) throw err;
                console.log('Role added.');
                init();
            })
        })
};

var rolesArr = [];
function getRoles() {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, res) => {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            rolesArr.push(res[i].title);
        }
    })
    return rolesArr;
}

var employeeArr = [];
function getEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, res) => {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            employeeArr.push(res[i].first_name);
        }
    })
    return employeeArr;
}

function addEmployee() {
    inquirer.prompt([{
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
            choices: getRoles()
        },
        {
            type: 'list',
            message: 'Who is the manager of the new employee?',
            name: 'manager',
            choices: getEmployees()
    }])
        .then(response => {
            const roleId = getRoles().indexOf(response.role) + 1;
            const managerId = getEmployees().indexOf(response.manager) + 1;

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?,?,?,?);`;
            const params = [response.first, response.last, roleId, managerId];
            db.query(sql, params, (err, res) => {
                if (err) throw err;
                console.log('Employee added.');
                init();
            })
        })
};

var employeesArr = [];
function getEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, res) => {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            employeesArr.push(res[i].first_name);
        }
    })
    return employeesArr;
}

function updateEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'but why tho?',
            name: 'why',
        },
        {
            type: 'list',
            message: 'What is the name of the employee?',
            name: 'employee',
            choices: getEmployees()
        },
        {
            type: 'list',
            message: 'What is the name of the new role?',
            name: 'role',
            choices: getRoles()
        }
    ]).then(response => {
        const employeeId = getEmployees().indexOf(response.employee) + 1;
        const roleId = getRoles().indexOf(response.role) + 1;

        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const params = [roleId, employeeId];
        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Updated employee role');
            init();
        });
    })
}


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
                addDepartment();
            }
            if (response.action == 'add a role') {
                addRole();
            }
            if (response.action == 'add an employee') {
                addEmployee();
            }
            if (response.action == 'update an employee role') {
                updateEmployee();
            }
            else {
                return;
            }
        })
};

init();
