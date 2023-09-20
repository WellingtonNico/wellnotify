# WellNotify

lib js baseada na lib [react-toastify](https://fkhadra.github.io/react-toastify/introduction) para notificações no template html



## Como usar?

* faça o download do arquivo wellnotify.js;
* inclua o script no seu html. Ex:
```html
<!-- wellnotify -->
<script src="/static/js/wellnotify.js"></script>
```
* crie uma instância da classe WellNotify ou use a que já vem pré instanciada: wellNotify. Ex:
```js
const myWellNotify = new WellNotify({ posicao: "fundo-direito" })
```
* a partir da instância use o método notificar. Ex: 
```js
// o método "notificar" retorna a referência da própria notificação
const notificacao = wellNotify.notificar('iiihull, o Wellington mandou bem!','success');

notificacao.addEventListener('click',()=>alert('Evento adicional'))
```
* se for necessário limpar as notificações use:
```js
myWellNotify.limpar()
```


## Tipos de notificação:
são auto explicativos
* `success`
* `warning`
* `error`
* `info`
* `default`



## Opções
as opções padrão podem ser definidas ao criar a instância ou no terceiro argumento do método `notificar`:

* `[opcoes.posicao='topo-direito']` - (deve ser definido ao instanciar a classe) valores possíveis e auto explicativos:  `topo-direito` | `topo-esquerdo` | `fundo-direito` | `fundo-esquerdo`;
* `[opcoes.duracao=3000]` - duração da notificação em milisegundos;
* `[opcoes.autoFechar=true]` - se verdadeiro a notificação será fechada automaticamente após o tempo do argumento `duracao`;
* `[opcoes.fecharAoClicar=true]` - se verdadeiro a notificação pode ser fechada ao clicar no corpo sem a necessidade de clicar no botão de fechar;
* `[opcoes.aoClicar=undefined]` - (deve ser definido ao chamar o método `notificar`) caso for informado, um evento on click será adicionaro a notificação e será disparado ao clicar no corpo da mesma.


## Estilos
várias configurações podem ser feitas por variáveis css, já constam algumas configurações para tema escuro:
```css
.wellnotify-ContainerPosicional {
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
}

[data-bs-theme='dark'] .wellnotify-ContainerPosicional,    
[data-theme='dark'] .wellnotify-ContainerPosicional {
    --wellnotify-text-color: white;
    --wellnotify-background-color: black;
    --wellnotify-botao-fechar-color:gray;
    --wellnotify-barra-wrapper-color: gray;
}
```


#### Exemplos de customização de estilo:
* fundo da notificação de sucesso:
```css
.success {
    /* muda a cor de fundo */
    --wellnotify-background-color: green;
    /* muda a cor do texto */
    --wellnotify-text-color: white;
    /* muda a cor das bordas(precisa ser !important) */
    --wellnotify-border-color:red !important;
    /* muda a cor do ícone se houver(precisa ser !important) */
    --wellnotify-icone-color:white !important;
}
.error {
    /* muda a cor de fundo */
    --wellnotify-background-color: green;
    /* muda a cor do texto */
    --wellnotify-text-color: white;
    /* muda a cor das bordas(precisa ser !important) */
    --wellnotify-border-color:red !important;
    /* muda a cor do ícone se houver(precisa ser !important) */
    --wellnotify-icone-color:white !important;
}
```