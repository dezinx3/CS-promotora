# CS Promotora — V6

Correções desta versão:
- contraste reforçado na seção “Sobre”;
- contraste reforçado na seção de perguntas/FAQ;
- Instagram sem os recortes incorretos da V5;
- thumbnails tentam carregar diretamente o conteúdo de mídia do Instagram;
- se o Instagram bloquear a thumbnail, o card entra em fallback visual limpo;
- Reels continuam abrindo o conteúdo real no modal/Instagram;
- carrossel de depoimentos com autoplay, setas, mouse, touch e teclado;
- barra de rolagem horizontal dos depoimentos foi ocultada;
- animações das ondas continuam ativas.

Observação sobre Instagram:
o Instagram pode bloquear endpoints de mídia fora da própria plataforma. Por isso o código não depende dessas capas para abrir o conteúdo: o clique continua usando o embed do post/reel e o link original. Se você quiser controle 100% estável das capas, substitua as URLs das três imagens pelas capas originais salvas em assets/.
