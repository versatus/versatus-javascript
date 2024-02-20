# The default make command.
DEFAULT = help
# Use 'VERBOSE=1' to echo all commands, for example 'make help VERBOSE=1'.
ifdef VERBOSE
  Q :=
else
  Q := @
endif
.PHONY: \
		clean
all: $(DEFAULT)

clean:
	$(Q)rm -rf dist build example-contract* inputs node_modules .parcel-cache
	$(Q)echo "--- clean"

help:
	$(Q)echo "make clean             - Deletes build artifacts."

lasr-test:
	$(Q)echo "--- lasr-test"
	$(Q)yarn run test

publish:
	$(Q)echo "--- publish"
	$(Q)npm publish --access public
	$(Q)echo "--- publish done"

reset: clean
	$(Q)yarn install
	$(Q)yarn build
	$(Q)npx vsjs init
	$(Q)npx vsjs build example-contract.ts
	$(Q)echo "--- reset"
