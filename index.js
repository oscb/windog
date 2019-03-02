#!/usr/bin/env node
require('dotenv').config();
const program = require('commander');
const Push = require( 'pushover-notifications' );
const chalk = require('chalk');
const Conf = require('conf');
const readline = require('readline');
var util = require('util');

const TokenKey = 'PushoverToken';
const UserKey = 'UserKey';
const config = new Conf();

function windog(message, opts) {
    const token = getConfig(TokenKey);
    const user = getConfig(UserKey);
    if (user == undefined || token == undefined) return;

  console.log(chalk.cyan('Sending Message...'));

  if (message !== undefined) {
    send(user, token, message, opts);
  } else {
    var data = '';
    process.stdin
      .on('readable', function() {
        var chunk = this.read();
        if (chunk !== null) {
          data += chunk;
        }
      })
      .on('end', function() {
        send(user, token, data, opts);
      });
  }
}

function setup(opts) {
  if (opts.user !== undefined) {
    config.set(UserKey, opts.user);
  }
  if (opts.pushover !== undefined) {
    config.set(TokenKey, opts.pushover);
  }
  console.log(chalk.magenta(`Configuration Saved in ${config.path}`));
}

function getConfig(key) {
  const val = config.get(key);
  if (val == undefined) {
    console.log(`You're missing ${chalk.magenta(key)} in your config. Run ${chalk.green('windog setup')} first!`);
  }
  return val;
}

function parsePriority(priority) {
  if (priority === undefined || priority === null) {
    console.error('Invalid priority!');
    process.exit(1);
  }
  var p = parseInt(priority);
  if (p < -2 || p > 2) {
    console.error('Invalid priority!');
    process.exit(1);
  }
  return p;
}

function send(user, token, msg, opts) {
  const pushover = new Push( {
    user: user,
    token: token
  });

  const notification = {
    message: msg || 'Woof',
    title: (opts !== undefined && opts.title !== undefined)? opts.title : 'Windog',
    priority: (opts !== undefined && opts.priority !== undefined)? opts.priority : 0
  }
  
  pushover.send(notification, function(err, result) {
    if (err) {
      throw err
    }
    console.log(chalk.bold.green('✓ Message sent!'));
  });
}

program
  .version('1.0.0')
  .usage('[command] <args>')

program
  .command('setup')
  .description('Saves the Pushover tokens')
  .option('-p, --pushover <token>', 'Pushover Token')
  .option('-u, --user <user>', 'User Token')
  .action(setup);

program
  .command('send [message]')
  .description('Sends a message')
  .option('-t, --title <title>', 'Message Title')
  .option('-p, --priority <n>', 'Priority [-2..2]', parsePriority) // TODO: For P2 we need to support retry and expire
  .action(windog);

program
  .command('*')
  .action(program.outputHelp)

program
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}