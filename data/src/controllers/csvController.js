const parse = require("csv-parse");
const connection = require("../database/index");
const fs = require("fs");

class CsvController {
  async changeCsvToTxt(req, res) {
    try {
      let csvrow = [];
      let i = 0;
      fs.createReadStream("src/files/data.csv")
        //fs.createReadStream('src/files/teste.txt')
        .pipe(parse({ delimiter: ";" }))
        .on("data", function (csv) {
          csvrow.push(csv);
          i++;
          //do something with csvrow
        })
        .on("end", async function () {
          console.log(csvrow[0][0], csvrow.length, "TA");
          let data="* SANTA MARIA LATICINIOS *\n ";
          for (let i = 2; i < csvrow.length; i++) {
                    data = data + "\n " + csvrow[i][0] + "\n " 
                if(csvrow[i][2] !== ""){
                    data = data + "Requeijão Cheddar Premium 1.010KG: R$" + csvrow[i][2] + "\n "
                }
                if(csvrow[i][4] !== ""){
                    data = data + "Requeijão Cheddar Premium 1.8KG: R$" + csvrow[i][4] + "\n "
                }
                if(csvrow[i][6] !== ""){
                    data = data + "Requeijão Cheddar Premium 10KG: R$" + csvrow[i][6]+"\n "
                }
                if(csvrow[i][8] !== ""){
                    data = data + "Requeijão Cheddar Premium 3.6KG: R$" + csvrow[i][8] + "\n "
                }
                if(csvrow[i][10] !== ""){
                    data = data + "Requeijão Cheddar Tradicional 1.8KG: R$" + csvrow[i][10] + "\n "
                }
                if(csvrow[i][12] !== ""){
                    data = data + "Doce de leite com Chocolate 1.2KG: R$" + csvrow[i][12] + "\n "
                }
                if(csvrow[i][14] !== ""){
                    data = data + "Doce de leite com Chocolate 4.6KG: R$" + csvrow[i][14] + "\n "
                }
                if(csvrow[i][16] !== ""){
                    data = data + "Doce de leite com Chocolate 400G: R$" + csvrow[i][16] + "\n "
                }
                if(csvrow[i][18] !== ""){
                    data = data + "Doce de leite com Ameixa 4.6KG: R$" + csvrow[i][18] + "\n "
                }
                if(csvrow[i][20] !== ""){
                    data = data + "Doce de leite com Côco 4.6KG: R$" + csvrow[i][20] + "\n "
                }
                if(csvrow[i][22] !== ""){
                    data = data + "Doce de leite puro 1.2KG: R$" + csvrow[i][22] + "\n "
                }
                if(csvrow[i][24] !== ""){
                    data = data + "Doce de leite puro 4.6KG: R$" + csvrow[i][24] + "\n "
                }
                if(csvrow[i][26] !== ""){
                    data = data + "Doce de leite puro 400G: R$" + csvrow[i][26] + "\n "
                }
                if(csvrow[i][28] !== ""){
                    data = data + "Doce de leite puro 9.8KG: R$" + csvrow[i][28] + "\n "
                }
                if(csvrow[i][30] !== ""){
                    data = data + "Parmesão Kilo: R$" + csvrow[i][30] + "\n "
                }
                if(csvrow[i][32] !== ""){
                    data = data + "Parmesão Peça: R$" + csvrow[i][32] + "\n "
                }
                if(csvrow[i][34] !== ""){
                    data = data + "Requeijão barra 500G: R$" + csvrow[i][34] + "\n "
                }
                if(csvrow[i][36] !== ""){
                    data = data + "Requeijão barra KG: R$" + csvrow[i][36] + "\n "
                }
                if(csvrow[i][38] !== ""){
                    data = data + "Requeijão moreno: R$" + csvrow[i][38] + "\n "
                }
                if(csvrow[i][40] !== ""){
                    data = data + "Requeijão Premium 1.010KG: R$" + csvrow[i][40] + "\n "
                }
                if(csvrow[i][42] !== ""){
                    data = data + "Requeijão Premium 1.8KG: R$" + csvrow[i][42] + "\n "
                }
                if(csvrow[i][44] !== ""){
                    data = data + "Requeijão Premium 10KG: R$" + csvrow[i][44] + "\n "
                }
                if(csvrow[i][46] !== ""){
                    data = data + "Requeijão Premium 3.6KG: R$" + csvrow[i][46] + "\n "
                }
                if(csvrow[i][48] !== ""){
                    data = data + "Requeijão Premium 400G: R$" + csvrow[i][48] + "\n "
                }
                if(csvrow[i][50] !== ""){
                    data = data + "Requeijão Tradicional 1.010KG: R$" + csvrow[i][50] + "\n "
                }
                if(csvrow[i][52] !== ""){
                    data = data + "Requeijão Tradicional 1.8KG: R$" + csvrow[i][52] + "\n "
                }
                if(csvrow[i][54] !== ""){
                    data = data + "Requeijão Tradicional 3.6KG: R$" + csvrow[i][54] + "\n "
                }
          }
          fs.writeFile("src/files/data.txt", data, function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          });
        });
        return res.json({message: "File was created"})
    } catch (error) {
      return res.status(400).json({ error: "Unable to store files: " + error });
    }
  }
}
module.exports = CsvController;
