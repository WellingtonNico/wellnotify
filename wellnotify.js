/**
 *
 *      WellNotify
 *
 *      GitHub: https://github.com/WellingtonNico/wellnotify
 *      Demo: https://wellingtonnico.github.io/wellnotify/
 *
 *      v 1.1.9
 *
 *      ex:
 *      const myWellNotify = new WellNotify()
 *      myWellNotify.notificar('Exemplo','default')
 *
 */

class WellNotify {
  /**
   * @typedef {Object} WellNotifyOpcoes - opções
   * @property {boolean} autoFechar=true - opcional, se falso as notificação não fecham automaticamente
   * @property {function(HTMLDivElement)} aoClicar=undefined - opcional, função para ser disparada ao clicar na notificação, recebe o próprio objeto da notificação como argumento
   * @property {boolean} fecharAoClicar=true - opcional, se falso a notificação não fecha ao clicar em cima
   * @property {number} duracao=3000 - opcional, tempo em milisegundos para fechar a notificação
   * @property {string} id=undefined - id da notificação, se não informado um é gerado automaticamente
   * @property {boolean} atualizarNotificacao=false - se verdadeiro atualiza uma notificação já existente
   */

  /**
   * @typedef {Object} WellNotifyProps - configurações iniciais
   * @property {'topo-direito'|'topo-esquerdo'|'fundo-direito'|'fundo-esquerdo'} [posicao='topo-direito'] - posição da notificação
   * @property {boolean} [fecharAoClicar=true] - fechar ao clicar por padrão
   * @property {boolean} [autoFechar=true] - se verdadeiro as notificações fecham sozinhas
   * @property {number} [duracao=3000] - tempo de duração padrão em milisegundos
   * @property {string} [id=undefined] - id da notificação, se não informado um é gerado automaticamente
   */

  /**
   * @typedef {'success'|'error'|'info'|'warning'|'loading'|'default'} WellNotifyTipo
   */

  /**
   * @typedef {Object} ConfigAguardar
   * @property {any} conteudo - conteúdo para exibir na notificação
   */

  /**
   * @typedef {Object} ConfigsAguardar
   * @property {(ConfigAguardar & WellNotifyOpcoes) | string } loading - configurações da notificação loading
   * @property {(ConfigAguardar & WellNotifyOpcoes) | function(any):((ConfigAguardar & WellNotifyOpcoes) | string) | string} success - configurações da notificação success, pode ser um dicionário ou uma função receberá o retorno da função aguardada
   * @property {(ConfigAguardar & WellNotifyOpcoes) | function(Error):((ConfigAguardar & WellNotifyOpcoes) | string) | string} error - configurações da notificação error, pode ser um dicionário ou uma função que recebe o erro da função aguardada
   */

  /**
   * @param {WellNotifyProps} props
   */
  constructor(props) {
    this.props = props;
    this.adicionarEstilo();
  }

  const;
  idStyleTag = "id_wellnotify_style";
  urlsDeDownloadCorrentes = [];

  adicionarEstilo = () => {
    const styleTag = document.getElementById(this.idStyleTag);
    if (styleTag) {
      styleTag.remove();
    }
    document.head.innerHTML += this.obterStyleTag();
  };

  /**
   * remove a notificação adicionando o efeito necessário, você não precisa usar este método para remover uma notificação
   * use o método remove do próprio elemento de notificação gerado que ele irá chamar este método
   * @param {string|HTMLElement} notificacao - id da notificação ou o próprio elemento da notificação
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
    setTimeout(
      () => notificacaoElement.parentNode.removeChild(notificacaoElement),
      300
    );
  };

  /**
   * remove todas as notificações do container
   */
  limpar = () => {
    const containerNotificacao = this.obterContainerNotificacoes();
    [...containerNotificacao.children].forEach((node) => node.remove());
  };

  obterIdContainerNotificacoes = () => {
    const posicao = this.obterPosicao();
    return `id_wellnotify_container_posicional_${posicao}`;
  };

