YARN = yarn
YARNFLAGS= --frozen-lockfile --mutex network
PROJECTS = $(patsubst projects/%, %, $(patsubst %/package.json, %, $(wildcard projects/*/package.json)))
.PHONY: list install clean validate-% fix-% test-%

#
# install deps
install: $(patsubst %, projects/%/node_modules, $(PROJECTS)) node_modules
projects/%/node_modules: projects/%/yarn.lock
	@echo "\n👟 Installing $*\n"
	cd $(dir $@) && ${YARN} ${YARNFLAGS}
node_modules: yarn.lock
	@echo "\n👟 Installing project tools\n"
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
	@echo "\n👟 $@ 🦆\n"
	yarn eslint 'projects/Mallard/**/*.{ts,tsx}' --parser-options=project:./projects/Mallard/tsconfig.json
	cd projects/Mallard && yarn tsc
validate-editions-crossword-renderer-app: projects/editions-crossword-renderer-app/node_modules
	@echo "\n👟 $@ 🦆\n"
	@echo "\nSkip validation\n"
fix-editions-crossword-renderer-app: projects/editions-crossword-renderer-app/node_modules
	@echo "\n👟 $@ 🦆\n"
	@echo "\nSkip fix\n"
build-Mallard:
	@echo "\n👟 $@ 🦆\n"
	@echo "\nThis is not yet handled by make\n"
#
# Project commands
#
validate-%: projects/%/node_modules node_modules
	@echo "\n👟 $@ 🦆\n"
	yarn eslint 'projects/$*/**/*.{ts,tsx}' --parser-options=project:./projects/$*/tsconfig.json
fix-%: node_modules projects/%/node_modules node_modules
	@echo "\n👟 $@ 🦆\n"
	yarn eslint 'projects/$*/**/*.{ts,tsx}' --parser-options=project:./projects/$*/tsconfig.json --fix
test-%: projects/%/node_modules
	@echo "\n👟 $@ 🦆\n"
	cd projects/$* && yarn test
build-%: projects/%/node_modules
	@echo "\n👟 $@ 🦆\n"
	cd projects/$* && yarn build
#
# Misc
#
list:
	@echo  $(PROJECTS)
clean:
	@echo "\n🗑 cleaning\n"
	rm -rf projects/*/node_modules
	rm -rf node_modules
	rm projects/aws/bin/*.js projects/aws/bin/*.d.ts projects/aws/lib/*.js projects/aws/lib/*.d.ts
