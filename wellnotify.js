class WellNotify {
  /**
   * @param {Object} props - configurações iniciais
   * @param {'topo-direito'|'topo-esquerdo'|'fundo-direito'|'fundo-esquerdo'} [props.posicao='topo-direito'] - posição da notificação
   * @param {boolean} [props.fecharAoClicar=true] - fechar ao clicar por padrão
   * @param {boolean} [props.autoFechar=true] - se verdadeiro as notificações fecham sozinhas
   * @param {number} [props.duracao=3000] - tempo de duração padrão em milisegundos
   */
  constructor(props) {
    this.props = props;
  }

  /**
   * remove a notificação adicionando o efeito necessário
   * @param {string|HTMLElement} notificacao
   */
  removerNotificacao = (notificacao) => {
    let notificacaoElement = notificacao;
    if (typeof notificacao === "string") {
      notificacaoElement = document.getElementById(notificacao);
    }
    notificacaoElement.style.animation = "none";
    setTimeout(
      () => (notificacaoElement.style.animation = this.obterAnimacao(true)),
      20
    );
    setTimeout(() => notificacaoElement.remove(), 300);
  };

  /**
   * remove todas as notificações do container
   */
  limpar = () => {
    const containerNotificacao = this.obterContainerNotificacoes();
    [...containerNotificacao.children].forEach((node) => {
      if (node.id.startsWith("id_notificacao")) {
        this.removerNotificacao(node.id);
      }
    });
  };

  obterIdContainerNotificacoes = () => {
    const posicao = this.obterPosicao();
    return `id_container_notificacao_${posicao}`;
  };

  /**
   * faz o manejo da atualização da barra de progresso da notificação
   * @param {HTMLDivElement} notificacao
   * @param {number} duracao tempo de duração em milisegundos
   */
  atualizarBarraDeProgresso = (notificacao, duracao) => {
    const barraDeProgresso = notificacao.querySelector(
      ".notificacao-BarraAnimada"
    );
    let inicio = new Date().getTime();
    let hover = false;
    notificacao.addEventListener("mouseenter", () => (hover = true));
    notificacao.addEventListener("mouseleave", () => (hover = false));
    let ultimoInicioHover = null;

    const _atualizar = () => {
      if (!document.contains(barraDeProgresso)) {
        return;
      }
      const agora = new Date().getTime();
      if (!hover && ultimoInicioHover !== null) {
        // acrescenta ao momento inicial o tempo que o período que o hover aconteceu
        const acrescimo = agora - ultimoInicioHover;
        inicio += acrescimo;
        ultimoInicioHover = null;
      }
      const diferenca = agora - inicio;
      if (diferenca >= duracao && !hover) {
        this.removerNotificacao(notificacao.id);
        return;
      } else if (!hover) {
        const porcentagem = (diferenca * 100) / duracao;
        barraDeProgresso.style.width = String(porcentagem) + "%";
      } else if (ultimoInicioHover === null) {
        ultimoInicioHover = agora;
      }
      setTimeout(() => _atualizar(), 20);
    };

    _atualizar();
  };

  /**
   * cria ou retorna o container para as notificações
   * @returns {HTMLDivElement} container para as notificações
   */
  obterContainerNotificacoes = () => {
    const idContainerNotificacao = this.obterIdContainerNotificacoes();

    let containerNotificacao = document.getElementById(idContainerNotificacao);

    if (!document.contains(containerNotificacao)) {
      containerNotificacao = document.createElement("div");
      containerNotificacao.classList.add("notificacao-ContainerPosicional");
      containerNotificacao.id = idContainerNotificacao;
      containerNotificacao.innerHTML += this.obterRegrasCss();
      document.body.appendChild(containerNotificacao);
    }
    return containerNotificacao;
  };

  /** retorna a posição configurada ou padrão */
  obterPosicao = () =>
    this.props?.posicao !== undefined ? this.props.posicao : "topo-direito";

  /** retorna a animação
   * @param {boolean} [reverse=false] - se verdadeiro adiciona animação reversa
   */
  obterAnimacao = (reverse) => {
    const posicao = this.obterPosicao();
    let animacao = posicao.endsWith("direito")
      ? "notificacao-animacao-deslizar-para-esquerda"
      : "notificacao-animacao-deslizar-para-direita";
    animacao += " .3s forwards";
    if (reverse === true) {
      animacao += " reverse";
    }
    return animacao;
  };

  /** retorna novo elemento de notificação */
  gerarNotificacao = (conteudo, tipo, id = undefined) => {
    if (!conteudo) {
      return;
    }
    if (
      tipo &&
      !["success", "info", "error", "warning", "default", "loading"].includes(
        tipo
      )
    ) {
      throw new Error(`O tipo "${tipo}" não é suportado`);
    }
    const idNotificacao =
      id !== undefined ? String(id) : `id_notificacao_${new Date().getTime()}`;
    const novaNotificacao = document.createElement("div");
    novaNotificacao.id = idNotificacao;
    novaNotificacao.classList.add("notificacao_ContainerWrapper");
    novaNotificacao.classList.add(String(tipo ?? "").toLowerCase());

    const htmlBarraDeProgresso = `
        <div class="notificacao_BarraProgressoWrapper">
          <div class="notificacao-BarraAnimada" style="width:0%;"></div>
        </div>
      `;

    const htmlBotaoFechar =
      tipo !== "loading"
        ? `
      <!-- botão fechar -->
      <div class="notificacao_BotaoFecharWrapper">
        <span onclick="new WellNotify().removerNotificacao(${novaNotificacao.id})" 
            class="notificacao_BotaoFechar"
            >${this.icones.close}
        </span>
      </div>    
    `
        : "";

    novaNotificacao.innerHTML = `  
      <div class="notificacao_Container">

        <!-- ícone se houver -->
        <div class="notificacao_IconeWrapper">
          <span class="notificacao_Icone">
            ${this.icones[tipo] ?? ""}            
          </span>
        </div>

        <!-- mensagem -->
        <div class="notificacao_Mensagem">
          ${conteudo}
        </div>

        ${htmlBotaoFechar}
      </div>  

      ${htmlBarraDeProgresso}
    `;
    return novaNotificacao;
  };

  /**
   * @param {any} conteudo - conteúdo da notificação
   * @param {'success'|'error'|'info'|'warning'|'default'} tipo - tipo da notificação
   * @param {Object} opcoes - opções
   * @param {boolean} [opcoes.autoFechar=true] - opcional, se falso as notificação não fecham automaticamente
   * @param {Function} [opcoes.aoClicar=undefined] - opcional, função para ser disparada ao clicar na notificação
   * @param {boolean} [opcoes.fecharAoClicar=true] - opcional, se falso a notificação não fecha ao clicar em cima
   * @param {number} [opcoes.duracao=3000] - opcional, tempo em milisegundos para fechar a notificação
   * @returns {HTMLDivElement} - elemento da notificação criada
   */
  notificar = (conteudo, tipo, opcoes) => {
    const containerNotificacao = this.obterContainerNotificacoes();
    const novaNotificacao = this.gerarNotificacao(conteudo, tipo);
    const fecharAoClicar =
      opcoes?.fecharAoClicar !== undefined
        ? opcoes.fecharAoClicar
        : this.props?.fecharAoClicar !== undefined
        ? this.props.fecharAoClicar
        : true;
    const autoFechar =
      opcoes?.autoFechar !== undefined
        ? opcoes.autoFechar
        : this.props?.autoFechar !== undefined
        ? this.props.autoFechar
        : true;
    if (fecharAoClicar) {
      novaNotificacao.addEventListener("click", () =>
        this.removerNotificacao(novaNotificacao)
      );
    }
    if (opcoes?.aoClicar) {
      novaNotificacao.addEventListener("click", opcoes.aoClicar);
    }
    novaNotificacao.style.animation = this.obterAnimacao();
    containerNotificacao.appendChild(novaNotificacao);
    if (autoFechar) {
      setTimeout(() => {
        this.atualizarBarraDeProgresso(
          novaNotificacao,
          opcoes?.duracao ?? this.props?.duracao ?? 3000
        );
      }, 1);
    }
    return novaNotificacao;
  };

  obterRegrasCss = () => {
    const idContainerNotificacao = this.obterIdContainerNotificacoes();
    const posicao = this.obterPosicao();
    const regraVertical = posicao.startsWith("topo") ? "top: 0;" : "bottom: 0;";
    const regraHorizontal = posicao.endsWith("esquerdo")
      ? "left: 0;"
      : "right: 0;";
    return `
      <style>
    
        .notificacao-ContainerPosicional {
          --wellnotify-container-padding: 15px;
          --wellnotify-max-width:350px;
          --wellnotify-success-color: #09B30E;
          --wellnotify-error-color: #E44334;
          --wellnotify-info-color: #2C8DD6;
          --wellnotify-warning-color: #EFBC10;
          --wellnotify-default-color: #7942AC;
          --wellnotify-barra-wrapper-color: #d4d3d2;
          --wellnotify-text-color: gray;
          --wellnotify-background-color: white;
          --wellnotify-botao-fechar-color:black;
          --wellnotify-border-color:var(--wellnotify-default-color);
          --wellnotify-icone-color:var(--wellnotify-default-color);
        }
    
        
        [data-bs-theme='dark'] .notificacao-ContainerPosicional,    
        [data-theme='dark'] .notificacao-ContainerPosicional {
          --wellnotify-text-color: white;
          --wellnotify-background-color: black;
          --wellnotify-botao-fechar-color:gray;
          --wellnotify-barra-wrapper-color: gray;
        }
    
        @media (max-width:365px) {
          .notificacao-ContainerPosicional {
            --wellnotify-max-width: 100% !important;
            --wellnotify-container-padding:0px;            
          } 
        }
    
        .notificacao-ContainerPosicional {
          overflow-y:auto;
          max-height: 100vh;          
          overflow-x: hidden;
          position:fixed;
          ${regraVertical}
          ${regraHorizontal}          
          display: flex;
          padding: var(--wellnotify-container-padding);          
          flex-direction: column;        
          max-width: var(--wellnotify-max-width);
          width: var(--wellnotify-max-width);
          min-width: var(--wellnotify-max-width)
        }
    
        .notificacao_ContainerWrapper {      
          width: 100%;
          max-width: 100%;
          position:relative;      
          display: flex;
          cursor: pointer;
          flex-direction: column;
          box-shadow: 1px 2px 4px 1px rgba(0, 0, 0, 0.28);
          margin-bottom: 8px;
          background-color: var(--wellnotify-background-color);
          color: var(--wellnotify-text-color);
        }
    
        .notificacao_IconeWrapper{
          min-width: 38px !important;         
          max-width: 38px !important;         
          display: flex;
          padding: 7px;
          justify-content: center;
        }
    
        .notificacao_ContainerWrapper .notificacao_Container{
          border-left:3px solid var(--wellnotify-border-color);
          display: flex;
        }
    
        .notificacao_ContainerWrapper.success {
          --wellnotify-border-color:var(--wellnotify-success-color);
          --wellnotify-icone-color:var(--wellnotify-success-color);          
        }
    
        .notificacao_ContainerWrapper.error {
          --wellnotify-border-color:var(--wellnotify-error-color);
          --wellnotify-icone-color:var(--wellnotify-error-color);
        }
    
        .notificacao_ContainerWrapper.warning {
          --wellnotify-border-color:var(--wellnotify-warning-color);
          --wellnotify-icone-color:var(--wellnotify-warning-color);
        }
    
        .notificacao_ContainerWrapper.info {
          --wellnotify-border-color:var(--wellnotify-info-color);
          --wellnotify-icone-color:var(--wellnotify-info-color);
        }
    
        .notificacao_BotaoFecharWrapper{
          min-width: 20px !important;
          max-width: 20px !important;
          padding-right:2px;
        }
    
        .notificacao_BotaoFecharWrapper .notificacao_BotaoFechar{
          cursor:pointer;  
        }
    
        .notificacao_Mensagem{
          display:flex;
          align-items:center;
          flex-grow: 1;
          padding:10px 0px 10px 0px;
        }

        @keyframes notificacao-animacao-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .notificacao_IconeLoading {

        }
    
        .notificacao_BarraProgressoWrapper{
          height: 3px;
          background-color: var(--wellnotify-border-color);
          max-height:3px;
          display:flex;
          justify-content:end;      
        }
    
        .notificacao-BarraAnimada{
          height: 100%;
          transition: all ease;
          background-color: var(--wellnotify-barra-wrapper-color);
        }
    
        @keyframes notificacao-animacao-deslizar-para-esquerda{      
          from {
            transform: translate3d(110%, 0, 0);
            opacity: 0;
          }
          to {
            transform: translate3d(0, 0, 0);
            opacity:1;
          }
        }
    
        @keyframes notificacao-animacao-deslizar-para-direita{      
          from {
            transform: translate3d(-110%, 0, 0);
            opacity: 0; 
          }
          to {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }
    
      </style>`;
  };

  icones = {
    success:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path></svg>',
    error:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path></svg>',
    info:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"></path></svg>',
    warning:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"></path></svg>',
    close:
      '<svg aria-hidden="true" viewBox="0 0 14 16"><path fill="var(--wellnotify-text-color)" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path></svg>',
  };
}

const wellNotify = new WellNotify({ posicao: "fundo-direito" });
