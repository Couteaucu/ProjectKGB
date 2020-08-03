#!/bin/bash
git pull origin master --no-edit
node index.js >> runlog.txt
