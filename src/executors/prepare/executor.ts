import { PrepareExecutorSchema } from "./schema"
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs-extra"
import * as path from "path"

export default async function runExecutor(options: PrepareExecutorSchema) {
  console.log("Preparing script")

  const { envFile } = options
  let { templateFile } = options

  if (!templateFile) {
    templateFile = path.join(path.dirname(envFile), "environment.template.ts")
  }

  if (!existsSync(templateFile)) {
    if (!existsSync(envFile)) {
      console.error(
        `Could not find environment file at ${envFile}. Please specify the path to your environment file by adding the "envFile" option to your project.json.`
      )
      return { success: false }
    }

    // Copy template file from environment file and add env variable declaration
    let fileContent = readFileSync(envFile, "utf8")
    if (!fileContent.includes(" env =")) {
      fileContent = "const env = {};\n" + fileContent
    }
    writeFileSync(templateFile, fileContent)
  }

  // Copy environment file from template file, replace placeholders and remove env variable declaration
  let fileContent = readFileSync(templateFile, "utf8")
  fileContent = replacePlaceholders(fileContent)
  fileContent = removeLinesContainingEnvDeclaration(fileContent)
  writeFileSync(envFile, fileContent)

  return {
    success: true,
  }
}

function replacePlaceholders(content: string): string {
  return content.replace(
    /\benv\["(.*?)"]|\benv\['(.*?)']|\benv\[`(.*?)`]/g,
    (_, envVar1, envVar2, envVar3) => {
      const envVar = envVar1 || envVar2 || envVar3
      return formatValueAsString(process.env[envVar])
    }
  )
}

function removeLinesContainingEnvDeclaration(input: string): string {
  const lines = input.split("\n")
  const filteredLines = lines.filter((line) => !line.includes(" env ="))
  return filteredLines.join("\n")
}

function formatValueAsString(value: string | undefined): string {
  if (value === undefined) {
    return "undefined"
  }

  if (!isNaN(Number(value))) {
    return value
  }

  if (["true", "false"].includes(value.toLowerCase())) {
    return value
  }

  return `"${value}"`
}
