const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'NEW_USER_PASSWORD',
        database: 'employee'
    },
    console.log('Connected to the employee database.')
);

// //test inquirer
// function ask() { 
//     inquirer.prompt({
//         type: 'list',
//         message: 'What type of cheese do you like?',
//         name: 'cheese',
//         choices: ['Brie', 'Cheddar']
//     })
//     .then((answers) => {
//         console.log(answers);
//     })
//     .catch((error) => {
//         if (error.isTtyError) {
//             // Prompt couldn't be rendered in the current environment
//         } else {
//             // Something else went wrong
//         }
//     });
// };

// ask();

// //test consol table
// console.table([
//   {
//     name: 'foo',
//     age: 10
//   }, {
//     name: 'bar',
//     age: 20
//   }
// ]);
