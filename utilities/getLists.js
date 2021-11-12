const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('../db/connection');

//Functions
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

module.exports = { getDepts, getRoles, getEmployees }; 