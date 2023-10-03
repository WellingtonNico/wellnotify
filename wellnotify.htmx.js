class WellNotifyHTMX {
  eventos = {
    WellNotifySuccess: "htmx:WellNotifySuccess",
    WellNotifyError: "htmx:WellNotifyError",
    WellNotifyInfo: "htmx:WellNotifyInfo",
    WellNotifyWarning: "htmx:WellNotifyWarning",
    WellNotifyNotificar: "htmx:WellNotifyNotificar",
  };

  htmxEventos = {
    beforeRequest: "htmx:beforeRequest",
    afterRequest: "htmx:afterRequest",
    formValid: "htmx:formValid",
    formInvalid: "htmx:formInvalid",
  };

  htmxWellNotifyAtributos = {
    notificacaoId: "hx-wellnotify-notificacao-id",
    beforeRequest: "hx-wellnotify-before-request",
    afterRequestSuccess: "hx-wellnotify-after-request-success",
    afterRequestError: "hx-wellnotify-after-request-error",
    formValid: "hx-wellnotify-form-valid",
    formInvalid: "hx-wellnotify-form-invalid",
  };

  /**
   * @param {WellNotify} wellNotifyInstance instância da Classe WellNotify
   */
  constructor(wellNotifyInstance) {
    // permite as notificações pelos headers do htmx
    document.addEventListener(this.eventos.WellNotifyNotificar, (e) =>
      this.wellNotifyNotificar(e, wellNotifyInstance)
    );

    document.addEventListener(this.eventos.WellNotifySuccess, (event) => {
      this.dispararNotificacoes(
        event.detail.value,
        "success",
        wellNotifyInstance
      );
    });
    document.addEventListener(this.eventos.WellNotifyError, (event) => {
      this.dispararNotificacoes(
        event.detail.value,
        "error",
        wellNotifyInstance
      );
    });
    document.addEventListener(this.eventos.WellNotifyWarning, (event) => {
      this.dispararNotificacoes(
        event.detail.value,
        "warning",
        wellNotifyInstance
      );
    });
    document.addEventListener(this.eventos.WellNotifyInfo, (event) => {
      this.dispararNotificacoes(event.detail.value, "info", wellNotifyInstance);
    });
    // permite as notificações pelos headers do htmx

    document.addEventListener(this.htmxEventos.beforeRequest, (e) =>
      this.beforeRequest(e, wellNotifyInstance)
    );
    document.addEventListener(this.htmxEventos.afterRequest, (e) =>
      this.afterRequest(e, wellNotifyInstance)
    );
    document.addEventListener(this.htmxEventos.formValid, (e) =>
      this.formValid(e, wellNotifyInstance)
    );
    document.addEventListener(this.htmxEventos.formInvalid, (e) =>
      this.formInvalid(e, wellNotifyInstance)
    );
  }

  /**
   * atalho para notificar pelos eventos registrados
   * @param {any|Array} value  - pode ser uma valor único ou uma lista de notificações
   * @param {WellNotifyTipo} tipo
   * @param {WellNotify} wellNotifyInstance
   */
  dispararNotificacoes(value, tipo, wellNotifyInstance) {
    if (Array.isArray(value)) {
      for (const msg of value) {
        wellNotifyInstance.notificar(msg, tipo);
      }
    } else {
      wellNotifyInstance.notificar(value, tipo);
    }
  }

  wellNotifyNotificar(event, wellNotifyInstance) {
    wellNotifyInstance.notificar(
      event.detail.conteudo,
      event.detail.tipo,
      event.detail.opcoes
    );
  }

  beforeRequest(event, wellNotifyInstance) {
    const target = event.detail.elt;
    const msgBeforeRequest = target.getAttribute(
      this.htmxWellNotifyAtributos.beforeRequest
    );
    if (msgBeforeRequest) {
      const notificacao = wellNotifyInstance.loading(msgBeforeRequest);
      target.setAttribute(
        this.htmxWellNotifyAtributos.notificacaoId,
        notificacao.id
      );
    }
  }

  afterRequest(event, wellNotifyInstance) {
    const target = event.detail.elt;
    const msgAfterRequestSuccess = target.getAttribute(
      this.htmxWellNotifyAtributos.afterRequestSuccess
    );
    const msgAfterRequestFail = target.getAttribute(
      this.htmxWellNotifyAtributos.afterRequestError
    );
    const idNotificacao = target.getAttribute(
      this.htmxWellNotifyAtributos.notificacaoId
    );
    if (event.detail.success && msgAfterRequestSuccess) {
      wellNotifyInstance.success(msgAfterRequestSuccess, {
        id: idNotificacao,
        atualizarNotificacao: Boolean(idNotificacao),
      });
    } else if (!event.detail.success && msgAfterRequestFail) {
      wellNotifyInstance.error(msgAfterRequestFail, {
        id: idNotificacao,
        atualizarNotificacao: Boolean(idNotificacao),
      });
    } else if (idNotificacao) {
      wellNotifyInstance.removerNotificacao(idNotificacao);
    }
  }

  formValid(event, wellNotifyInstance) {
    const target = event.detail.elt;
    const msgFormValid = target.getAttribute(
      this.htmxWellNotifyAtributos.formValid
    );
    const idNotificacao = target.getAttribute(
      this.htmxWellNotifyAtributos.notificacaoId
    );
    if (msgFormValid) {
      wellNotifyInstance.success(msgFormValid, {
        id: idNotificacao,
        atualizarNotificacao: idNotificacao !== undefined,
      });
    }
  }

  formInvalid(event, wellNotifyInstance) {
    const target = event.detail.elt;
    const msgFormInvalid = target.getAttribute(
      this.htmxWellNotifyAtributos.formInvalid
    );
    const idNotificacao = target.getAttribute(
      this.htmxWellNotifyAtributos.notificacaoId
    );
    if (msgFormInvalid) {
      wellNotifyInstance.error(msgFormInvalid, {
        id: idNotificacao,
        atualizarNotificacao: Boolean(idNotificacao),
      });
    }
  }
}