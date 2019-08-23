YARN = yarn
YARNFLAGS= --frozen-lockfile --mutex network
PROJECTS = $(patsubst projects/%, %, $(patsubst %/package.json, %, $(wildcard projects/*/package.json)))
.PHONY: list install clean validate-% fix-% test-%

#
# install deps
install: $(patsubst %, projects/%/node_modules, $(PROJECTS)) node_modules
projects/%/node_modules: node_modules
	@echo "\n Installing $@\n"
	cd $(dir $@) && ${YARN} ${YARNFLAGS}
node_modules:
	${YARN} ${YARNFLAGS}
#
# Build commands
validate: $(patsubst %, validate-%, $(PROJECTS))
fix: $(patsubst %, fix-%, $(PROJECTS))
build: $(patsubst %, build-%, $(PROJECTS))
test: $(patsubst %, test-%, $(PROJECTS))

#
# Overrides
#
validate-Mallard: node_modules projects/Mallard/node_modules
	yarn eslint 'projects/Mallard/**/*.{ts,tsx}' --parser-options=project:./projects/Mallard/tsconfig.json
	cd projects/Mallard && yarn tsc
validate-editions-crossword-renderer-app: projects/editions-crossword-renderer-app/node_modules
	@echo "Skip validation"
fix-editions-crossword-renderer-app: projects/editions-crossword-renderer-app/node_modules
	@echo "Skip fix"
build-Mallard:
	@echo "This is not yet handled by make"
#
# Project commands
#
validate-%: projects/%/node_modules
	yarn eslint 'projects/$*/**/*.{ts,tsx}' --parser-options=project:./projects/$*/tsconfig.json
fix-%: node_modules projects/%/node_modules
	yarn eslint 'projects/$*/**/*.{ts,tsx}' --parser-options=project:./projects/$*/tsconfig.json --fix
test-%: projects/%/node_modules
	@echo "HELLO $^"
	cd projects/$* && yarn test
build-%: projects/%/node_modules
	cd projects/$* && yarn build
#
# Misc
#
list:
	@echo  $(PROJECTS)
clean:
	rm -rf projects/*/node_modules
	rm -rf node_modules
