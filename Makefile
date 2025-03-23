SOURCES := $(shell find src -type f -name '*.md')
TARGETS := $(patsubst src/%.md,docs/%.html,$(SOURCES))

all: $(TARGETS) sync-files

clean:
	rm -rf docs

docs/%.html: src/%.md templates/default.html
	mkdir -p $(dir $@)
	$(PANDOC) \
		--filter templates/pandoc-sidenote.js \
		--mathjax \
		--to html5+smart \
		--template=templates/default.html \
		--css="css/theme.css"\
		--css="css/pygments.css"\
		--toc \
		--wrap=none \
		--output="$@" \
		"$<"

sync-files:
	rsync -av --exclude='*.md' src/ docs/
