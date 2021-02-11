#!/usr/bin/env node

const inquirer = require('inquirer');
const { ensureDir, copy, writeJson } = require('fs-extra');

const packageJson = require('./package.json');

const QUESTIONS = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name:',
    default: 'AWS-API',
    validate: (value) =>
      /^[\w-]+$/.test(value) ||
      'The project name may only contain alphanumeric characters, hyphens and underscores',
  },
];

const RESOURCES_TO_COPY = [
  'src',
  'test',
  '.eslintrc',
  '.gitignore',
  '.prettierrc',
  'serverless.yml',
  'webpack.config.js',
];

function filter(src, dest) {
  console.log(`${src} to ${dest}`);
  return src === __dirname || !!RESOURCES_TO_COPY.find((resource) => src.includes(resource));
}

function formatPackageJson(params) {
  const { projectName } = params;
  const newPackageJson = { ...packageJson };
  newPackageJson.name = projectName.toLowerCase();
  delete newPackageJson.description;
  delete newPackageJson.bin;
  delete newPackageJson.repository;
  delete newPackageJson.author;
  delete newPackageJson.license;
  delete newPackageJson.bugs;
  delete newPackageJson.homepage;
  delete newPackageJson.dependencies['fs-extra'];
  delete newPackageJson.dependencies.inquirer;
  return newPackageJson;
}

function copyTemplate(params) {
  const { projectName } = params;
  console.log('Project name:', projectName);
  const newDir = `${process.cwd()}/${projectName}`;
  return ensureDir(newDir)
    .then(() =>
      Promise.all([
        copy(`${__dirname}`, `${newDir}`, { filter }).then(() => {
          console.log('...resources copied');
        }),
        writeJson(`${newDir}/package.json`, formatPackageJson(params)).then(() => {
          console.log('...package.json created');
        }),
      ])
    )
    .catch(console.error);
}

inquirer.prompt(QUESTIONS).then(copyTemplate).catch(console.error);
