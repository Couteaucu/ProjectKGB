# ProjectKGB
A custom discord bot

To run you need to make a file called config.json in the base directory of the format:
```
{
	"prefix": "!",
	"token": "API_TOKEN"
}
```
Run with: node .

or to debug: node --inspect .

If you add the word "test" afterwords like so: node --inspect . test

It will pull its prefix and token from configTest.json instead
