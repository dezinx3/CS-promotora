/* ==========================================================================
   CS PROMOTORA — v2 · interações
   Tudo o que você precisa trocar (números, e-mail, Instagram) está em CONFIG.
   ========================================================================== */
(() => {
  "use strict";

  /* ------------------------------------------------------------------
   * 1. CONFIGURAÇÃO
   * ------------------------------------------------------------------ */
  const CONFIG = Object.freeze({
    whatsappPrincipal: "558896886218",
    instagram: "CS_promotora",
    email: "cspromotorace@gmail.com",
    mensagemPadrao: "Olá! Vim pelo site da CS Promotora e gostaria de conversar.",
    assuntoEmail: "Contato pelo site — CS Promotora",
    corpoEmail: "Olá, CS Promotora!\n\nGostaria de receber mais informações."
  });

  /* ------------------------------------------------------------------
   * 2. AUXILIARES
   * ------------------------------------------------------------------ */
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));
  const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor));
  const apenasDigitos = (texto) => String(texto ?? "").replace(/\D+/g, "");

  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // iPadOS se identifica como Macintosh: por isso também checamos o toque.
  const ehCelular = (() => {
    const ua = navigator.userAgent || "";
    if (/Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua)) return true;
    return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  })();

  /* ------------------------------------------------------------------
   * 3. LINKS DE CONTATO
   * PC: abre em nova aba (o visitante não sai do site).
   * Celular: abre direto no aplicativo (WhatsApp, Instagram, e-mail).
   * ------------------------------------------------------------------ */
  const urlWhatsapp = (mensagem, numero) =>
    `https://wa.me/${apenasDigitos(numero || CONFIG.whatsappPrincipal)}?text=${encodeURIComponent(mensagem || CONFIG.mensagemPadrao)}`;

  const urlInstagram = () =>
    `https://www.instagram.com/${String(CONFIG.instagram).replace(/[^a-zA-Z0-9._]/g, "")}/`;

  // O endereço não passa por encodeURIComponent: o "@" virando "%40" quebra alguns apps.
  const urlMailto = () =>
    `mailto:${CONFIG.email}?subject=${encodeURIComponent(CONFIG.assuntoEmail)}&body=${encodeURIComponent(CONFIG.corpoEmail)}`;

  // No PC abre a tela de escrita do Gmail. Para usar o programa de e-mail instalado, troque por urlMailto().
  const urlGmail = () => {
    const params = new URLSearchParams({ view: "cm", fs: "1", to: CONFIG.email, su: CONFIG.assuntoEmail, body: CONFIG.corpoEmail });
    return `https://mail.google.com/mail/?${params.toString()}`;
  };

  const definirLink = (link, url) => {
    link.setAttribute("href", url);
    link.setAttribute("rel", "noopener noreferrer");
    if (ehCelular) link.removeAttribute("target");
    else link.setAttribute("target", "_blank");
  };

  const ligarWhatsapp = (link) => definirLink(link, urlWhatsapp(link.dataset.wa, link.dataset.waNumber));

  $$(".js-whatsapp").forEach(ligarWhatsapp);
  $$(".js-instagram").forEach((link) => definirLink(link, urlInstagram()));
  $$(".js-email").forEach((link) => definirLink(link, ehCelular ? urlMailto() : urlGmail()));

  /* ------------------------------------------------------------------
   * 4. CABEÇALHO E MENU
   * ------------------------------------------------------------------ */
  const topo = $(".topbar");
  const menu = $("#menu");
  const hamburguer = $("#burger");

  const marcarRolagem = () => topo?.classList.toggle("is-scrolled", window.scrollY > 12);
  marcarRolagem();
  window.addEventListener("scroll", marcarRolagem, { passive: true });

  const fecharMenu = () => {
    menu?.classList.remove("is-open");
    document.body.classList.remove("menu-aberto");
    hamburguer?.setAttribute("aria-expanded", "false");
    hamburguer?.setAttribute("aria-label", "Abrir menu");
  };

  hamburguer?.addEventListener("click", () => {
    const abrir = hamburguer.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("is-open", abrir);
    document.body.classList.toggle("menu-aberto", abrir);
    hamburguer.setAttribute("aria-expanded", String(abrir));
    hamburguer.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  });

  $$("a", menu).forEach((link) => link.addEventListener("click", fecharMenu));
  document.addEventListener("click", (evento) => {
    if (menu?.classList.contains("is-open") && !topo.contains(evento.target)) fecharMenu();
  });
  window.addEventListener("resize", () => { if (window.innerWidth >= 940) fecharMenu(); });

  /* ------------------------------------------------------------------
   * 5. ESCOLHA DE PERFIL (hero): monta a mensagem do WhatsApp
   * ------------------------------------------------------------------ */
  const botaoPerfil = $("#pickerCta");
  const dicaPerfil = $("#pickerHint");

  $$('input[name="perfil"]').forEach((opcao) => {
    opcao.addEventListener("change", () => {
      if (!botaoPerfil) return;
      const rotulo = opcao.nextElementSibling?.textContent.trim() ?? "";
      botaoPerfil.dataset.wa = `Olá! Sou ${opcao.value} e gostaria de conversar sobre crédito.`;
      ligarWhatsapp(botaoPerfil);
      if (dicaPerfil) dicaPerfil.textContent = `Perfil escolhido: ${rotulo}. A conversa abre já com essa informação.`;
    });
  });

  /* ------------------------------------------------------------------
   * 6. ABAS (modalidades)
   * ------------------------------------------------------------------ */
  $$("[data-tabs]").forEach((bloco) => {
    const abas = $$('[role="tab"]', bloco);
    const paineis = abas.map((aba) => document.getElementById(aba.getAttribute("aria-controls")));

    const selecionar = (indice, focar) => {
      abas.forEach((aba, i) => {
        const ativa = i === indice;
        aba.setAttribute("aria-selected", String(ativa));
        aba.tabIndex = ativa ? 0 : -1;
        if (paineis[i]) paineis[i].hidden = !ativa;
      });
      if (focar) {
        abas[indice].focus();
        abas[indice].scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    };

    abas.forEach((aba, i) => {
      aba.addEventListener("click", () => selecionar(i, false));
      aba.addEventListener("keydown", (evento) => {
        const total = abas.length;
        const destinos = {
          ArrowRight: (i + 1) % total,
          ArrowDown: (i + 1) % total,
          ArrowLeft: (i - 1 + total) % total,
          ArrowUp: (i - 1 + total) % total,
          Home: 0,
          End: total - 1
        };
        if (evento.key in destinos) {
          evento.preventDefault();
          selecionar(destinos[evento.key], true);
        }
      });
    });
  });

  /* ------------------------------------------------------------------
   * 7. CONTADORES
   * ------------------------------------------------------------------ */
  const contadores = $$("[data-count]");

  const animarContador = (elemento) => {
    const alvo = parseFloat(elemento.dataset.count || "0");
    const sufixo = elemento.dataset.suffix || "";
    const duracao = 1300;
    const inicio = performance.now();

    const passo = (agora) => {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - progresso, 3);
      elemento.textContent = Math.round(alvo * suave) + sufixo;
      if (progresso < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };

  if (contadores.length && "IntersectionObserver" in window && !reduzirMovimento) {
    // O HTML já traz o número final; só zeramos quando a animação for mesmo acontecer.
    contadores.forEach((el) => { el.textContent = "0" + (el.dataset.suffix || ""); });
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        animarContador(entrada.target);
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.6 });
    contadores.forEach((el) => observador.observe(el));
  }

  /* ------------------------------------------------------------------
   * 8. CARROSSEL DE DEPOIMENTOS — automático + setas + arrastar
   * ------------------------------------------------------------------ */
  const trilho = $("#depTrilho");
  const anterior = $("#depPrev");
  const proximo = $("#depNext");

  if (trilho && anterior && proximo) {
    const passoDoCarrossel = () => {
      const cartao = $(".depo", trilho);
      return cartao ? cartao.getBoundingClientRect().width + 16 : trilho.clientWidth * .84;
    };

    let timer = null;
    let arrastando = false;
    let inicioX = 0;
    let inicioScroll = 0;
    let pausado = false;
    let ultimoManual = 0;

    const maxScroll = () => Math.max(0, trilho.scrollWidth - trilho.clientWidth);

    const mover = (direcao, comportamento = "smooth") => {
      const max = maxScroll();
      if (max <= 4) return;

      const passo = passoDoCarrossel();
      let alvo = trilho.scrollLeft + direcao * passo;

      if (alvo >= max - 6) alvo = 0;
      if (alvo < 0) alvo = max;

      trilho.scrollTo({
        left: alvo,
        behavior: reduzirMovimento ? "auto" : comportamento
      });
    };

    const atualizarSetas = () => {
      const existeOverflow = maxScroll() > 4;
      anterior.disabled = !existeOverflow;
      proximo.disabled = !existeOverflow;
    };

    const parar = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const iniciar = () => {
      parar();
      if (reduzirMovimento || maxScroll() <= 4) return;

      timer = setInterval(() => {
        if (!arrastando && !pausado && Date.now() - ultimoManual > 2500) {
          mover(1);
        }
      }, 3600);
    };

    anterior.addEventListener("click", () => {
      ultimoManual = Date.now();
      mover(-1);
      iniciar();
    });

    proximo.addEventListener("click", () => {
      ultimoManual = Date.now();
      mover(1);
      iniciar();
    });

    trilho.addEventListener("pointerdown", evento => {
      if (evento.pointerType === "mouse" && evento.button !== 0) return;
      arrastando = true;
      inicioX = evento.clientX;
      inicioScroll = trilho.scrollLeft;
      ultimoManual = Date.now();
      trilho.classList.add("is-dragging");
      trilho.setPointerCapture?.(evento.pointerId);
      parar();
    });

    trilho.addEventListener("pointermove", evento => {
      if (!arrastando) return;
      trilho.scrollLeft = inicioScroll - (evento.clientX - inicioX);
    });

    const finalizar = () => {
      if (!arrastando) return;
      arrastando = false;
      trilho.classList.remove("is-dragging");
      iniciar();
    };

    trilho.addEventListener("pointerup", finalizar);
    trilho.addEventListener("pointercancel", finalizar);
    trilho.addEventListener("mouseenter", () => { pausado = true; parar(); });
    trilho.addEventListener("mouseleave", () => { pausado = false; iniciar(); });
    trilho.addEventListener("focusin", () => { pausado = true; parar(); });
    trilho.addEventListener("focusout", () => { pausado = false; iniciar(); });

    trilho.addEventListener("keydown", evento => {
      if (evento.key === "ArrowRight") {
        evento.preventDefault();
        ultimoManual = Date.now();
        mover(1);
        iniciar();
      }
      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        ultimoManual = Date.now();
        mover(-1);
        iniciar();
      }
    });

    trilho.addEventListener("scroll", atualizarSetas, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) parar();
      else iniciar();
    });
    window.addEventListener("resize", () => {
      atualizarSetas();
      iniciar();
    });

    atualizarSetas();
    // inicia depois da primeira pintura, garantindo scrollWidth correto.
    requestAnimationFrame(() => {
      atualizarSetas();
      iniciar();
    });
  }

  /* ------------------------------------------------------------------
   * 9. LOGOS DOS PARCEIROS (faixa contínua)
   * ------------------------------------------------------------------ */
  const faixa = $(".marquee__trilho");

  if (faixa && !reduzirMovimento) {
    const originais = Array.from(faixa.children);
    const larguraConjunto = faixa.scrollWidth;

    const clonar = (item) => {
      const copia = item.cloneNode(true);
      copia.setAttribute("aria-hidden", "true");
      $$("img", copia).forEach((img) => { img.alt = ""; });
      return copia;
    };

    if (larguraConjunto > 0) {
      // A metade da faixa precisa ser mais larga que a tela; depois ela é duplicada para o loop sem emenda.
      const repeticoes = Math.max(1, Math.ceil(window.innerWidth / larguraConjunto));
      for (let i = 1; i < repeticoes; i++) originais.forEach((item) => faixa.appendChild(clonar(item)));
      Array.from(faixa.children).forEach((item) => faixa.appendChild(clonar(item)));
    }
  }

  /* ------------------------------------------------------------------
   * 10. IMAGENS: esconde o marcador quando a foto real carrega
   * ------------------------------------------------------------------ */
  const observarImagem = (img, moldura) => {
    const carregou = () => moldura.classList.add("is-loaded");
    if (img.complete && img.naturalWidth > 0) carregou();
    else img.addEventListener("load", carregou, { once: true });
  };

  $$(".image-frame").forEach((moldura) => {
    const img = $("img", moldura);
    if (img) observarImagem(img, moldura);
  });
  $$(".logo-slot").forEach((slot) => {
    const img = $("img", slot);
    if (img) observarImagem(img, slot);
  });

  /* ------------------------------------------------------------------
   * 11. SERRA: deslocamento sutil da camada de fundo ao rolar
   * ------------------------------------------------------------------ */
  const serras = $$(".serra");

  if (serras.length && !reduzirMovimento) {
    let agendado = false;
    const atualizarSerras = () => {
      const altura = window.innerHeight;
      serras.forEach((serra) => {
        const caixa = serra.getBoundingClientRect();
        if (caixa.bottom < 0 || caixa.top > altura) return;
        serra.style.setProperty("--par", limitar((caixa.top - altura * 0.5) * 0.035, -22, 22).toFixed(1));
      });
      agendado = false;
    };
    window.addEventListener("scroll", () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizarSerras);
    }, { passive: true });
    atualizarSerras();
  }

  /* ------------------------------------------------------------------
   * 12. ATALHO DE CONTATO FLUTUANTE
   * ------------------------------------------------------------------ */
  const atalho = $("#fab");
  const botaoAtalho = $("#fabBotao");

  if (atalho && botaoAtalho) {
    const definirAtalho = (aberto) => {
      atalho.classList.toggle("is-open", aberto);
      botaoAtalho.setAttribute("aria-expanded", String(aberto));
      botaoAtalho.setAttribute("aria-label", aberto ? "Fechar opções de contato" : "Abrir opções de contato");
    };
    botaoAtalho.addEventListener("click", () => definirAtalho(!atalho.classList.contains("is-open")));
    document.addEventListener("click", (evento) => {
      if (!atalho.contains(evento.target)) definirAtalho(false);
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        definirAtalho(false);
        fecharMenu();
      }
    });
  }

  /* ------------------------------------------------------------------
   * 13. RODAPÉ
   * ------------------------------------------------------------------ */
  const ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();

