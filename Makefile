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
build:
	$(Q)yarn prebuild && vsjs build example-contract.ts
clean:
	$(Q)rm -rf dist inputs example-contract.ts
help:
	$(Q)echo "make clean             - Deletes build artifacts."
init:
	$(Q)npm install -g . && vsjs init
publish:
	$(Q)npm publish --access public	
reset:
	$(Q)rm -rf dist
	$(Q)yarn build
	$(Q)echo "--- reset"
