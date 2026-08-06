.PHONY: frontend landing landing-test validate package clean

frontend:
	python3 scripts/rebuild_frontend.py

landing:
	npm --prefix landing run build

landing-test:
	npm --prefix landing test

validate:
	python3 scripts/validate_release.py

package:
	python3 scripts/package_skill.py

clean:
	rm -rf dist
