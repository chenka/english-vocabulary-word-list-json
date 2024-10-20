import * as fs from "fs"
import * as path from "path"

interface Entry {
  word: string
  meaning: string
}

async function readTextFile(filePath: string): Promise<Entry[]> {
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const entries: Entry[] = []

  const rows = fileContent.split(/\n{1,2}/)
  rows.forEach((row) => {
    const [word, ...meaningParts] = row.split(/\s{2,}/)
    const meaning = meaningParts.join(" ").trim()

    if (word && meaning) {
      entries.push({ word: word.trim(), meaning })
    }
  })

  return entries
}

async function writeJSONFile(outputPath: string, data: Entry[]): Promise<void> {
  fs.writeFile(outputPath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing JSON file:", err)
    } else {
      console.log("JSON file written successfully")
    }
  })
}

;(async () => {
  const textFilePath = path.resolve(__dirname, "oxford_dict.txt")
  const jsonOutputPath = path.resolve(__dirname, "oxford_dict.json")

  try {
    const entries = await readTextFile(textFilePath)
    await writeJSONFile(jsonOutputPath, entries)
  } catch (error) {
    console.error("Error processing text file:", error)
  }
})()
