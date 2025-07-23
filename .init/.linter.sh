#!/bin/bash
cd /home/kavia/workspace/code-generation/quickpoll-9770c8a4/backend_inmemory_poll_service
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

