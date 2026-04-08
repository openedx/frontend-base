# Documentation CLI usage: https://github.com/documentationjs/documentation/blob/master/docs/USAGE.md

i18n = ./src/i18n


doc_command = ./node_modules/.bin/documentation build src -g -c ./docs/documentation.config.yml -f md -o ./docs/_API-body.md --sort-order alpha
cat_docs_command = cat ./docs/_API-header.md ./docs/_API-body.md > ./docs/API.md

clean:
	rm -rf dist .tsbuildinfo.*

build:
	tsc --build ./tsconfig.build.json
	find shell -type f -name '*.scss' -exec sh -c '\
	  for f in "$$@"; do \
	    d="dist/$${f}"; \
	    mkdir -p "$$(dirname "$$d")"; \
	    cp "$$f" "$$d"; \
	  done' sh {} +
	# When the package is installed from the registry, NPM sets the executable
	# bit on `bin` files automatically. It doesn't do the same in workspaces,
	# though, so we handle it explicitly here.
	chmod a+x $$(node -p "Object.values(require('./package.json').bin).join(' ')")

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

extract_translations: | requirements
	npm run i18n_extract
