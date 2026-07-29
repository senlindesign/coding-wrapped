.PHONY: validate package clean

validate:
	python3 scripts/validate_release.py

package:
	python3 scripts/package_skill.py

clean:
	rm -rf dist
