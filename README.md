<h1 align="center">Nx Angular Env</h1>

This plugin for Nx offers a modern approach to configuring Angular applications.
Traditionally, each Angular project has its own set of `environment.*.ts` files to cover different environments.
While this method works, it can become cumbersome as the project grows, especially for containerized deployments.
That's where **Nx Angular Env** comes in, providing a more flexible and scalable solution by utilizing environment variables.

## Contents

- 🛠️ [Overview](#%EF%B8%8F-overview)
- 📦 [Installation](#-installation)
- 🚀 [Usage](#-usage)
- 🤝 [Support](#-support)

## 🛠️ Overview

**Nx Angular Env** requires a single TypeScript template file for each project.
This template maps TypeScript variables to external environment variables, optionally providing default values.
Here's an example of what the template file could look like:

```typescript
// environment.template.ts
const env = {}
export const environment = {
  production: env["IS_PRODUCTION"] ?? false,
  apiUrl: env["API_URL"] ?? "http://localhost:8080",
}
```

The generated environment file could then look like this:

```typescript
// environment.ts
export const environment = {
  production: true,
  apiUrl: "https://api.example.com",
}
```

By following this approach, you can configurate Angular applications with external environment variables.
In Docker, for example, you can use the `--env` flag to set environment variables.
For local development or repository-level configuration, you can also set environment variables using `.env` files.
Read more about the usage of `.env` files [here](#usage-of-env-files).

## 📦 Installation

### Prerequisites

Make sure you have the following:

- An existing Nx workspace
- An Angular project set up within this workspace

### Step 1: Install the plugin

NPM:

```shell
npm install nx-angular-env --save-dev
```

Yarn:

```shell
yarn add nx-angular-env --dev
```

### Step 2: Configure a new target

Configure a new target in your project's `project.json` file and use the `nx-angular-env:prepare` executor.

#### Options

| Option         | Description                                         | Default                                      |
| -------------- | --------------------------------------------------- | -------------------------------------------- |
| `envFile`      | Path to the environment file to be generated        | None                                         |
| `templateFile` | Path to the environment file to be used as template | `{envFileDirectory}/environment.template.ts` |

<details>
<summary>Example</summary>

```json
{
  "prepare-env": {
    "executor": "nx-angular-env:prepare",
    "options": {
      "envFile": "apps/my-app/src/environment.ts",
      "templateFile": "apps/my-app/src/environment.template.ts"
    }
  }
}
```

</details>

### Step 3: Integrate the target into your workflow

To make sure that the generated environment file is up to date before building, serving or testing your app, you need to add the `prepare-env` target as a dependency to the respective targets.

<details>
<summary>Example</summary>

```json
{
  "build": {
    "executor": "@angular-devkit/build-angular:application",
    "dependsOn": ["prepare-env"]
  },
  "serve": {
    "executor": "@angular-devkit/build-angular:dev-server",
    "dependsOn": ["prepare-env"]
  },
  "test": {
    "executor": "@nx/jest:jest",
    "dependsOn": ["prepare-env"]
  }
}
```

</details>

### Step 4: Create a template file

Define the variables and their default values in a template file like in the following example:

```typescript
// environment.template.ts
const env = {}
export const environment = {
  production: env["IS_PRODUCTION"] ?? false,
  apiUrl: env["API_URL"] ?? "http://localhost:8080",
}
```

[//]: # "🌟 **Tip**:"
[//]: # "If you have an existing `environment.ts` file, simply run the `prepare-env` target once to conveniently create a starter template."

### Step 5: Ignore the environment file

It is recommended to ignore the `environment.ts` file in your version control system.

## 🚀 Usage

After successful installation and configuration, you can use environment variables to configure your Angular application.
Whenever your app is built, served or tested, the plugin updates the environment file.

### Manual generation

You can run the `prepare-env` target to manually generate the environment file:

```shell
nx prepare-env my-app
```

### Usage of `.env` files

Nx provides a flexible way to manage environment variables in your project.
It reads `.env` files for different configurations or targets on a workspace or app level.
For example, you can have files like `.development.env` and `.production.env` in your workspace or app root.

<details>
<summary>Order of Priority</summary>

Environment variables follow a specific order of priority, with the highest importance given to the system environment.
Below is the order of precedence for environment configurations:

| #   | Configuration File                          | Description                                        |
| --- | ------------------------------------------- | -------------------------------------------------- |
| 1   | System Environment                          | Primary and overarching configuration source       |
| 2   | `apps/my-app/.env.<target>.<configuration>` | Target and configuration-specific environment file |
| 3   | `apps/my-app/.<target>.<configuration>.env` | Alternative format for above                       |
| 4   | `apps/my-app/.env.<configuration>`          | Configuration-specific environment file            |
| 5   | `apps/my-app/.<configuration>.env`          | Alternative format for above                       |
| 6   | `apps/my-app/.env.<target>`                 | Target-specific environment file                   |
| 7   | `apps/my-app/.<target>.env`                 | Alternative format for above                       |
| 8   | `apps/my-app/.env.local`                    | Local environment settings for the app             |
| 9   | `apps/my-app/.local.env`                    | Alternative format for above                       |
| 10  | `apps/my-app/.env`                          | General environment file for the app               |
| 11  | `.env.<target>.<configuration>`             | Global, yet target and configuration-specific file |
| 12  | `.<target>.<configuration>.env`             | Alternative format for above                       |
| 13  | `.env.<configuration>`                      | Global configuration-specific environment file     |
| 14  | `.<configuration>.env`                      | Alternative format for above                       |
| 15  | `.env.<target>`                             | Global target-specific environment file            |
| 16  | `.<target>.env`                             | Alternative format for above                       |
| 17  | `.local.env`                                | Global local environment settings                  |
| 18  | `.env.local`                                | Alternative format for above                       |
| 19  | `.env`                                      | The most general, global environment settings file |

</details>

## 🤝 Support

Encountered an issue or have suggestions for improvements?
Feel free to [raise an issue](https://github.com/danielkreitsch/nx-angular-env/issues/new).

Contributions are welcome!
