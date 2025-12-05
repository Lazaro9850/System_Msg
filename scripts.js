const mensagens = [];

function atualizar_tela() {
   const lista = document.getElementById("lista_mensagens");
   lista.innerHTML = "";
   mensagens.forEach((msg, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${msg}`;
      lista.appendChild(li);
   });
}

function buscar_mensagens() {
   fetch("http://vianetminas.com.br/mensagens/listar_mensagens.php")
      .then(res => res.json())
      .then(data => {
         mensagens.length = 0;
         mensagens.push(...data.map(obj => obj.conteudo));
         atualizar_tela();
      })
      .catch(error => {
         console.error("Erro ao buscar mensagens:", error);
      });
}

function enviar_mensagem() {
   const input = document.getElementById("input_mensagem");
   const input_user = document.getElementById("input_user");
   const texto = input.value.trim();
   const nome_user = input_user.value.trim();
   if (texto !== "" && nome_user !== "") {
      const usuario_texto = `${nome_user}: ${texto}`;
      mensagens.push(usuario_texto);
      input.value = "";
      atualizar_tela();

      fetch("http://vianetminas.com.br/mensagens/enviar_mensagem.php", {
         method: "POST",
         headers: {
            "Content-type": "application/x-www-form-urlencoded"
         },
         body: "mensagem=" + encodeURIComponent(usuario_texto)
      });
   }
}

function remover_ultima() {
   fetch("http://vianetminas.com.br/mensagens/remover_ultima.php")
      .then(() => buscar_mensagens())
      .catch(error => console.error("Erro ao remover a última mensagem:", error));
}

function apagar_tudo() {
   mensagens.length = 0;
   atualizar_tela();
   fetch("http://vianetminas.com.br/mensagens/limpar_mensagens.php");
}

// ✅ Chamada inicial e atualizações a cada 3 segundos
window.onload = function () {
   buscar_mensagens(); // primeira vez
   setInterval(buscar_mensagens, 3000); // a cada 3 segundos
};

document.addEventListener('keydown', function (event) {
   const inputMensagem = document.getElementById("input_mensagem");
   const inputUser = document.getElementById("input_user");

   // Só envia se o foco estiver em um dos inputs e a tecla for Enter
   if (event.key === "Enter" && (document.activeElement === inputMensagem || document.activeElement === inputUser)) {
      event.preventDefault(); // impede o comportamento padrão do Enter (como enviar o form)
      enviar_mensagem(); // chama sua função de envio
   }
});

document.getElementById("input_mensagem").addEventListener("input", function () {
   const contador = document.querySelector("#contador_caracteres .p2");
   contador.textContent = `${this.value.length}/100`;
});


//                MALHA QUADRICULADA

/* === MALHA QUADRICULADA DINÂMICA ===================== */
const gridSize = 80;
const malha = document.getElementById('malha');
let colunas = 0;
let linhas = 0;

function criaMalha() {
   malha.innerHTML = '';
   colunas = Math.ceil(window.innerWidth / gridSize);
   linhas = Math.ceil(window.innerHeight / gridSize);
   malha.style.gridTemplateColumns = `repeat(${colunas}, ${gridSize}px)`;

   const total = colunas * linhas;

   for (let i = 0; i < total; i++) {
      const q = document.createElement('div');
      q.className = 'quadrado';

      const linha = Math.floor(i / colunas);
      const delay = linha * 0.1; // 0.1s de delay por linha

      q.style.animationDelay = `${delay}s`;

      malha.appendChild(q);
   }
}


// Listener separado e armazenado para poder remover depois
function onMouseMove(e) {
   const rect = malha.getBoundingClientRect();
   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;

   if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
      return; // Fora do elemento malha
   }

   const c = Math.floor(x / gridSize);
   const l = Math.floor(y / gridSize);
   const idx = l * colunas + (c);
   if (idx < 0) return; // evita índice negativo

   const alvo = malha.children[idx];
   if (!alvo) return;

   alvo.classList.add('aceso');
   clearTimeout(alvo._timer);
   alvo._timer = setTimeout(() => {
      alvo.classList.remove('aceso');
   }, 1000);
}

function setup() {
   criaMalha();
   document.removeEventListener('mousemove', onMouseMove);
   document.addEventListener('mousemove', onMouseMove);
}

setup();
window.addEventListener('resize', setup);
