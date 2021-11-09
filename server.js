const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('./db/connection');

//prompt user
function ask() { 
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
    })
    .then(response => {
        if (response.action == 'view all departments') {
            const sql = `SELECT name AS Departments FROM department`;
            db.query(sql, function (err, results) {
                console.table(results);
            });
        }
        if (response.action == 'view all roles') {
            //TO DO: Replace dept id with name
            const sql = `SELECT * FROM roles`;
            db.query(sql, function (err, results) {
                console.table(results);
            });
        }
        if (response.action == 'view all employees') {
            //TO DO: Replace dept id with name
            //TO DO: Replace mnanager id with name
            const sql = `SELECT * FROM employees`;
            db.query(sql, function (err, results) {
                console.table(results);
            });
        }
        else {
            console.log(response);
        }
    })
};

ask();
