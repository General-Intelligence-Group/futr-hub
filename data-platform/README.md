# Urban Data Platform on Docker

> This version of the platform is a prototype and not maintained actively anymore. The actively maintained version of the the platform can be found [here](https://gitlab.com/berlintxl/futr-hub/platform/data-platform-k8s).

This repository provides you an automated setup for an Urban Data Base Platform based on a container deployment on a docker engine.

We started the work on this repository in May 2020 with the idea in mind, that at least an Proof-of-concept ready fully automated base platform for Smart City Use Cases should exist as a starting point for cities to experiment with Smart City Use Cases without reinventing the wheel again and again. As a core component of the Platform we use the [FIWARE](https://fiware.org) Context Broker, the SensorThingsAPI Server [FROST](https://github.com/FraunhoferIOSB/FROST-Server) and other Standard Open Source Components.

This first published version ist the starting point for this idea and we are highly motivated to let this grow as an Open Source Platform for Smart Cities .

The current Scope of the Platform contains the following components:

* Identity Management
* Reverse Proxy with fully automated SSL Support for all components
* API Management
* Context Management
* Data Flow Management
* Historical Data Management
* Data Visualization

All used components are open source software components with active communities. This repository provides on top of the components itself the needed end-to-end configurations to use these tools in the Urban Data Domain.

If you are interested please find more detailed information in the following documents:

* [Install](00_documents/INSTALL.md)

## Contributing

Before raising a pull-request, please read our
[contributing guide](00_documents/CONTRIBUTING.md).

This project adheres to the [Contributor Covenant 1.4](http://contributor-covenant.org/version/1/4/).
 By participating, you are expected to uphold this code. Please report unacceptable
 behavior to any of the project's core team (see Authors).

## Known Issues

Currently there are two bigger issues to solve:

1. Create default.yml values by an additional playbook
2. Freeze Version Numbers per Component

## License

This work is licensed under [EU PL 1.2](LICENSE) by the State of Berlin, Germany, represented by [Tegel Projekt GmbH](https://www.tegelprojekt.de/). Please see the [list of authors](https://gitlab.com/berlintxl/futr-hub/getting-started/-/blob/master/AUTHORS-ATTRIBUTION.md) and [list of contributors](https://gitlab.com/berlintxl/futr-hub/getting-started/-/blob/master/LIST-OF-CONTRIBUTORS.md).

All contributions to this repository from January 1st 2020 on are considered to be licensed under the EU PL 1.2 or any later version.
This project doesn't require a CLA (Contributor License Agreement). The copyright belongs to all the individual contributors. For further information, please see the [guidelines for contributing](https://gitlab.com/berlintxl/futr-hub/getting-started/-/blob/master/CONTRIBUTING.md).
