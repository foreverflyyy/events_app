const path = require('path');

const devElements = [
  {
    name: 'root-dev',
    script: './dist/apps/root/main.js',
    watch: ['./dist/apps/auth'],
    cwd: path.resolve(__dirname),
    pmx: false,
    env: {
      PATH_TO_ENV: './dist/apps/root/.dev.env'
    }
  },
  {
    name: 'auth-dev',
    script: './dist/apps/auth/main.js',
    watch: ['./dist/apps/auth'],
    cwd: path.resolve(__dirname),
    pmx: false,
    env: {
      PATH_TO_ENV: './dist/apps/auth/.dev.env'
    }
  }
];

const prodElements = [
  {
    name: 'root-prod',
    script: './dist/apps/root/main.js',
    watch: ['./dist/apps/auth'],
    cwd: path.resolve(__dirname),
    pmx: false,
    env: {
      PATH_TO_ENV: './dist/apps/root/.prod.env'
    }
  },
  {
    name: 'auth-prod',
    script: './dist/apps/auth/main.js',
    watch: ['./dist/apps/auth'],
    cwd: path.resolve(__dirname),
    pmx: false,
    env: {
      PATH_TO_ENV: './dist/apps/auth/.prod.env'
    }
  }
];

module.exports = {
  apps: process.env.NODE_ENV === 'production'
      ? prodElements
      : devElements
};