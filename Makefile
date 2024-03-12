# The default make command.
DEFAULT = help
# Use 'VERBOSE=1' to echo all commands, for example 'make help VERBOSE=1'.
ifdef VERBOSE
  Q :=
else
  Q := @
endif

.PHONY: clean help lasr-test publish reset build reset-faucet reset-snake reset-fungible-token

all: $(DEFAULT)

clean:
	$(Q)rm -rf dist build example-program* inputs node_modules .parcel-cache
	$(Q)yarn install
	$(Q)yarn build
	$(Q)echo "--- clean"

help:
	$(Q)echo "make clean                 - Deletes build artifacts."
	$(Q)echo "make lasr-test             - Runs the LASR tests."
	$(Q)echo "make publish               - Publishes the package."
	$(Q)echo "make reset                 - Resets the environment."
	$(Q)echo "make reset-faucet          - Resets the environment with faucet."
	$(Q)echo "make reset-snake           - Resets the environment with snake."
	$(Q)echo "make reset-fungible-token  - Resets the environment with fungible-token."

publish:
	$(Q)echo "--- publish"
	$(Q)npm publish --access public
	$(Q)echo "--- publish done"

build:
	$(Q)yarn install
	$(Q)yarn build

reset: clean build
	$(Q)npx lasrctl init
	$(Q)npx lasrctl build src/example-program.ts
	$(Q)npx lasrctl test inputs
	$(Q)echo "--- reset"

reset-faucet: clean build
	$(Q)npx lasrctl init faucet
	$(Q)npx lasrctl build src/example-program.ts
	$(Q)npx lasrctl test inputs

reset-snake: clean build
	$(Q)npx lasrctl init snake
	$(Q)npx lasrctl build src/example-program.ts
	$(Q)npx lasrctl test inputs

reset-fungible: clean build
	$(Q)npx lasrctl init fungible
	$(Q)npx lasrctl build src/example-program.ts
	$(Q)npx lasrctl test inputs

reset-non-fungible: clean build
	$(Q)npx lasrctl init non-fungible
	$(Q)npx lasrctl build src/example-program.ts
	$(Q)npx lasrctl test inputs