/* ==========================================================================\n   V3 — splash, indicador de seção, publicações próprias e simulação\n   ========================================================================== */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* splash */
  const splash = $("#splash");
  if (splash) {
    const sair = () => splash.classList.add("is-done");
    window.addEventListener("load", () => setTimeout(sair, reduz ? 450 : 1750), { once:true });
    setTimeout(sair, 3200);
  }

  /* indicador de seção */
  const links = $$(".menu a[data-section]");
  const indicator = $("#menuIndicator");
  const sections = links.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
  const marcarSecao = id => {
    links.forEach(link => link.classList.toggle("is-active", link.dataset.section === id));
    const ativo = links.find(link => link.dataset.section === id);
    if (ativo && indicator && window.innerWidth >= 940) {
      indicator.style.width = `${Math.max(20, ativo.getBoundingClientRect().width * .72)}px`;
      indicator.style.transform = `translateX(${ativo.offsetLeft + ativo.offsetWidth * .14}px)`;
    }
  };
  if (sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) marcarSecao(entry.target.id); });
    }, { rootMargin:"-25% 0px -60% 0px", threshold:0 });
    sections.forEach(section => io.observe(section));
  }
  marcarSecao("sobre");

  /* reveal on scroll */
  const reveals = $$(".reveal");
  if (!reduz && "IntersectionObserver" in window) {
    const ro = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); ro.unobserve(entry.target); }
    }), { threshold:.12 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 3, 2) * 70}ms`; ro.observe(el); });
  } else reveals.forEach(el => el.classList.add("is-visible"));

  /* simulation -> WhatsApp */
  const form = $("#simulacaoForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const v = name => String(data.get(name) || "").trim();
      const mensagem = [
        "Olá! Vim pelo site da CS Promotora e gostaria de fazer uma simulação.",
        "",
        `Nome: ${v("nome")}`,
        `WhatsApp: ${v("telefone")}`,
        `Perfil: ${v("perfil")}`,
        `Cidade: ${v("cidade") || "Não informado"}`,
        `Valor aproximado: ${v("valor") || "Não informado"}`,
        `Motivo/modalidade: ${v("objetivo") || "Não informado"}`,
        `Observações: ${v("observacoes") || "Nenhuma"}`
      ].join("\n");
      const numero = "558896886218";
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
      window.location.href = url;
    });
  }


  /* Acesso administrativo: visitante comum não vê o gerenciador.
     ?admin=1 + senha. Isto é apenas um bloqueio de interface; segurança real exige backend. */
  (() => {
    const adminBox = $("#socialAdmin");
    if (!adminBox) return;
    const params = new URLSearchParams(window.location.search);
    const HASH_ADMIN = "98424827ebdf47664e59f8064bdd76ba29992b8f103f5ac7ec68389cef1c7681";

    const sha256 = async value => {
      const data = new TextEncoder().encode(value);
      const digest = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
    };
    const ativar = () => {
      adminBox.hidden = false;
      document.documentElement.dataset.admin = "true";
    };

    if (sessionStorage.getItem("cs_admin") === "1") {
      ativar();
      return;
    }
    if (params.get("admin") !== "1") return;

    setTimeout(async () => {
      const senha = window.prompt("Acesso administrativo CS Promotora\n\nDigite a senha do administrador:");
      if (!senha) return;
      try {
        if (await sha256(senha) === HASH_ADMIN) {
          sessionStorage.setItem("cs_admin", "1");
          ativar();
        } else {
          window.alert("Senha incorreta.");
          history.replaceState({}, "", window.location.pathname + window.location.hash);
        }
      } catch {
        window.alert("Não foi possível validar o acesso neste navegador.");
      }
    }, 250);
  })();



  /* Thumbnails do Instagram: se o endpoint do Instagram bloquear a capa,
     o card entra em fallback visual limpo. */
  $$("[data-instagram-thumb]").forEach(img => {
    img.addEventListener("error", () => {
      img.closest(".social-card__thumb")?.setAttribute("data-thumb-error", "true");
    }, { once: true });
  });

  /* Instagram: thumbnails leves no grid; embed só quando o visitante abre. */
  (() => {
    const modal = $("#instagramModal");
    const viewer = $("#instagramViewer");
    const original = $("#instagramOpenOriginal");
    if (!modal || !viewer) return;

    const abrirInstagram = trigger => {
      const embed = trigger.dataset.embed;
      const url = trigger.dataset.url;
      if (!embed || !url) return;

      original.href = url;
      viewer.innerHTML = `
        <div class="instagram-modal__loading"><span class="instagram-modal__spinner"></span><span>Carregando conteúdo do Instagram…</span></div>
        <iframe src="${embed}" title="Conteúdo da CS Promotora no Instagram" loading="eager"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
      `;
      modal.hidden = false;
      document.body.classList.add("modal-aberto");

      const frame = $("iframe", viewer);
      frame?.addEventListener("load", () => $(".instagram-modal__loading", viewer)?.remove(), { once: true });
    };

    const fecharInstagram = () => {
      modal.hidden = true;
      document.body.classList.remove("modal-aberto");
      viewer.innerHTML = `<div class="instagram-modal__loading"><span class="instagram-modal__spinner"></span><span>Carregando conteúdo do Instagram…</span></div>`;
    };

    $$("[data-instagram-open]").forEach(btn => btn.addEventListener("click", () => abrirInstagram(btn)));
    $$("[data-instagram-close]").forEach(btn => btn.addEventListener("click", fecharInstagram));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) fecharInstagram(); });
  })();

  /* publicações próprias */
  const STORAGE = "cs-promotora-publicacoes-v1";
  const manual = $("#manualPosts");
  const modal = $("#adminModal");
  const abrir = $("#abrirGerenciador");
  const postForm = $("#postForm");
  const limpar = $("#limparPosts");

  const lerPosts = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; }
  };
  const salvarPosts = posts => localStorage.setItem(STORAGE, JSON.stringify(posts));
  const escapar = value => String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));

  const renderPosts = () => {
    if (!manual) return;
    const posts = lerPosts();
    manual.innerHTML = posts.map(post => {
      const imageStyle = post.imagem ? ` style="background-image:url('${escapar(post.imagem)}')"` : "";
      const has = post.imagem ? " has-image" : "";
      const link = post.link ? `<a href="${escapar(post.link)}" target="_blank" rel="noopener noreferrer">Ver publicação <svg class="ico"><use href="#i-up-right"/></svg></a>` : "";
      return `<article class="social-card social-card--manual reveal is-visible"><div class="social-card__visual${has}"${imageStyle}><span class="social-card__badge">Conteúdo próprio</span><svg class="social-card__big-icon" aria-hidden="true"><use href="#i-chat"/></svg></div><div class="social-card__body"><small>Publicado pela CS</small><h3>${escapar(post.titulo)}</h3><p>${escapar(post.texto || "")}</p>${link}</div></article>`;
    }).join("");
  };

  const fechar = () => { if (modal) modal.hidden = true; document.body.classList.remove("menu-aberto"); };
  abrir?.addEventListener("click", () => { if (modal) modal.hidden = false; });
  $$("[data-admin-close]").forEach(btn => btn.addEventListener("click", fechar));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal && !modal.hidden) fechar(); });

  postForm?.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(postForm);
    const post = {
      id: Date.now(),
      titulo: String(fd.get("titulo") || "").trim(),
      texto: String(fd.get("texto") || "").trim(),
      imagem: String(fd.get("imagem") || "").trim(),
      link: String(fd.get("link") || "").trim()
    };
    if (!post.titulo) return;
    salvarPosts([post, ...lerPosts()]);
    postForm.reset(); renderPosts(); fechar();
  });

  limpar?.addEventListener("click", () => {
    if (!confirm("Apagar todas as publicações próprias deste navegador?")) return;
    localStorage.removeItem(STORAGE); renderPosts();
  });

  renderPosts();
})();


/* ==========================================================================\n   V4 — atmosfera viva: faíscas, ondas e Instagram embeds\n   ========================================================================== */
(() => {
  "use strict";
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Faíscas distribuídas aleatoriamente pela página. Elas são decorativas e não interferem no clique. */
  const campo = document.getElementById("ambientSparks");
  if (campo && !reduzir) {
    const total = window.innerWidth < 700 ? 18 : 34;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const s = document.createElement("span");
      s.className = "ambient__spark";
      s.style.left = `${6 + Math.random() * 88}%`;
      s.style.top = `${8 + Math.random() * 84}%`;
      s.style.setProperty("--spark-duration", `${3.8 + Math.random() * 4.8}s`);
      s.style.setProperty("--spark-delay", `${Math.random() * -7}s`);
      s.style.setProperty("--spark-angle", `${-70 + Math.random() * 140}deg`);
      frag.appendChild(s);
    }
    campo.appendChild(frag);
  }

  /* Faz a seção de Instagram revelar o bloco mesmo quando o iframe demora a responder. */
  document.querySelectorAll(".instagram-frame iframe").forEach((frame) => {
    const card = frame.closest(".social-card");
    const fallback = frame.parentElement?.querySelector(".instagram-fallback");
    const timer = window.setTimeout(() => {
      if (fallback) fallback.classList.add("is-ready");
    }, 6500);
    frame.addEventListener("load", () => {
      window.clearTimeout(timer);
      card?.classList.add("instagram-loaded");
      fallback?.classList.remove("is-ready");
    }, { once: true });
  });
})();
