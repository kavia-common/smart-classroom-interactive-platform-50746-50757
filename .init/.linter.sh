#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-classroom-interactive-platform-50746-50757/learning_assessment_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

