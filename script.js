// ==============================
// STACK EFFECT (inicio/products/about)
// ==============================
const stackSections = document.querySelectorAll(".inicio, .products, .about");

function atualizarStack() {
  stackSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const progresso = (-rect.top) / window.innerHeight;

    if (progresso > 0 && progresso < 1) {
      const escala = 1 - progresso * 0.08;
      const opacidade = 1 - progresso * 0.4;

      section.style.transform = `scale(${escala})`;
      section.style.opacity = opacidade;
      section.style.borderRadius = "20px";
    }

    if (progresso <= 0) {
      section.style.transform = "scale(1)";
      section.style.opacity = "1";
      section.style.borderRadius = "0px";
    }
  });
}

window.addEventListener("scroll", atualizarStack);



// ==============================
// GALLERY ANIMATION (scroll down / scroll up)
// ==============================
let lastScrollY = window.scrollY;
const galleryItems = document.querySelectorAll(".gallery-item");

const galleryObserver = new IntersectionObserver((entries) => {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.style.transform = "translateY(0)";
    } else {
      entry.target.classList.remove("show");

      // se o usuário está descendo, some pra baixo
      if (scrollingDown) {
        entry.target.style.transform = "translateY(70px)";
      }
      // se o usuário está subindo, some pra cima
      else {
        entry.target.style.transform = "translateY(-70px)";
      }
    }
  });

  lastScrollY = currentScrollY;
}, { threshold: 0.15 });

galleryItems.forEach((item) => {
  galleryObserver.observe(item);
});

fetch("http://localhost:3333/health")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));


document.getElementById("btn-inicio").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("inicio").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("btn-servicos").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("servicos").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("btn-sobre").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("sobre").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("btn-agendamento").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("agendamento").scrollIntoView({
        behavior: "smooth"
    });
});


const filterBtns = document.querySelectorAll(".filter-btn");
const itensGaleria = document.querySelectorAll(".gallery-item");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filtro = btn.dataset.filter;
        const cardDestaque = document.querySelector(".gallery-item-destaque")

        // Card destaque só aparece em "todos"
        if (filtro === "todos") {
            cardDestaque.style.display = "block"
        } else {
            cardDestaque.style.display = "none"
        }

        itensGaleria.forEach(item => {

            // Pula o card destaque — já tratamos acima
            if (item.classList.contains("gallery-item-destaque")) return

            const categorias = item.dataset.category
                ? item.dataset.category.split(" ")
                : [];

            if (filtro === "todos") {
                if (categorias.includes("navalha")) {
                    item.style.display = "none";
                } else {
                    item.style.display = "block";
                }
                return;
            }

            if (categorias.includes(filtro)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});

// ==============================
// CONFIGURAÇÃO DA API
// ==============================
const API_URL = "http://localhost:3333"

// ==============================
// ABRIR / FECHAR MODAIS
// ==============================
const modalAuth = document.getElementById("modal-auth")
const modalAgendamento = document.getElementById("modal-agendamento")
const telaLogin = document.getElementById("tela-login")
const telaCadastro = document.getElementById("tela-cadastro")

// Abre modal de login ao clicar em "Agendar Horário"
document.querySelector(".conteudo button").addEventListener("click", () => {
  modalAuth.style.display = "flex"
})

document.querySelector(".location-cta").addEventListener("click", (e) => {
  e.preventDefault()
  modalAuth.style.display = "flex"
})

// Fechar modais
document.getElementById("fechar-modal").addEventListener("click", () => {
  modalAuth.style.display = "none"
})

document.getElementById("fechar-modal-2").addEventListener("click", () => {
  modalAuth.style.display = "none"
})

document.getElementById("fechar-agendamento").addEventListener("click", () => {
  modalAgendamento.style.display = "none"
})

// Trocar entre login e cadastro
document.getElementById("ir-cadastro").addEventListener("click", () => {
  telaLogin.style.display = "none"
  telaCadastro.style.display = "block"
})

document.getElementById("ir-login").addEventListener("click", () => {
  telaCadastro.style.display = "none"
  telaLogin.style.display = "block"
})

// ==============================
// CADASTRO
// ==============================
document.getElementById("btn-cadastrar").addEventListener("click", async () => {
  const nome = document.getElementById("cadastro-nome").value
  const email = document.getElementById("cadastro-email").value
  const senha = document.getElementById("cadastro-senha").value
  const erro = document.getElementById("cadastro-erro")

  erro.textContent = ""

  // Validação básica
  if (!nome || !email || !senha) {
    erro.textContent = "Preencha todos os campos!"
    return
  }

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome, email, password: senha })
    })

    const data = await response.json()

    if (!response.ok) {
      erro.textContent = data.message || "Erro ao criar conta"
      return
    }

    // Cadastro ok → faz login automático
    await fazerLogin(email, senha)

  } catch (err) {
    erro.textContent = "Erro de conexão com o servidor"
  }
})

