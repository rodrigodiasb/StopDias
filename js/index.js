// js/index.js
import { db } from './firebase-config.js';
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

window.criarPartida = async function () {
  const nome = document.getElementById("nomeJogador").value.trim();
  if (!nome) return alert("Digite seu nome!");

  const codigo = gerarCodigo();
  await set(ref(db, "partidas/" + codigo), {
    config: {
      mediador: nome,
      status: "aguardando",
      categorias: [],
      tempo: 60,
      rodadas: 3
    },
    jogadores: {
      [nome]: { pontuacao: 0 }
    }
  });

  localStorage.setItem("nome", nome);
  localStorage.setItem("codigo", codigo);
  window.location.href = "mediador.html";
}

window.entrarPartida = async function () {
  const nome = document.getElementById("nomeJogador").value.trim();
  const codigo = document.getElementById("codigoPartida").value.trim().toUpperCase();
  if (!nome || !codigo) return alert("Preencha nome e código!");

  const snapshot = await get(child(ref(db), "partidas/" + codigo));
  if (!snapshot.exists()) return alert("Partida não encontrada!");

  await set(ref(db, `partidas/${codigo}/jogadores/${nome}`), { pontuacao: 0 });

  localStorage.setItem("nome", nome);
  localStorage.setItem("codigo", codigo);
  window.location.href = "jogador.html";
}
