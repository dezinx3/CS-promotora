/* CS PROMOTORA — interações, movimento e validação de imagens JPEG */

(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const year = document.querySelector("#current-year");

  // Atualiza automaticamente o ano do rodapé
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Header ganha contraste após o primeiro deslocamento da página
  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // Menu mobile acessível
  // Fecha ao navegar, pressionar Escape ou aumentar a tela

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Abrir menu");

    nav?.classList.remove("is-open");

    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Abrir menu" : "Fechar menu"
    );

    nav?.classList.toggle("is-open", !isOpen);

    document.body.classList.toggle("menu-open", !isOpen);
  });

  // Fecha o menu ao clicar em um link
  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha com Escape
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Fecha o menu ao mudar para o layout desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) {
      closeMenu();
    }
  });

  // Animações de entrada das seções
  // Os elementos aparecem suavemente conforme entram na tela

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            // Para de observar após a animação
            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item, index) => {

      // Pequeno atraso escalonado entre elementos
      item.style.transitionDelay =
        `${Math.min(index % 4, 3) * 75}ms`;

      observer.observe(item);

    });

  } else {

    // Fallback para navegadores sem IntersectionObserver
    revealItems.forEach(item => {
      item.classList.add("is-visible");
    });

  }

  // Partículas decorativas ciano
  // Movimento suave para criar profundidade visual

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const sparkField = document.querySelector(".spark-field");

  if (sparkField && !prefersReduced) {

    for (let i = 0; i < 24; i++) {

      const spark = document.createElement("i");

      spark.className = "spark";

      // Posição horizontal aleatória
      spark.style.left = `${Math.random() * 100}%`;

      // Partículas surgem na região inferior da tela
      spark.style.top =
        `${55 + Math.random() * 50}%`;

      // Duração aleatória da animação
      spark.style.setProperty(
        "--dur",
        `${7 + Math.random() * 10}s`
      );

      // Atraso aleatório para evitar movimentos sincronizados
      spark.style.setProperty(
        "--delay",
        `${-Math.random() * 15}s`
      );

      // Deslocamento horizontal aleatório
      spark.style.setProperty(
        "--drift",
        `${Math.round(Math.random() * 90 - 45)}px`
      );

      sparkField.appendChild(spark);

    }

  }

  // Fallback visual para fotos ainda não inseridas
  //
  // Fotos previstas:
  // assets/foto-hero.jpg
  // assets/foto-fachada.jpg
  // assets/foto-equipe.jpg

  document.querySelectorAll(".image-frame img").forEach(img => {

    const frame = img.closest(".image-frame");

    const fallback = frame?.querySelector(".image-fallback");

    const showFallback = () => {
      if (fallback) {
        fallback.style.display = "flex";
      }
    };

    const hideFallback = () => {
      if (fallback) {
        fallback.style.display = "none";
      }
    };

    // Verifica se a imagem já foi carregada
    if (img.complete && img.naturalWidth > 0) {
      hideFallback();
    } else {
      showFallback();
    }

    // Quando a imagem carregar
    img.addEventListener("load", hideFallback);

    // Quando a imagem não existir ou falhar
    img.addEventListener("error", showFallback);

  });

  // Validação de arquivos JPEG
  //
  // Exemplo de uso no console:
  // CSPhotos.validate(file)
  //
  // Aceita somente arquivos JPG ou JPEG

  window.CSPhotos = {

    validate(file) {

      if (!file) {

        return {
          valid: false,
          message: "Nenhum arquivo selecionado."
        };

      }

      const ext = file.name
        .split(".")
        .pop()
        .toLowerCase();

      const valid =
        file.type === "image/jpeg" &&
        ["jpg", "jpeg"].includes(ext);

      return {

        valid,

        message: valid
          ? "JPEG válido."
          : "Formato não permitido. Selecione somente JPG ou JPEG."

      };

    },

    // Valida e aplica uma imagem JPEG a um elemento img
    //
    // Exemplo:
    // CSPhotos.preview(file, "#foto-principal")

    preview(file, imgSelector) {

      const result = this.validate(file);

      if (!result.valid) {

        alert(result.message);

        return false;

      }

      const img = document.querySelector(imgSelector);

      if (!img) {
        return false;
      }

      // Cria uma URL temporária para a imagem selecionada
      img.src = URL.createObjectURL(file);

      return true;

    }

  };

})();