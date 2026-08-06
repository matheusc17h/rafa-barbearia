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
      cardDestaque.style.display = "flex"
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

