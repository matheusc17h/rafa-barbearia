// =========================================================
// DICHAVA CORTESS — Redesign 2.0
// =========================================================
(() => {
  const root = document.documentElement;
  const hasGsap = typeof window.gsap !== "undefined";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  // ==============================
  // ÍCONES (Lucide — família única)
  // ==============================
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
  }

  // ==============================
  // ANO DO COPYRIGHT
  // ==============================
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ==============================
  // ABERTO / FECHADO (Seg–Sáb, 9h–20h, horário de SP)
  // ==============================
  const status = document.querySelector("[data-status]");
  if (status) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type)?.value;
    const minutes = Number(get("hour")) * 60 + Number(get("minute"));
    const open = get("weekday") !== "Sun" && minutes >= 9 * 60 && minutes < 20 * 60;

    status.classList.add(open ? "is-open" : "is-closed");
    status.querySelector("[data-status-label]").textContent = open ? "Aberto agora" : "Fechado agora";
  }

  // ==============================
  // HEADER
  // ==============================
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ==============================
  // MENU MOBILE
  // ==============================
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".menu-toggle");

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (open) nav.querySelector("a")?.focus({ preventScroll: true });
  };

  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  // ==============================
  // LINK ATIVO NO MENU
  // ==============================
  const navLinks = [...nav.querySelectorAll("a")];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute("href") === `#${entry.target.id}`) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  navLinks.forEach((a) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) sectionObserver.observe(target);
  });

  // ==============================
  // GALERIA — FILTRO
  // ==============================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryGrid = document.querySelector(".gallery__grid");
  const galleryItems = [...document.querySelectorAll(".gallery__item")];

  const applyFilter = (filtro) => {
    const flip = hasGsap && window.Flip && !reduceMotion.matches;
    const state = flip ? Flip.getState(galleryItems) : null;
    const fromHeight = galleryGrid.offsetHeight;

    galleryItems.forEach((item) => {
      const categorias = (item.dataset.category || "").split(" ");
      item.classList.toggle("is-hidden", filtro !== "todos" && !categorias.includes(filtro));
    });

    if (flip) {
      // os itens saem do fluxo durante o Flip; a grade anima a própria
      // altura pra seção de baixo não "subir" por cima das fotos
      gsap.fromTo(
        galleryGrid,
        { height: fromHeight },
        { height: galleryGrid.offsetHeight, duration: 0.55, ease: "power3.inOut", clearProps: "height" }
      );
      Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        absolute: true,
        scale: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.25, ease: "power2.in" }),
        onComplete: () => window.ScrollTrigger && ScrollTrigger.refresh(),
      });
    }
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      applyFilter(btn.dataset.filter);
    });
  });

  // ==============================
  // GALERIA — LIGHTBOX (abre só por clique)
  // ==============================
  const lightbox = document.querySelector(".lightbox");

  if (lightbox && typeof lightbox.showModal === "function") {
    const lbImg = lightbox.querySelector(".lightbox__img");
    let current = 0;
    const visible = () => galleryItems.filter((item) => !item.classList.contains("is-hidden"));

    const show = (index) => {
      const list = visible();
      current = (index + list.length) % list.length;
      const item = list[current];
      lbImg.src = item.getAttribute("href");
      lbImg.alt = item.querySelector("img").alt;
    };

    galleryItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        show(visible().indexOf(item));
        lightbox.showModal();
        if (hasGsap && !reduceMotion.matches) {
          gsap.fromTo(lbImg, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out" });
        }
      });
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
    lightbox.querySelector(".lightbox__prev").addEventListener("click", () => show(current - 1));
    lightbox.querySelector(".lightbox__next").addEventListener("click", () => show(current + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });

    // equivalente touch das setas: arrastar pro lado
    let startX = null;
    lightbox.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    lightbox.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });
  }

  // ==============================
  // "AGENDE AGORA" — TESOURA E PENTE EM MOVIMENTO
  // Vídeo mudo de fundo: só toca com a faixa na tela e pausa ao sair.
  // Com movimento reduzido fica só a imagem de capa.
  // ==============================
  const ctaVideo = document.querySelector(".cta-band__video");

  if (ctaVideo) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion.matches) ctaVideo.play().catch(() => {});
      else ctaVideo.pause();
    }, { threshold: 0.15 }).observe(ctaVideo);
  }

  // ==============================
  // ANIMAÇÕES (GSAP)
  // ==============================
  const reveal = () => root.classList.remove("is-loading");

  if (!hasGsap || !window.ScrollTrigger) {
    reveal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  if (window.Flip) gsap.registerPlugin(Flip);

  const mm = gsap.matchMedia();

  // Movimento reduzido: tudo já no lugar, sem parallax
  mm.add("(prefers-reduced-motion: reduce)", () => {
    reveal();
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // ---------- 1. HERO: uma entrada só, orquestrada ----------
    // Título, fotos e selo chegam juntos à posição final.
    const fontsReady = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ]);

    let split;
    fontsReady.then(() => {
      const lines = document.querySelectorAll(".hero__line");
      const chars = window.SplitText
        ? (split = SplitText.create(lines, { type: "chars", mask: "chars" })).chars
        : lines;

      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });

      tl.set(".hero__photo", { clipPath: "inset(100% 0% 0% 0%)" })
        .set(".hero__photo img", { scale: 1.3 })
        .set(".hero__stamp", { scale: 0, rotation: -40 })
        .set(".hero__eyebrow, .hero__services, .hero__actions, .status", { autoAlpha: 0, y: 16 })
        .set(chars, { yPercent: 110 })
        .add(reveal)
        .to(chars, { yPercent: 0, stagger: 0.035 }, 0.1)
        .to(".hero__photo", { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.12 }, 0.1)
        .to(".hero__photo img", { scale: 1, duration: 1.6, stagger: 0.12 }, 0.1)
        .to(".hero__stamp", { scale: 1, rotation: 0, duration: 1 }, 0.55)
        .to(".hero__eyebrow, .hero__services, .hero__actions, .status", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.5)
        .add(() => gsap.set(".hero__photo", { clearProps: "clipPath" }));

      ScrollTrigger.refresh();
    });

    // ---------- 2. HERO: parallax em 5 profundidades ----------
    // Camadas mais "longe" (padrão, texto) ficam pra trás; as mais perto
    // (foto menor, selo) passam na frente — dá volume ao cenário.
    const heroLayers = gsap.utils.toArray(".hero [data-depth]");
    heroLayers.forEach((el) => {
      const depth = parseFloat(el.dataset.depth);
      gsap.to(el, {
        y: (0.5 - depth) * 320,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
      });
    });

    // Mouse (só em ponteiro fino): as mesmas camadas reagem ao cursor
    // na proporção da profundidade. No touch, o scroll acima já faz esse papel.
    let removePointer = () => {};
    if (finePointer.matches) {
      const hero = document.querySelector(".hero");
      const movers = heroLayers.map((el) => ({
        depth: parseFloat(el.dataset.depth),
        // x/yPercent pro mouse; `y` fica reservado pro scroll — o GSAP compõe os dois
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(el, "yPercent", { duration: 0.8, ease: "power3.out" }),
      }));
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.depth * -28);
          m.y(ny * m.depth * -4);
        });
      };
      hero.addEventListener("pointermove", onMove);
      removePointer = () => hero.removeEventListener("pointermove", onMove);
    }

    // ---------- 3. SOBRE: composição em camadas ----------
    gsap.utils.toArray(".about__media [data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.fromTo(
        el,
        { y: (speed - 0.5) * 140 },
        {
          y: (0.5 - speed) * 140,
          ease: "none",
          scrollTrigger: { trigger: ".about__media", start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    });

    // ---------- 4. CTA: fundo mais lento que o texto ----------
    gsap.fromTo(
      ".cta-band__bg",
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".cta-band", start: "top bottom", end: "bottom top", scrub: 0.6 },
      }
    );

    // ---------- 5. Reveals discretos (uma vez só) ----------
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    gsap.set("[data-reveal-item]", { autoAlpha: 0, y: 32 });
    ScrollTrigger.batch("[data-reveal-item]", {
      start: "top 90%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, clearProps: "transform" }),
    });

    // ---------- 6. Números contando (comunica volume, uma vez) ----------
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const counter = { val: 0 };
      el.textContent = `0${suffix}`;
      gsap.to(counter, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => { el.textContent = `${Math.round(counter.val)}${suffix}`; },
      });
    });

    return () => {
      removePointer();
      if (split) split.revert();
    };
  });
})();
