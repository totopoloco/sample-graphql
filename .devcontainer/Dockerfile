# [Choice] Node.js version: 18, 16, 14
ARG VARIANT="18"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# [Optional] Install pnpm
RUN npm install -g pnpm

# [Optional] Install additional OS packages.
 RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends vim

# [Optional] Install additional global node packages.
# RUN npm install -g <your-package-list-here>

COPY .devcontainer/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod a+x /usr/local/bin/entrypoint.sh
#RUN /usr/local/bin/entrypoint.sh
#ADD entrypoint.sh /usr/local/bin/entrypoint.sh

# Set the entrypoint to the script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]