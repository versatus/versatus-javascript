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
	$(Q)rm -rf dist build example-contract* inputs node_modules .parcel-cache
	$(Q)echo "--- clean"

help:
	$(Q)echo "make clean                 - Deletes build artifacts."
	$(Q)echo "make lasr-test             - Runs the LASR tests."
	$(Q)echo "make publish               - Publishes the package."
	$(Q)echo "make reset                 - Resets the environment."
	$(Q)echo "make reset-faucet          - Resets the environment with faucet."
	$(Q)echo "make reset-snake           - Resets the environment with snake."
	$(Q)echo "make reset-fungible-token  - Resets the environment with fungible-token."

lasr-test:
	$(Q)echo "--- lasr-test"
	$(Q)yarn run test

publish:
	$(Q)echo "--- publish"
	$(Q)npm publish --access public
	$(Q)echo "--- publish done"

build:
	$(Q)yarn install
	$(Q)yarn build

reset: clean build
	$(Q)npx lasrctl init
	$(Q)npx lasrctl build example-contract.ts
	$(Q)echo "--- reset"

reset-faucet: clean build
	$(Q)npx lasrctl init faucet
	$(Q)npx lasrctl build example-contract.ts
	$(Q)echo "--- reset with faucet"

reset-snake: clean build
	$(Q)npx lasrctl init snake
	$(Q)npx lasrctl build example-contract.ts
	$(Q)echo "--- reset with snake"

reset-fungible-token: clean build
	$(Q)npx lasrctl init fungible-token
	$(Q)npx lasrctl build example-contract.ts
	$(Q)echo "--- reset with fungible-token"
