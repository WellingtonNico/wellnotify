# WellNotify extensão HTMX
para você que usa htmx, já trago uma extensão do WellNotify pronto para trabalhar com htmx: `WellNotifyHTMX`.


## Como usar?
para usar basta inserir também no seu template html após o `wellnotify.js` e criar uma instancia da classe `WellNotifyHTMX`
passando como argumento uma instância da classe `WellNotify`. Ex:
```html
<!-- wellnotify via cdn -->
<script src="https://cdn.jsdelivr.net/gh/WellingtonNico/wellnotify/wellnotify.js"></script>

<!-- wellnotify htmx via cdn -->
<script src="https://cdn.jsdelivr.net/gh/WellingtonNico/wellnotify/wellnotify.htmx.js"></script>

<!-- iniciando extensão -->
<script>
  document.addEventListener('DOMContentLoaded',()=>{
    // sua instância do wellnotify ou a criada por padrão
    new WellNotifyHTMX(myWellNotify)
  })
</script>
```
com isso você pode usar alguns atributos extras nos seus elementos com htmx. Ex:
```html
<form hx-post="<sua url>"
      hx-swap="outerHTML"
      hx-wellnotify-loading-request="Aguarde enquando validamos o formulário..."
      hx-wellnotify-after-request-error="Não foi possível completar a requisição"
      hx-wellnotify-form-invalid="Não foi possível salvar o formulário"
      hx-wellnotify-form-valid="Formulário salvo com sucesso!"
      hx-on="htmx:formValid: id_button_close_modal.click()"
      class="modal-dialog modal-dialog-centered modal-md"
      id="id_form_termo_de_aceite"
>
  <input name="titulo" class="form-control"/>
</form>
```

## Explicando atributos HTMX extras:
* `hx-wellnotify-loading-request`: disparada antes da requisição começar, esta notificação será substituida pela próxima disparada;
* `hx-wellnotify-after-request-error`: disparada se o código de retorno for maior ou igual a 400;
* `hx-wellnotify-after-request-success`: disparada se houver sucesso na requisição, não recomendado uso com `hx-wellnotify-form-valid`;
* `hx-wellnotify-form-valid`: diparada ao receber o evento `htmx:formValid`, vindo pelo header `HX-Trigger` na response;
* `hx-wellnotify-form-invalid`: diparada ao receber o evento `htmx:formInvalid`, vindo pelo header `HX-Trigger` na response;

#### exmplo de envio de headers para `htmx:formValid` e `htmx:formInvalid`:
```python 

class MyFormView(UpdateView):
    ...
    def form_valid(self,form):
        response = super().form_valid(form)
        response['HX-Trigger'] = json.dumps({'htmx:formValid':True})
        return response    
        
    def form_invalid(self,form):
        response = super().form_invalid(form)
        response['HX-Trigger'] = json.dumps({'htmx:formInvalid':True})
        return response
```


## Plus
a classe `WellNotifyHTMX` também registra eventos para notificações vindas pelos headers da response,
todos autoexplicativos:
* `htmx:WellNotifySuccess`
* `htmx:WellNotifyError`
* `htmx:WellNotifyInfo`
* `htmx:WellNotifyWarning`
* `htmx:WellNotifyDefault`

#### Como usar?

basta adicionar o evento no header `HX-Trigger`, o valor pode ser uma string ou uma lista de strings.

```python 

class MyFormView(UpdateView):
    ...
    def form_valid(self,form):
        response = super().form_valid(form)
        response['HX-Trigger'] = json.dumps({
            'htmx:WellNotifySuccess':[
                'notificação de sucesso 1',
                'notificação de sucesso 2',
            ],
            'htmx:formValid':True
        })
        return response    
        
    def form_invalid(self,form):
        response = super().form_invalid(form)
        response['HX-Trigger'] = json.dumps({
            'htmx:WellNotifyError': 'Exemplo de notificação de erro!'
        })
        return response
```
     
#### muita coisa pra ajustar?
então segue um mixin pronto para suas views do django, adapte para sua linguagem ou framework
```python
import json

class WellNotifyHTMXMixin:
    valid_message = None
    invalid_message = None
    success_triggers = {}
    invalid_triggers = {}
    WN_SUCCESS = "htmx:WellNotifySuccess"
    WN_ERROR = "htmx:WellNotifyError"
    WN_WARNING = "htmx:WellNotifyWarning"
    WN_INFO = "htmx:WellNotifyInfo"
    hxTrigger = "HX-trigger"
    FORM_VALID_EVENT = "htmx:formValid"
    FORM_INVALID_EVENT = "htmx:formInvalid"

    def get_success_url(self):
        return self.request.get_full_path()

    def form_valid(self, form):
        super().form_valid(form)
        response = self.render_to_response(self.get_context_data())
        trigger = {self.FORM_VALID_EVENT: True, **self.success_triggers}
        if self.valid_message:
            trigger[self.WN_SUCCESS] = self.valid_message
        response[self.hxTrigger] = json.dumps(trigger)
        return response

    def form_invalid(self, form):
        response = super().form_invalid(form)
        trigger = {self.FORM_INVALID_EVENT: True, **self.invalid_triggers}
        if self.invalid_message:
            trigger[self.WN_ERROR] = self.invalid_message
        response[self.hxTrigger] = json.dumps(trigger)
        return response

```