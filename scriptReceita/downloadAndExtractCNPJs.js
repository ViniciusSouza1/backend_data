// downloadAndExtractCNPJs.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const unzipper = require("unzipper");

const BASE_URL = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/";
const DOWNLOAD_DIR = path.resolve("./cnpj_data/zips");
const EXTRACT_DIR = path.resolve("./cnpj_data/extracted");

// Cria pastas
[DOWNLOAD_DIR, EXTRACT_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Pega todos os links de uma página (arquivos e pastas)
async function getFileLinks(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const links = [];
  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (href && !href.startsWith("?") && !href.startsWith("/")) {
      links.push(href);
    }
  });

  return links;
}

// Faz download de um arquivo
async function downloadFile(fileUrl, outputPath) {
  const writer = fs.createWriteStream(outputPath);

  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "stream",
    headers: { "User-Agent": "Mozilla/5.0" }, // garante que não receba HTML diferente
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Extrai arquivos ZIP
async function extractZip(zipPath, extractTo) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractTo }))
      .on("close", resolve)
      .on("error", reject);
  });
}

// Processa recursivamente: entra em pastas até achar os ZIPs
async function processDirectory(url, baseFolder = "") {
  const links = await getFileLinks(url);

  for (const link of links) {
    if (link.endsWith("/")) {
      // Subpasta → processa recursivamente
      console.log(`📂 Entrando na pasta: ${url}${link}`);
      await processDirectory(url + link, path.join(baseFolder, link));
    } else if (link.endsWith(".zip")) {
      // Arquivo ZIP → baixa e extrai
      const fileUrl = url + link;
      const outputZip = path.join(DOWNLOAD_DIR, baseFolder, link);

      // Cria pasta local equivalente
      fs.mkdirSync(path.dirname(outputZip), { recursive: true });

      // Baixa se não existir
      if (!fs.existsSync(outputZip)) {
        console.log(`⬇️ Baixando: ${fileUrl}`);
        await downloadFile(fileUrl, outputZip);
        console.log(`📥 Salvo em: ${outputZip}`);
      } else {
        console.log(`✅ Já existe: ${outputZip}`);
      }

      // Extrai
      const extractPath = path.join(EXTRACT_DIR, baseFolder, path.basename(link, ".zip"));
      fs.mkdirSync(extractPath, { recursive: true });

      console.log(`📦 Extraindo: ${outputZip}`);
      await extractZip(outputZip, extractPath);
      console.log(`✅ Extraído em: ${extractPath}`);
    }
  }
}

async function main() {
  console.log("🔎 Buscando arquivos no site da Receita...");
  await processDirectory(BASE_URL);
  console.log("🎉 Processo concluído!");
}

main().catch((err) => console.error("❌ Erro:", err));
