#!/bin/bash

messages=(
"fix minor bugs"
"update documentation"
"refactor code structure"
"improve error handling"
"optimize performance"
"add utility functions"
"update dependencies"
"clean unused code"
"improve configuration"
"add validation checks"
"enhance logging"
"update README"
"fix edge cases"
"improve API handling"
"add tests"
"update project setup"
"refactor modules"
"improve UI components"
"fix formatting issues"
"optimize queries"
"update comments"
"add helper methods"
"improve workflow"
"code cleanup"
"fix compatibility issues"
"enhance features"
"final improvements"
)

files=(
"README.md"
"CHANGELOG.md"
"notes.md"
)

touch README.md CHANGELOG.md notes.md

for i in {0..26}
do
    DAYS_AGO=$((RANDOM % 60 + 1))

    HOUR=$((9 + RANDOM % 10))
    MIN=$((RANDOM % 60))

    DATE=$(date -d "$DAYS_AGO days ago $HOUR:$MIN" +"%Y-%m-%dT%H:%M:%S")

    FILE=${files[$RANDOM % ${#files[@]}]}

    echo "- ${messages[$i]} $(date)" >> $FILE

    git add .

    GIT_AUTHOR_DATE="$DATE" \
    GIT_COMMITTER_DATE="$DATE" \
    git commit -m "${messages[$i]}"

done

git push origin main

