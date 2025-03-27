# Check to see if you can use ash, in Alpine Linux, or default to BASH.
SHELL_PATH=/bin/ash
SHELL=$(if $(wildcard $(SHELL_PATH)),/bin/ash,/bin/bash)

# ==============================================================================
# Chat
chat-run:
	go run chat/api/services/cap/main.go | go run chat/api/tooling/logfmt/main.go

chat-test:
	curl -i -X GET http://localhost:3000/test

# ==============================================================================
# Modules support

tidy:
	go mod tidy
	go mod vendor

deps-upgrade:
	go get -u -v ./...
	go mod tidy
	go mod vendor
