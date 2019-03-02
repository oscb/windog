![Windog Icon](https://raw.githubusercontent.com/oscb/windog/master/windog.png)
# Windog

Windog is a simple node command line tool to send pushover notifications

## Usage

```
Usage: windog [command] <args>

Options:
  -V, --version             output the version number
  -h, --help                output usage information

Commands:
  setup [options]           Saves the Pushover tokens
  send [options] [message]  Sends a message
```

### Setup

```
Usage: setup [options]

Saves the Pushover tokens

Options:
  -p, --pushover <token>  Pushover Token
  -u, --user <user>       User Token
  -h, --help              output usage information
```

```bash
➜ windog setup -u  {USER_TOKEN} -p {APP_TOKEN}
Configuration Saved in /Users/username/Library/Preferences/windog-nodejs/config.json
```

You need to create an application and get your user token and app token first at [http://pushover.net/](https://pushover.net/)
You only need to run this once!

### Send

```
Usage: send [options] [message]

Sends a message

Options:
  -t, --title <title>  Message Title
  -p, --priority <n>   Priority [-2..2]
  -h, --help           output usage information
```

You can explicitely pass a message throug the command line...
```bash
➜ windog send -t Woof -p 1 "Woof woof woof"
Sending Message...
✓ Message sent!
```

... Or better yet, pipe the message from another long running command in your machine!
```bash
➜ echo "Waw, waw" | windog send
Sending Message...
✓ Message sent!
```
