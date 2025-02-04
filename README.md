# Ory Permissions Demo

## Setup

1. Create a new project on the [Ory Cloud Console](https://console.ory.sh/).
2. Clone the repo.
3. Set the environment variable `ORY_PROJECT` to the project ID (e.g. `export ORY_PROJECT=xxxxxx`). You can find the project ID in the Ory Cloud Console.
4. Run `make opl-up` to update the namespace config.
5. Run `make relationships-up` to create the relationships.

## Cleanup

1. Run `make relationships-down` to delete the relationships.
