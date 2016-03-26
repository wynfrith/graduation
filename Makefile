.PHONY: test
test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--compilers js:babel-register \
		--harmony \
		--reporter nyan \
		--require should \
		test/**/*.js
