const http = require("http");
const net = require("net");
const calculadora = require("./calculadora");

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 5432);

const operacoes = Object.keys(calculadora).filter(
  (k) => typeof calculadora[k] === "function"
);

function checarBanco() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: DB_HOST, port: DB_PORT, timeout: 2000 });
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

const PAGINA = `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="utf-8"><title>Calculadora DevOps</title></head>
<body style="font-family:sans-serif;max-width:480px;margin:40px auto">
<h1>Calculadora</h1>
<input id="a" type="number" placeholder="A">
<select id="op"></select>
<input id="b" type="number" placeholder="B">
<button onclick="calcular()">Calcular</button>
<p id="resultado"></p>
<p id="banco"></p>
<script>
fetch("/api/operacoes").then(function (r) { return r.json(); }).then(function (ops) {
  document.getElementById("op").innerHTML = ops.map(function (o) {
    return "<option>" + o + "</option>";
  }).join("");
});
fetch("/health").then(function (r) { return r.json(); }).then(function (h) {
  document.getElementById("banco").textContent =
    "Banco de dados: " + (h.banco ? "conectado" : "indisponível");
});
function calcular() {
  var a = document.getElementById("a").value;
  var b = document.getElementById("b").value;
  var op = document.getElementById("op").value;
  fetch("/api/calcular?op=" + op + "&a=" + a + "&b=" + b)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      document.getElementById("resultado").textContent =
        d.erro ? "Erro: " + d.erro : "Resultado: " + d.resultado;
    });
}
</script>
</body>
</html>`;

function json(res, status, corpo) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(corpo));
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://localhost");

  if (u.pathname === "/health") {
    return json(res, 200, { status: "ok", banco: await checarBanco() });
  }

  if (u.pathname === "/api/operacoes") {
    return json(res, 200, operacoes);
  }

  if (u.pathname === "/api/calcular") {
    const op = u.searchParams.get("op");
    const a = Number(u.searchParams.get("a"));
    const b = Number(u.searchParams.get("b"));
    if (!operacoes.includes(op)) {
      return json(res, 400, { erro: "operação inválida" });
    }
    try {
      return json(res, 200, { resultado: calculadora[op](a, b) });
    } catch (e) {
      return json(res, 400, { erro: e.message });
    }
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(PAGINA);
});

server.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
