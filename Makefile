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
help:
	$(Q)echo "make clean             - Deletes build artifacts."

publish:
	$(Q)echo "--- publish"
	$(Q)npm publish --access public
	$(Q)echo "--- publish done"

reset:
	$(Q)rm -rf dist build example-contract*
	$(Q)yarn build
	$(Q)echo "--- reset"
