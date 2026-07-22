import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const livekit = path.join(raiz, "server", "livekit", process.platform === "win32" ? "livekit-server.exe" : "livekit-server");
const processos = [];

function iniciar(comando, argumentos, nome) {
  const processo = spawn(comando, argumentos, { cwd: raiz, stdio: "inherit", windowsHide: true });
  processo.on("exit", (codigo) => {
    if (codigo && codigo !== 0) console.error(`[${nome}] encerrado com código ${codigo}.`);
  });
  processos.push(processo);
}

function encerrar() {
  processos.forEach((processo) => { if (!processo.killed) processo.kill(); });
  process.exit(0);
}

iniciar(livekit, ["--dev", "--bind", "127.0.0.1"], "LiveKit");
iniciar(npm, ["run", "start:comunicacao"], "Tokens");
iniciar(npm, ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"], "Site");

process.on("SIGINT", encerrar);
process.on("SIGTERM", encerrar);
