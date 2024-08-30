# Yarn Modern (Berry) investigation

As part of the above I have been exploring moving the repo across to yarn modern so everything is on the same: https://github.com/guardian/editions/compare/spike/yarn-berry?expand=1.

The idea being that we reduce the issues seen with releases. Keeping everything on one version of yarn makes sense

However, I have decided that it shouldn't be done yet. This is because each project currently uses different versions of node. As dependency installation is specific to a version and without access to how installation happens on the backend projects, they could fail to install their dependencies on release without us knowing.

As a result, this is something that should take place if/when there is resource for updating the three backend repositories.
