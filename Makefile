# Documentation CLI usage: https://github.com/documentationjs/documentation/blob/master/docs/USAGE.md

i18n = ./src/i18n
transifex_input = $(i18n)/transifex_input.json
transifex_utils = $(i18n)/scripts/transifex-utils.js

# This directory must match .babelrc .
transifex_temp = ./temp/babel-plugin-formatjs

doc_command = ./node_modules/.bin/documentation build src -g -c ./docs/documentation.config.yml -f md -o ./docs/_API-body.md --sort-order alpha
cat_docs_command = cat ./docs/_API-header.md ./docs/_API-body.md > ./docs/API.md

build:
	rm -rf ./config ./tools/dist
	tsc --project ./tsconfig.json
	mkdir -p ./config
	cp tools/typescript/tsconfig.json config/tsconfig.json
	tsc --project ./tools/tsconfig.json
	cp -prf ./tools/dist/config-helpers ./config/config-helpers
	cp -prf ./tools/dist/eslint ./config/eslint
	cp -prf ./tools/dist/jest ./config/jest
	cp -prf ./tools/dist/webpack ./config/webpack
	cp -prf ./tools/dist/index.js ./config/index.js

docs-build:
	${doc_command}
	${cat_docs_command}
	rm ./docs/_API-body.md

docs-watch:
	@echo "NOTE: Please load _API-body.md to see watch results."
	${doc_command} -w

docs-lint:
	./node_modules/.bin/documentation lint src

.PHONY: requirements
requirements:  ## install ci requirements
	npm ci

i18n.extract:
	# Pulling display strings from .jsx files into .json files...
	rm -rf $(transifex_temp)
	npm run-script i18n_extract

i18n.concat:
	# Gathering JSON messages into one file...
	$(transifex_utils) $(transifex_temp) $(transifex_input)

extract_translations: | requirements i18n.extract i18n.concat
