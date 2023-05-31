# Contributing to Smart City Platform on Docker

We welcome contributions, but request you follow these guidelines.

- [Contributing to Smart City Platform on Docker](#contributing-to-smart-city-platform-on-docker)
  - [Raising issues](#raising-issues)
  - [Feature requests](#feature-requests)
  - [Pull-Requests](#pull-requests)
  - [Development](#development)

This project adheres to the [Contributor Covenant 1.4](http://contributor-covenant.org/version/1/4/).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to the project's core team at oss@unity.de.

## Raising issues

Please raise any bug reports on the relevant project's issue tracker. Be sure to
search the list to see if your issue has already been raised.

A good bug report is one that make it easy for us to understand what you were
trying to do and what went wrong.

Provide as much context as possible so we can try to recreate the issue.

At a minimum, please include:

- Version of Smart City Platform on Docker - either release number if you downloaded a zip, or the first few lines of `git log` if you are cloning the repository directly.

## Feature requests

Please raise any feature reuqests on the relevant project's issue tracker. Be sure to
search the list to see if your issue has already been raised.

## Pull-Requests

If you want to raise a pull-request with a new feature, or a refactoring
of existing code, it may will get rejected if you haven't discussed it over the projects issue tracker first.

All contributors automatically agree on the [EUPL-1.2](../LICENSE).

## Development

Please install [pre-commit](https://pre-commit.com/) before committing to this repository.

``` bash
sudo -H pip3 install pre-commit
pre-commit install # execute in repository directory
pre-commit run --all-files # (optional) run against all the files
```

This includes the best practice check for ansible called `ansible-lint`.
It is recommended to install `ansible-lint` locally to make intermediate checks: `sudo -H pip3 install ansible-lint`.
You should run the linter for each playbook with the `-v` flag to get meaningful results.

``` bash
ansible-lint -v 01_setup_base/playbook.yml
ansible-lint -v 02_setup_docker/playbook.yml
ansible-lint -v 03_setup_containers_plattform/playbook.yml
```

Single errors, e.g. long lines, can be disabled by adding `  # noqa 204` at the end of the line. Please mind the two spaces infront of the `#`. The `204` is the respective error number.
