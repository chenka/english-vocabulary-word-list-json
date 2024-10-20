import fs from "fs"

// Read Oxford dictionary data from file
const oxfordDictData = fs.readFileSync("oxford_dict.json", "utf-8")
const oxfordDict = JSON.parse(oxfordDictData)

const ankiStartContent = `
#separator:pipe
#html:true
`
function main(fileName: string) {
  const text = fs.readFileSync(fileName, "utf-8")
  const oxford3000List = text.split("\n").map((word) => word.trim())

  const filteredWords = oxfordDict.filter((entry) => {
    return oxford3000List.includes(entry.word.toLowerCase())
  })

  const ankiData = formatDefinitionText(
    ankiStartContent +
      filteredWords
        .map((entry) => `${entry.word} | ${entry.meaning}`)
        .join("\n")
  )

  const basefileName = fileName.replace(".txt", "")
  writeJSONFile(`${basefileName}.json`, filteredWords)
  writeAnkiFile(`${basefileName}.anki.txt`, ankiData)
  console.log(ankiData)
}

function formatDefinitionText(input: string): string {
  // Add <br> before any number followed by a space
  let formattedText = input.replace(/(?<=\D)(\d+) /g, "<br>$1 ")

  // Add <br> before '--'
  formattedText = formattedText.replace(/(—[a-zA-Z])/g, "<br>$1")

  return formattedText
}
function writeJSONFile(fileName: string, data) {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2))
}
function writeAnkiFile(fileName: string, ankiData: string) {
  fs.writeFileSync(fileName, ankiData)
}

main("oxford_3000.txt")
main("oxford_5000.txt")