  /**
   * faz o manejo da atualização da barra de progresso da notificação
   * @param {HTMLDivElement} notificacao
   * @param {number} duracao tempo de duração em milisegundos
   */
  atualizarBarraDeProgresso = (notificacao, duracao) => {
    const barraDeProgresso = notificacao.querySelector(
      `.${this.cssClasses.barraAnimada}`
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
        notificacao.remove();
        return;
      } else if (!hover) {
        const porcentagem = 100 - (diferenca * 100) / duracao;
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
      containerNotificacao.classList.add(this.cssClasses.containerPosicional);
      containerNotificacao.id = idContainerNotificacao;
      document.body.appendChild(containerNotificacao);
    }
    return containerNotificacao;
  };

  /** retorna a posição configurada ou padrão */
  obterPosicao = () => {
    const posicao =
      this.props?.posicao !== undefined ? this.props.posicao : "topo-direito";
    if (
      ![
        "topo-direito",
        "topo-esquerdo",
        "fundo-direito",
        "fundo-esquerdo",
      ].includes(posicao)
    ) {
      throw new Error(
        `WellNofity: A posição ${posicao} não é suportada no momento`
      );
    }
    return posicao;
  };

  /** retorna a animação
   * @param {boolean} [reverse=false] - se verdadeiro adiciona animação reversa
   */
  obterAnimacao = (reverse) => {
    const posicao = this.obterPosicao();
    let animacao = posicao.endsWith("direito")
      ? this.animacoes.deslizarParaEsquerda
      : this.animacoes.deslizarParaDireita;
    animacao += " .3s forwards";
    if (reverse === true) {
      animacao += " reverse";
    }
    return animacao;
  };

  /**
   * gera o elemento da notificação
   * @param {string} conteudo - conteúdo da notificação, pode ser html em formato string
   * @param {WellNotifyTipo} [tipo='default'] - tipo da notificação
   * @param {WellNotifyOpcoes} opcoes - opções
   * @returns {HTMLDivElement} - elemento da notificaão gerada
   */
  gerarNotificacao = (conteudo, tipo, opcoes) => {
    if (!conteudo) {
      throw new Error(
        "WellNotify: Não é possível gerar uma notificação sem conteúdo"
      );
    }
    if (!tipo) {
      tipo = "default";
    }
    if (
      tipo &&
      !["success", "info", "error", "warning", "default", "loading"].includes(
        tipo
      )
    ) {
      throw new Error(`WellNotify: O tipo "${tipo}" não é suportado`);
    }
    const idNotificacao =
      opcoes?.id !== undefined
        ? String(opcoes.id)
        : `id_wellnotify_${new Date().getTime()}`;
    const novaNotificacao = document.createElement("div");
    novaNotificacao.id = idNotificacao;
    novaNotificacao.classList.add(this.cssClasses.containerWrapper);
    novaNotificacao.classList.add(String(tipo ?? "").toLowerCase());
    const fecharAoClicar =
      opcoes?.fecharAoClicar !== undefined
        ? opcoes.fecharAoClicar
        : this.props?.fecharAoClicar !== undefined
        ? this.props.fecharAoClicar
        : true;

    const funcaoRemover = () => this.removerNotificacao(novaNotificacao);
    novaNotificacao.remove = funcaoRemover;

    if (fecharAoClicar && tipo !== "loading") {
      novaNotificacao.addEventListener("click", funcaoRemover);
    }

    if (opcoes?.aoClicar) {
      novaNotificacao.addEventListener("click", () =>
        opcoes.aoClicar(novaNotificacao)
      );
    }
    novaNotificacao.style.animation = this.obterAnimacao();
    const htmlBarraDeProgresso = `
        <div class="${this.cssClasses.barraProgressoWrapper}">
          <div class="${this.cssClasses.barraAnimada}" style="width:100%;"></div>
        </div>
      `;

    const htmlBotaoFechar =
      tipo !== "loading"
        ? `
      <!-- botão fechar -->
      <div class="${this.cssClasses.botaoFecharWrapper}">
        <span class="${this.cssClasses.botaoFechar}"
            >${this.icones.close}
        </span>
      </div>    
    `
        : "";

    novaNotificacao.innerHTML = `  
      <div class="${this.cssClasses.container}">

        <!-- ícone se houver -->
        <div class="${this.cssClasses.iconeWrapper}">
          <span class="${this.cssClasses.icone}">
            ${this.icones[tipo] ?? ""}            
          </span>
        </div>

        <!-- mensagem -->
        <div class="${this.cssClasses.mensagem}">
          ${conteudo}
        </div>

        ${htmlBotaoFechar}
      </div>  

      ${htmlBarraDeProgresso}
    `;

    const botaoFechar = novaNotificacao.querySelector(
      `.${this.cssClasses.botaoFechar}`
    );
    if (botaoFechar) {
      botaoFechar.addEventListener("click", () =>
        this.removerNotificacao(novaNotificacao)
      );
    }
    return novaNotificacao;
  };

