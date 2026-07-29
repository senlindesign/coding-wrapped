.PHONY: frontend validate package clean

frontend:
	python3 scripts/rebuild_frontend.py

validate:
	python3 scripts/validate_release.py

package:
	python3 scripts/package_skill.py

clean:
	rm -rf dist
