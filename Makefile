export PATH := $(CURDIR)/.bin:${PATH} # Add local .bin to PATH

# Install the Ory CLI
.bin/ory: Makefile
ifneq ($(shell .bin/ory version | head -n1 | tr -s ' ' | cut -d' ' -f2),v1.1.0)
	curl -sSfL https://raw.githubusercontent.com/ory/meta/master/install.sh | bash -s -- -d -b .bin ory v1.1.0
	@touch -a -m .bin/ory
endif

.PHONY: opl-up relationships-up relationships-down

opl-up: .bin/ory
	ory patch opl -f ./namespaces.keto.ts

relationships-up: .bin/ory
	ory create relationships ./relationships.json

relationships-down: .bin/ory
	ory delete relationships --all --force