  /**
   * cria a notificação toast
   * @param {string} conteudo - conteúdo da notificação, pode ser html em formato string
   * @param {WellNotifyTipo} [tipo='default'] - tipo da notificação
   * @param {WellNotifyOpcoes?} opcoes - opções
   * @returns {HTMLDivElement} - elemento da notificação criada
   */
  notificar = (conteudo, tipo, opcoes) => {
    const novaNotificacao = this.gerarNotificacao(conteudo, tipo, opcoes);
    if (opcoes?.atualizarNotificacao === true) {
      if (!opcoes?.id) {
        throw new Error(
          "WellNotify: Para atualizar uma notificação existente é necessário informar um id"
        );
      }
      const notificacaoAtual = document.getElementById(opcoes.id);
      if (!notificacaoAtual) {
        throw new Error(
          "WellNotify: Notificação para atualizar não encontrada"
        );
      }
      novaNotificacao.style.animation = "none";
      notificacaoAtual.replaceWith(novaNotificacao);
    } else {
      const containerNotificacao = this.obterContainerNotificacoes();
      containerNotificacao.appendChild(novaNotificacao);
    }

    if (tipo !== "loading") {
      const autoFechar =
        opcoes?.autoFechar !== undefined
          ? opcoes.autoFechar
          : this.props?.autoFechar !== undefined
          ? this.props.autoFechar
          : true;
      if (autoFechar) {
        setTimeout(() => {
          this.atualizarBarraDeProgresso(
            novaNotificacao,
            opcoes?.duracao ?? this.props?.duracao ?? 3000
          );
        }, 1);
      }
    }
    return novaNotificacao;
  };

  /**
   * helper para usar a funcionalidade da notificação loading, lança primeiro o loading e espera a promessa acabar para atualizar a notificação
   * @param {function} funcao - função sync ou async para executar, o loading irá ser substituido por erro ou sucesso a depender da execução da promessa
   * @param {ConfigsAguardar} configuracoes - configurações das notificações de loading, erro e sucesso
   * @returns {HTMLDivElement} - objeto da notificação do resultado seja qual for
   */
  aguardar = async (funcao, configuracoes) => {
    if (typeof funcao !== "function") {
      throw new Error(
        "WellNotify: o primeiro argumento da função aguardar deve ser uma função, podendo ser async."
      );
    }
    let notificacao;
    if (typeof configuracoes.loading === "string") {
      notificacao = this.notificar(configuracoes.loading, "loading");
    } else {
      notificacao = this.notificar(
        configuracoes.loading.conteudo,
        "loading",
        configuracoes.loading
      );
    }
    try {
      try {
        const resultado_da_funcao = await funcao();
        if ("success" in configuracoes) {
          if (typeof configuracoes.success === "string") {
            notificacao = this.notificar(configuracoes.success, "success", {
              id: notificacao.id,
              atualizarNotificacao: true,
            });
          } else {
            const resultado =
              typeof configuracoes.success === "function"
                ? configuracoes.success(resultado_da_funcao)
                : configuracoes.success;
            if (typeof resultado === "string") {
              notificacao = this.notificar(resultado, "success", {
                id: notificacao.id,
                atualizarNotificacao: true,
              });
            } else {
              notificacao = this.notificar(resultado.conteudo, "success", {
                ...resultado,
                id: notificacao.id,
                atualizarNotificacao: true,
              });
            }
          }
        } else {
          this.removerNotificacao(notificacao);
          console.log("WellNotify: configurações de sucesso não informadas");
        }
      } catch (erro) {
        if ("error" in configuracoes) {
          if (typeof configuracoes.error === "string") {
            this.notificar(configuracoes.error, "error", {
              id: notificacao.id,
              atualizarNotificacao: true,
            });
          } else {
            const resultado =
              typeof configuracoes.error === "function"
                ? configuracoes.error(erro)
                : configuracoes.error;
            if (typeof resultado === "string") {
              this.notificar(resultado, "error", {
                id: notificacao.id,
                atualizarNotificacao: true,
              });
            } else {
              this.notificar(resultado.conteudo, "error", {
                ...resultado,
                id: notificacao.id,
                atualizarNotificacao: true,
              });
            }
          }
        } else {
          this.removerNotificacao(notificacao);
          console.log("WellNotify: configurações de error não informadas");
        }
        console.log("WellNotify: Erro na execução da função a aguardar", erro);
      }
    } catch (erro) {
      console.log("WellNotify: erro na função 'aguardar': ", erro);
      this.removerNotificacao(notificacao);
    }
    return notificacao;
  };

