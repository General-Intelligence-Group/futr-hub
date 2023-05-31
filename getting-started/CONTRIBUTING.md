**Content of this document**  

[[_TOC_]]

# Contribution Guide
This guide will give some hints if you want to contribute to the **FUTR Hub** project.
## General
If you plan to contribute, please check first if your contribution is related to the platform, the use cases or tools and find the appropriate location within the project's structure.
### Project Structure
* The project is divided into [platform](https://gitlab.com/berlintxl/futr-hub/platform), [use-cases](https://gitlab.com/berlintxl/futr-hub/use-cases) and [tools](https://gitlab.com/berlintxl/futr-hub/tools).
* The **platform** folder contains everything needed to set up the platform.
* Within the **uses cases** folder, every use case resides within its own sub folder with one or more repositories.
* Components, neither related to **platform** nor to **use cases** are located within a sub-folder in the **tools**-folder.
### Naming Conventions
* All names (groups and projects) are lowercase and delimited by a hyphen (e.g. group-or-project-name).
* The project's/group's name **MUST** refer to the project's/group's slug! (Avoid "Umlaute" and special characters, e.g. "ä"->"ae").
* Prefer rather explicit and longer project/subgroup names that provide good understanding of the project's objectives.
* For new **use cases** and **tools**:
  * avoid vendor names like "PAX...", "Osram..." - keep the name vendor independent.
  * avoid city names like "BTXL..." - keep the name city independent.
### Using Diagrams for Documentation
* Please use [draw.io](http://diagrams.net) as tool
* Put the source source file (e.g. diagram.drawio) next to the exported image file (e.g. diagram.png). The latter you can include in the markdown documentation. Keep both files in sync, of course.
* **Exception**: Check if there is a `.gitlab-ci.yml` file on the highest level in the repository. If so, a change in the drawio file may trigger the repository's pipeline. To avoid this, consider putting the drawio file to the nearest getting-started repository (often it's one level higher) and only let the exported image file reside in the repository where the documentation references it. Then, indicate the location of the exported image file using a descriptive file in the diagram's source file: e.g. for a diagram in the getting-started project within the use-cases subgroup: `usecase-name_readme_overview.drawio`.
### Content of a Project
If you plan to contribute with a **NEW** use case or tool, please consider, having at least:
* A `README.md` file  
  This file gives a high level description of the project.  
  It may also describe, how the project is set up (if no **Admin Guide** is provided) and/or how to use the project (if no **User Guide** is provided). 
* A `LICENSE` file  
  A license file per project is mandatory.
* A `CONTRIBUTING.md` file  
  This file explains, how others can contribute to the project.  
  
and optional:
* An `AdminGuide.md` file  
  Explain here, how the project is set up.
* A `UserGuide.md` file  
  Explain here, how to utilize the project.
## Contribute to the Platform
If you want to contribute to the platform, please refer to the [Contribution Guide](https://gitlab.com/berlintxl/futr-hub/platform/data-platform/-/blob/master/00_documents/CONTRIBUTING.md) within the [platform](https://gitlab.com/berlintxl/futr-hub/platform) project.
## Contribute to the Use Cases
If you want to contribute to the use cases, please refer to the [Contribution Guide](https://gitlab.com/berlintxl/futr-hub/use-cases/getting-started/-/blob/master/CONTRIBUTING.md) within the [use-cases](https://gitlab.com/berlintxl/futr-hub/use-cases) subgroup.
## Contribute to the Tools
If you want to contribute to an existing tool, please refer to its CONTRIBUTING.md-file.  
If you plan to add a new tool to the tools-folder, please keep this general Contribution Guide in mind.

## How to apply the license
All contributions to this project from January 1st 2020 on are considered to be licensed under the [EU PL 1.2](LICENSE) or any later version.
This project doesn't require a CLA (Contributor License Agreement). The copyright belongs to all the individual contributors. 

Therefore, each file should begin with the following lines:

```
# This work has been created or enhanced by
#    <your name>, <year>
#
# This file is covered by the EU PL 1.2 license.
# You may obtain a copy of the licence at
# https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
# 
```

Please add this header if it does not exist and add your name, if you changed the file substantially.

