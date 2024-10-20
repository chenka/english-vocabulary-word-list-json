import * as fs from "fs"
import * as path from "path"

interface Entry {
  word: string
  meaning: string
}

async function readJSONFile(filePath: string): Promise<Entry[]> {
  const fileContent = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(fileContent)
}

async function writeAnkiFile(outputPath: string, data: Entry[]): Promise<void> {
  const ankiContent = data
    .map((entry) => `${entry.word};${entry.meaning}`)
    .join("\n")
  fs.writeFile(outputPath, ankiContent, (err) => {
    if (err) {
      console.error("Error writing Anki file:", err)
    } else {
      console.log("Anki file written successfully")
    }
  })
}

async function readTextFile(filePath: string): Promise<string[]> {
  const fileContent = fs.readFileSync(filePath, "utf-8")
  return fileContent.split(/\r?\n/).filter((line) => line.trim() !== "")
}

async function writeJSONFile(
  outputPath: string,
  data: string[]
): Promise<void> {
  const entries = data.map((word) => ({ word, meaning: "" }))
  fs.writeFile(outputPath, JSON.stringify(entries, null, 2), (err) => {
    if (err) {
      console.error("Error writing JSON file:", err)
    } else {
      console.log("JSON file written successfully")
    }
  })
}

;(async () => {
  const jsonFilePath = path.resolve(__dirname, "oxford_5000.json")
  const ankiOutputPath = path.resolve(__dirname, "oxford_dict_anki.txt")
  const textFilePath = path.resolve(__dirname, "oxford_5000.txt")
  const jsonOutputPath = path.resolve(__dirname, "oxford_5000.json")

  try {
    // Create oxford_5000.json from oxford_5000.txt
    const words = await readTextFile(textFilePath)
    await writeJSONFile(jsonOutputPath, words)

    // Read from oxford_5000.json and write to Anki file
    const entries = await readJSONFile(jsonFilePath)
    await writeAnkiFile(ankiOutputPath, entries)
  } catch (error) {
    console.error("Error processing files:", error)
  }
})()
