# CS Promotora — Landing page institucional

## Índice
1. [Visão geral](#1-visão-geral)
2. [Arquivos do projeto](#2-arquivos-do-projeto)
3. [Como abrir](#3-como-abrir)
4. [Identidade visual e responsividade](#4-identidade-visual-e-responsividade)
5. [Mapa das seções do site](#5-mapa-das-seções-do-site)
6. [Onde inserir as fotos JPEG](#6-onde-inserir-as-fotos-jpeg)
7. [Como trocar textos, contatos e links](#7-como-trocar-textos-contatos-e-links)
8. [Animações e interações](#8-animações-e-interações)
9. [Observações importantes](#9-observações-importantes)

## 1. Visão geral
Landing page institucional da CS Promotora, inspirada no fluxo de apresentação corporativa da referência VIP Financeira, mas com estrutura, textos e identidade visual próprios. O projeto foi pensado primeiro para celulares e tablets e se adapta a desktops e telas horizontais.

## 2. Arquivos do projeto
- `index.html` — estrutura, conteúdo, navegação, links e seções.
- `style.css` — identidade visual, layout responsivo, efeitos, animações e estados.
- `script.js` — menu mobile, entrada de elementos, partículas, ano automático e utilitário de validação JPEG.
- `README.md` — este guia.

**Pasta de imagens:** crie uma pasta `assets` ao lado dos três arquivos de código. As fotos são inseridas manualmente nessa pasta.

## 3. Como abrir
1. Baixe os quatro arquivos e mantenha-os na mesma pasta.
2. Crie a pasta `assets`.
3. Adicione as fotos JPEG com os nomes indicados na seção 6.
4. Abra `index.html` no navegador. Para desenvolvimento, também pode usar a extensão Live Server do VS Code.

Não há dependências de build nem instalação de pacotes. A fonte Manrope/DM Sans é carregada do Google Fonts; sem internet, o site usa fontes alternativas.

## 4. Identidade visual e responsividade
- **Cores:** preto azulado, cinza, azul ciano e branco.
- **Estética:** institucional, moderna, com brilho ciano contido, ondas, elementos flutuantes e partículas.
- **Mobile-first:** estilos-base priorizam celular; breakpoints em 600px e 900px reorganizam grids e navegação.
- Há um ajuste específico para telas horizontais baixas.
- O site respeita `prefers-reduced-motion` para reduzir animações conforme a preferência do dispositivo.

As cores principais ficam no início de `style.css`, dentro de `:root` (`--cyan`, `--ink`, `--gray`, `--white`).

## 5. Mapa das seções do site
Referência de localização no `index.html`:

| Ordem | Seção / ID | Onde localizar | Conteúdo |
|---|---|---|---|
| 1 | Cabeçalho | `<header class="site-header">` | Marca tipográfica, menu mobile e navegação |
| 2 | Abertura / Hero | `<section class="hero">` | Chamada principal, CTA, foto de destaque e cards flutuantes |
| 3 | Faixa de confiança | `<section class="trust-strip">` | Três atributos institucionais |
| 4 | Sobre a CS | `id="sobre"` | Apresentação da empresa, foto da loja e posicionamento |
| 5 | Soluções | `id="solucoes"` | Consignado INSS, servidor público, CLT e outras soluções |
| 6 | Diferenciais / Manifesto | `id="diferenciais"` | Transparência, proximidade, responsabilidade e experiência |
| 7 | Como funciona | `id="como-funciona"` | Jornada em três passos |
| 8 | Equipe | `<section class="team-section">` | Foto e texto sobre o atendimento |
| 9 | Contato | `id="contato"` | WhatsApp, telefones, endereço, Instagram e e-mail |
| 10 | Rodapé | `<footer class="site-footer">` | CNPJ, aviso institucional e retorno ao topo |
| 11 | WhatsApp flutuante | `.whatsapp-float` | Atalho fixo para conversa |

## 6. Onde inserir as fotos JPEG
Crie `assets/` na mesma pasta do `index.html`. Salve as imagens **somente em `.jpg` ou `.jpeg`** com estes nomes exatos:

| Arquivo | Local no site | Sugestão de conteúdo |
|---|---|---|
| `assets/foto-hero.jpg` | Hero / abertura | Foto de atendimento ou imagem institucional horizontal/vertical |
| `assets/foto-fachada.jpg` | Sobre a CS | Foto real da fachada/loja |
| `assets/foto-equipe.jpg` | Seção Equipe | Foto da equipe CS Promotora |

Os espaços reservados aparecem automaticamente enquanto a imagem estiver ausente. Para trocar o caminho, procure no `index.html` por `FOTO 01`, `FOTO 02` ou `FOTO 03` e atualize o `src` e o comentário correspondente.

### Regra JPEG
O projeto foi preparado para usar JPEG: os caminhos de imagem previstos terminam em `.jpg` e o utilitário `CSPhotos.validate(file)` no `script.js` rejeita arquivos cujo MIME ou extensão não sejam JPEG. Como esta versão é um site estático, ela **não possui upload público**; portanto, a restrição efetiva do conteúdo publicado depende de inserir manualmente somente `.jpg/.jpeg` na pasta `assets`. Um atributo HTML `accept` sozinho não seria uma validação segura. Se futuramente for criado um painel de upload, valide o arquivo também no servidor.

## 7. Como trocar textos, contatos e links
Edite o `index.html` e pesquise pelo texto atual. Os contatos estão na seção `id="contato"` e no botão flutuante:
- WhatsApp 1: `https://wa.me/558896886218`
- WhatsApp 2: `https://wa.me/558881641919`
- Instagram: `https://www.instagram.com/CS_promotora/`
- E-mail: `cspromotorace@gmail.com`
- Endereço: Travessa Tiradentes, nº 181, Centro, próximo ao Bradesco, CEP 63900-129, Quixadá–CE
- CNPJ: 20.619.878/0001-17

Atualize tanto o link quanto o texto visível se alterar algum telefone. Os botões de solução levam à seção de contato; não representam uma simulação ou aprovação de crédito.

## 8. Animações e interações
- Menu mobile expansível, com fechamento por link, tecla Escape ou aumento da tela.
- Cabeçalho com fundo reforçado ao rolar a página.
- Revelação progressiva das seções via `IntersectionObserver`.
- Partículas ciano geradas pelo JavaScript, com duração e deriva aleatórias.
- Cards flutuantes, órbitas e ondas animadas em CSS.
- Atalho fixo de WhatsApp.
- Ano do rodapé atualizado automaticamente.
- Suporte à preferência de movimento reduzido do sistema.

## 9. Observações importantes
- O conteúdo institucional e os produtos são uma base inicial; revise termos, convênios e modalidades antes de publicar.
- Não foram inventados depoimentos, taxas, garantias de aprovação ou promessas de liberação.
- A concessão de crédito, taxas, prazos e aprovação dependem da instituição financeira responsável e da análise aplicável.
- Antes de publicar, confira todos os telefones, links, endereço, CNPJ e avisos legais.
- Para publicação real, hospede os arquivos em um serviço HTTPS e configure domínio, metadados finais, política de privacidade e eventuais ferramentas de métricas conforme a necessidade.
