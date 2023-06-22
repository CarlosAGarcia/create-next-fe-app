#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import git from 'simple-git';
import { MongoClient } from 'mongodb';

const templates = [
    { name: 'Next FE with collapsible side panels and nav bar. Catch all paths. (next-fe)', repo: 'CarlosAGarcia/next-fe' },
    { name: 'Next FE with collapsible side panels and nav bar. Catch all paths. (next-fe)', repo: 'CarlosAGarcia/next-fe' },
    // add as many templates as you like
    // template structure: { name: 'Template name', repo: 'username/repository' }
];

// Exit the inquirer prompt
function exit () {
    prompt.ui.close();
  }
//   let path_regex = /^\/?(\w+|\[\w+\])(\/(\w+|\[\w+\]))*\/?$/i;
  let path_regex = /^(\/?(\w+|\[\w+\])(\/(\w+|\[\w+\]))*\/?,?)*$/;
inquirer
    .prompt([
        {
            name: 'folder',
            message: chalk.blue('What is the folder name for your new project?'),
            validate: input => /^[a-z]+$/.test(input) || 'Must be a single lowercase word'
        },
        {
            name: 'paths',
            message: chalk.green('What are some additional paths (other than /index.tsx) that your app will support - comma separated (eg. /user, /user[id], /[address]) ?'),
            validate: input => path_regex.test(input) || 'Must be comma-separated lowercase words',
            filter: input => input.replace(/ /g,'').split(',')
        },
        {
            name: 'template',
            type: 'list',
            message: chalk.yellow('Which template would you like to use?'),
            choices: templates.map((t, i) => ({ name: t.name, value: i }))
        },
        {
            name: 'createDb',
            type: 'confirm',
            message: chalk.green('Do you want to create a MongoDB database?')
        },
        {
            name: 'dbName',
            message: chalk.blue('What is the database name?'),
            validate: input => /^[a-zA-Z0-9]+$/.test(input) || 'Must be a single alphanumeric word',
            when: answers => answers.createDb
        }
    ])
    .then(async answers => {
        const folder = answers.folder;
        const paths = answers.paths;
        const template = templates[answers.template];
        const createDb = answers.createDb;
        const dbName = answers.dbName;

        console.log('answers', { folder, paths, template, createDb, dbName })

        // 1. Clone the repository
        // eg. https://github.com/CarlosAGarcia/next-fe.git
        console.log(chalk.cyan(`\nCloning repository ${template.repo}...\n`));
        await git().silent(true).clone(`https://github.com/${template.repo}.git`, folder).then(() => {
            console.log(chalk.cyan(`\nCreating paths...\n`));
            
            // Create the paths
            paths.forEach(path => {
                console.log('creating', `${folder}/pages/${path}/index.js`)
                fs.outputFileSync(`${folder}/pages/${path}/index.tsx`, `// This is the ${path} path`); // write file with content as second arrg
                console.log(chalk.cyan(`Created path: ${path}`));
            });

            console.log(chalk.cyan(`\Path setup complete!\n`));
        }).catch((err) => {
            console.log(chalk.red(`\nFailed to clone the repository...\n`));
            console.log(err);
        });

        // 2. Create the database
        if (createDb) {
            console.log(chalk.cyan(`\nSetting up MongoDB database...\n`));

            // Connection URL
            const url = 'mongodb+srv://carlosagarciaelias:@cluster0.x9v1b6l.mongodb.net/?retryWrites=true&w=majority';
            const client = new MongoClient(url);
            console.log(chalk.cyan(`\nSetting up MongoDB database 2...\n`, JSON.stringify(client)));


            // Use connect method to connect to the server
            await client.connect(async function(err) {
                if (err) {
                    console.log(chalk.red(`\nFailed to connect to MongoDB...\n`));
                    console.log(err);
                    return;
                }
                console.log(chalk.cyan(`\nConnected successfully to MongoDB...\n`));

                const db = await client.db(dbName);
                console.log(chalk.cyan(`\nDatabase created with name: ${dbName}\n`));

                client.close();
                exit();
            });
        }
    });