  getFilenameFromHeaders(headers) {
    const infos = (headers.get("content-disposition") || "").split(";");
    for (const info of infos) {
      if (info.trim().startsWith("filename")) {
        const filename = info.split("=")[1];
        if (filename) {
          return filename.replace(/['"]/g, "");
        }
      }
    }
    return null;
  }

  /**
   * função facilitadora para download de arquivos
   * @param {string} url - url de download do arquivo
   * @param {string} nomeDoArquivo=undefined - nome do arquivo
   */
  async baixarArquivo(url, nomeDoArquivo) {
    const response = await fetch(url);
    const filename =
      this.getFilenameFromHeaders(response.headers) ?? nomeDoArquivo;
    if (!filename) {
      throw new Error(
        `WellNofify: Não foi possível obter o nome do arquivo para download na url: ${url}`
      );
    }
    const blob = await response.blob();
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.style.display = "none";
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }

  /**
   *  @param {string} url - url de download do arquivo
   *  @param {Object} opcoes
   *  @param {string} opcoes.nomeDoArquivo - nome do arquivo opcional
   *  @param {number} opcoes.duracao - duração em milisegundos para notificações de erro ou sucesso, se não informada será usada a padrão
   *  @param {string} opcoes.msg_loading='Fazendo download, aguarde...' - mensagem enquando o arquivo estiver baixando
   *  @param {string} opcoes.msg_error='Não foi possível concluir o download!' - mensagem se houver erro no download
   *  @param {string} opcoes.msg_success='Download concluído com sucesso!' - mensagem enquando o arquivo estiver baixando
   */
  aguardarDownload(url, opcoes) {
    if (this.urlsDeDownloadCorrentes.includes(url)) {
      return;
    }
    this.urlsDeDownloadCorrentes.push(url);
    this.aguardar(
      async () => {
        try {
          await this.baixarArquivo(url, opcoes?.nomeDoArquivo);
        } catch (e) {
          throw e;
        } finally {
          this.urlsDeDownloadCorrentes = this.urlsDeDownloadCorrentes.filter(
            (u) => u !== url
          );
        }
      },
      {
        loading: {
          conteudo: opcoes?.msg_loading ?? "Fazendo download, aguarde...",
        },
        success: {
          conteudo: opcoes?.msg_success ?? "Download concluído com sucesso!",
          duracao: opcoes?.duracao,
        },
        error: {
          conteudo:
            opcoes?.msg_error ?? "Não foi possível concluir o download!",
          duracao: opcoes?.duracao,
        },
      }
    );
  }

  obterStyleTag = () => {
    const posicao = this.obterPosicao();
    const regraVertical = posicao.startsWith("topo") ? "top: 0;" : "bottom: 0;";
    const regraHorizontal = posicao.endsWith("esquerdo")
      ? "left: 0;"
      : "right: 0;";
    return `
      <style id="${this.idStyleTag}">
        .${this.cssClasses.containerPosicional} {
          --wellnotify-container-padding: 15px;
          --wellnotify-max-width:350px;
          --wellnotify-success-color: #09B30E;
          --wellnotify-error-color: #E44334;
          --wellnotify-info-color: #2C8DD6;
          --wellnotify-warning-color: #EFBC10;
          --wellnotify-loading-color: #7942AC;
          --wellnotify-default-color: gray;
          --wellnotify-barra-wrapper-color: #d4d3d2;
          --wellnotify-text-color: gray;
          --wellnotify-background-color: white;
          --wellnotify-botao-fechar-color:black;
          --wellnotify-border-color:var(--wellnotify-default-color);
          --wellnotify-icone-color:var(--wellnotify-default-color);
          --wellnotify-border-width:3px;
          --wellnotify-border-left-width: var(--wellnotify-border-width);
          --wellnotify-border-bottom-width: var(--wellnotify-border-width);
        }
    
        
        [data-bs-theme='dark'] .${this.cssClasses.containerPosicional},    
        [data-theme='dark'] .${this.cssClasses.containerPosicional} {
          --wellnotify-text-color: white;
          --wellnotify-background-color: black;
          --wellnotify-botao-fechar-color:gray;
          --wellnotify-barra-wrapper-color: gray;
          --wellnotify-default-color: white;
        }
    
        @media (max-width:450px) {
          .${this.cssClasses.containerPosicional} {
            --wellnotify-max-width: 100% !important;
            --wellnotify-container-padding:0px;            
          } 
        }
    
        .${this.cssClasses.containerPosicional} {
          z-index: 10000;
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

        .${this.cssClasses.containerPosicional}:empty {
          padding:0px !important;
        }
    
        .${this.cssClasses.containerWrapper} {      
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
    
        .${this.cssClasses.iconeWrapper}{
          min-width: 38px !important;         
          max-width: 38px !important;         
          display: flex;
          align-items: center;
          padding: 7px;
          justify-content: center;
          border-radius:10px;
        }
    
        .${this.cssClasses.iconeLoading}{
          min-width: 24px !important;         
          max-width: 24px !important;  
          min-height: 24px !important;         
          max-height: 24px !important;  
          border-top: 3px dashed var(--wellnotify-icone-color);
          border-left: 3px dashed var(--wellnotify-icone-color);
          border-right: 3px dashed var(--wellnotify-icone-color);
          border-bottom: 3px solid transparent;
          border-radius:50%;
          animation: ${this.animacoes.loadingSpin} 1s linear infinite ;
        }

        .${this.cssClasses.containerWrapper} .${this.cssClasses.container}{
          border-left:var(--wellnotify-border-left-width) solid var(--wellnotify-border-color);
          display: flex;
        }
    
        .${this.cssClasses.containerWrapper}.loading {
          --wellnotify-border-color:var(--wellnotify-loading-color);
          --wellnotify-icone-color:var(--wellnotify-loading-color);          
        }

        .${this.cssClasses.containerWrapper}.success {
          --wellnotify-border-color:var(--wellnotify-success-color);
          --wellnotify-icone-color:var(--wellnotify-success-color);          
        }
    
        .${this.cssClasses.containerWrapper}.error {
          --wellnotify-border-color:var(--wellnotify-error-color);
          --wellnotify-icone-color:var(--wellnotify-error-color);
        }
    
        .${this.cssClasses.containerWrapper}.warning {
          --wellnotify-border-color:var(--wellnotify-warning-color);
          --wellnotify-icone-color:var(--wellnotify-warning-color);
        }
    
        .${this.cssClasses.containerWrapper}.info {
          --wellnotify-border-color:var(--wellnotify-info-color);
          --wellnotify-icone-color:var(--wellnotify-info-color);
        }
    
        .${this.cssClasses.botaoFecharWrapper}{
          min-width: 20px !important;
          max-width: 20px !important;
          padding-right:2px;
        }
    
        .${this.cssClasses.botaoFecharWrapper} .${this.cssClasses.botaoFechar}{
          cursor:pointer;  
        }
    
        .${this.cssClasses.mensagem}{
          display:flex;
          align-items:center;
          flex-grow: 1;
          padding:10px 0px 10px 0px;
        }
    
        .${this.cssClasses.barraProgressoWrapper}{
          height: var(--wellnotify-border-bottom-width);
          background-color: var(--wellnotify-barra-wrapper-color);
          max-height:var(--wellnotify-border-bottom-width);
          display:flex;
          justify-content:start;      
        }
        
        .${this.cssClasses.barraAnimada}{
          height: 100%;
          transition: all ease;          
          background-color: var(--wellnotify-border-color);
        }

        @keyframes ${this.animacoes.loadingSpin} {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
    
        @keyframes ${this.animacoes.deslizarParaEsquerda}{      
          0% { transform: translate3d(110%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
    
        @keyframes ${this.animacoes.deslizarParaDireita}{      
          0% { transform: translate3d(-110%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      </style>`;
  };

  // início dos atalhos

  /**
   * atalho para notificação de sucesso
   * @param conteudo
   * @param {WellNotifyOpcoes?} opcoes
   * @return {HTMLDivElement} - elemento da notificação criada
   */
  success(conteudo, opcoes) {
    return this.notificar(conteudo, "success", opcoes);
  }

  /**
   * atalho para notificação de alerta
   * @param conteudo
   * @param {WellNotifyOpcoes?} opcoes
   * @return {HTMLDivElement} - elemento da notificação criada
   */
  warning(conteudo, opcoes) {
    return this.notificar(conteudo, "warning", opcoes);
  }

  /**
   * atalho para notificação de erro
   * @param conteudo
   * @param {WellNotifyOpcoes?} opcoes
   * @return {HTMLDivElement} - elemento da notificação criada
   */
  error(conteudo, opcoes) {
    return this.notificar(conteudo, "error", opcoes);
  }

  /**
   * atalho para notificação de informação
   * @param conteudo
   * @param {WellNotifyOpcoes?} opcoes
   * @return {HTMLDivElement} - elemento da notificação criada
   */
  info(conteudo, opcoes) {
    return this.notificar(conteudo, "info", opcoes);
  }

  /**
   * atalho para notificação padrão
   * @param conteudo
   * @param {WellNotifyOpcoes?} opcoes
   * @return {HTMLDivElement} - elemento da notificação criada
   */
  default(conteudo, opcoes) {
    return this.notificar(conteudo, "default", opcoes);
  }

  /**
   * atalho para notificação loading
   * @param conteudo
   * @param {WellNotifyOpcoes?} opcoes
   * @return {HTMLDivElement} - elemento da notificação criada
   */
  loading(conteudo, opcoes) {
    return this.notificar(conteudo, "loading", opcoes);
  }

  // fim dos atalhos

  cssClasses = {
    botaoFecharWrapper: "wellnotify_BotaoFecharWrapper",
    botaoFechar: "wellnotify_BotaoFechar",
    containerPosicional: "wellnotify_ContainerPosicional",
    barraAnimada: "wellnotify_BarraAnimada",
    barraProgressoWrapper: "wellnotify_BarraProgressoWrapper",
    containerWrapper: "wellnotify_ContainerWrapper",
    container: "wellnotify_Container",
    iconeWrapper: "wellnotify_IconeWrapper",
    icone: "wellnotify_Icone",
    mensagem: "wellnotify_Mensagem",
    iconeLoading: "wellnotify_IconeLoading",
  };

  icones = {
    success:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path></svg>',
    error:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path></svg>',
    info: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"></path></svg>',
    warning:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--wellnotify-icone-color)"><path d="M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"></path></svg>',
    loading: '<div class="wellnotify_IconeLoading"><span></span></div>',
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" fill="var(--wellnotify-icone-color)" class="bi bi-bell-fill" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/></svg>`,
    close:
      '<svg aria-hidden="true" viewBox="0 0 14 16"><path fill="var(--wellnotify-text-color)" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path></svg>',
  };

  animacoes = {
    deslizarParaEsquerda: "wellnotify-animacao-deslizar-para-esquerda",
    deslizarParaDireita: "wellnotify-animacao-deslizar-para-direita",
    loadingSpin: "wellnotify-animacao-spin",
  };
}

const wellNotify = new WellNotify({ posicao: "topo-direito" });
