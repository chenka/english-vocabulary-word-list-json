import fs from "fs"
import path from "path"

const oxfordDictData = fs.readFileSync(
  path.resolve(__dirname, "../oxford_dict.json"),
  "utf-8"
)
const oxfordDict = JSON.parse(oxfordDictData)

const ankiStartContent = `
#separator:pipe
#html:true
`
function main(fileName: string) {
  const filePath = path.resolve(__dirname, "..", fileName)
  const text = fs.readFileSync(filePath, "utf-8")
  const oxfordList = text.split("\n").map((word) => word.trim())
  const filteredWords = oxfordDict.filter((entry) => {
    return oxfordList.includes(entry.word.toLowerCase())
  })

  const ankiData = formatDefinitionText(
    ankiStartContent +
      filteredWords
        .map((entry) => `${entry.word} | ${entry.meaning}`)
        .join("\n")
  )

  const basefileName = fileName.replace(".txt", "").replace("_words", "")
  writeJSONFile(`${basefileName}_dictionary.json`, filteredWords)
  writeAnkiFile(`${basefileName}.anki.txt`, ankiData)
}

function formatDefinitionText(input: string): string {
  // Add <br> before any number followed by a space
  let formattedText = input.replace(/(?<=\D)(\d+) /g, "<br>$1 ")

  // Add <br> before '--'
  formattedText = formattedText.replace(/(—[a-zA-Z])/g, "<br>$1")

  return formattedText
}
function writeJSONFile(fileName: string, data) {
  console.log("Writing JSON file:", fileName)
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2))
}
function writeAnkiFile(fileName: string, ankiData: string) {
  console.log("Writing Anki file:", fileName)
  fs.writeFileSync(fileName, ankiData)
}

main("oxford_3000_words.txt")
main("oxford_5000_words.txt")