// ==============================
// LOGIN
// ==============================
document.getElementById("btn-entrar").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value
  const senha = document.getElementById("login-senha").value
  const erro = document.getElementById("login-erro")

  erro.textContent = ""

  if (!email || !senha) {
    erro.textContent = "Preencha todos os campos!"
    return
  }

  await fazerLogin(email, senha)
})

// Função de login reutilizada pelo cadastro e pelo botão entrar
async function fazerLogin(email, senha) {
  const erro = document.getElementById("login-erro")

  try {
    const response = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: senha })
    })

    const data = await response.json()

    if (!response.ok) {
      erro.textContent = data.message || "Email ou senha incorretos"
      return
    }

    // Guarda o token no localStorage
    localStorage.setItem("token", data.token)

    // Fecha modal de auth e abre modal de agendamento
    modalAuth.style.display = "none"
    abrirModalAgendamento()

  } catch (err) {
    erro.textContent = "Erro de conexão com o servidor"
  }
}

// ==============================
// MODAL DE AGENDAMENTO
// ==============================
async function abrirModalAgendamento() {
  modalAgendamento.style.display = "flex"

  // Carrega barbeiros do backend
  const resBarbeiros = await fetch(`${API_URL}/barbers`)
  const barbeiros = await resBarbeiros.json()
  const selectBarbeiro = document.getElementById("ag-barbeiro")
  selectBarbeiro.innerHTML = '<option value="">Escolha o barbeiro</option>'
  barbeiros.forEach(b => {
    selectBarbeiro.innerHTML += `<option value="${b.id}">${b.name}</option>`
  })

  // Carrega serviços do backend
  const resServicos = await fetch(`${API_URL}/services`)
  const servicos = await resServicos.json()
  const selectServico = document.getElementById("ag-servico")
  selectServico.innerHTML = '<option value="">Escolha o serviço</option>'
  servicos.forEach(s => {
    selectServico.innerHTML += `<option value="${s.id}">${s.name} — R$ ${s.price}</option>`
  })
}

// ==============================
// CRIAR AGENDAMENTO
// ==============================
document.getElementById("btn-agendar").addEventListener("click", async () => {
  const barbeiro = document.getElementById("ag-barbeiro").value
  const servico = document.getElementById("ag-servico").value
  const data = document.getElementById("ag-data").value
  const erro = document.getElementById("ag-erro")
  const sucesso = document.getElementById("ag-sucesso")

  erro.textContent = ""
  sucesso.textContent = ""

  if (!barbeiro || !servico || !data) {
    erro.textContent = "Preencha todos os campos!"
    return
  }

  const token = localStorage.getItem("token")

  if (!token) {
    erro.textContent = "Você precisa estar logado!"
    return
  }

  // Pega o userId do token (decodifica o payload)
  const payload = JSON.parse(atob(token.split(".")[1]))
  const userId = payload.sub

  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        date: new Date(data).toISOString(),
        userId,
        barberId: barbeiro,
        serviceId: servico
      })
    })

    const result = await response.json()

    if (!response.ok) {
      erro.textContent = result.message || "Erro ao agendar"
      return
    }

    sucesso.textContent = "✅ Agendamento realizado com sucesso!"

    // Limpa os campos
    document.getElementById("ag-barbeiro").value = ""
    document.getElementById("ag-servico").value = ""
    document.getElementById("ag-data").value = ""

  } catch (err) {
    erro.textContent = "Erro de conexão com o servidor"
  }
})