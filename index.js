#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import git from 'simple-git';

const templates = [
    { name: 'Next FE with collapsible side panels and nav bar. Catch all paths. (next-fe)', repo: 'CarlosAGarcia/next-fe' },
    { name: 'Next FE with collapsible side panels and nav bar. Catch all paths. (next-fe)', repo: 'CarlosAGarcia/next-fe' },
    // add as many templates as you like
    // template structure: { name: 'Template name', repo: 'username/repository' }
];

inquirer
    .prompt([
        {
            name: 'folder',
            message: chalk.blue('What is the folder name for your new project?'),
            validate: input => /^[a-z]+$/.test(input) || 'Must be a single lowercase word'
        },
        {
            name: 'paths',
            message: chalk.green('What are the paths that your app will support (comma separated)?'),
            validate: input => /^[a-z,]+$/.test(input) || 'Must be comma-separated lowercase words',
            filter: input => input.split(',')
        },
        {
            name: 'template',
            type: 'list',
            message: chalk.yellow('Which template would you like to use?'),
            choices: templates.map((t, i) => ({ name: t.name, value: i }))
        }
    ])
    .then(answers => {
        const folder = answers.folder;
        const paths = answers.paths;
        const template = templates[answers.template];
        console.log('answers', { folder, paths, template })
        // Clone the repository
        // eg. https://github.com/CarlosAGarcia/next-fe.git
        console.log(chalk.cyan(`\nCloning repository ${template.repo}...\n`));
        git().silent(true).clone(`https://github.com/${template.repo}.git`, folder).then(() => {
            console.log(chalk.cyan(`\nCreating paths...\n`));
            
            // Create the paths
            paths.forEach(path => {
                console.log('creating', `${folder}/pages/${path}/index.js`)
                fs.outputFileSync(`${folder}/pages/${path}/index.js`, `// This is the ${path} path`);
                console.log(chalk.cyan(`Created path: ${path}`));
            });

            console.log(chalk.cyan(`\nProject setup complete!\n`));
        }).catch((err) => {
            console.log(chalk.red(`\nFailed to clone the repository...\n`));
            console.log(err);
        });
    });
