# WellNotify

pensada para quem não usa um framework de frontend e precisa de uma boa funcionalidade de notificações toast.

lib js baseada na lib [react-toastify](https://fkhadra.github.io/react-toastify/introduction) para notificações no template html.

## ATENÇÃO
esta lib não depende de css externo como por exemplo o bootstrap, não precisa adicionar nada para o funcionamento


## Acesse a demo
[acessar demonstração](https://wellingtonnico.github.io/wellnotify/)


## Como usar?

* faça o download do arquivo wellnotify.js ou use cdn para incluir no seu documento html. Ex:

```html
<!-- wellnotify via cdn -->
<script src="https://cdn.jsdelivr.net/gh/WellingtonNico/wellnotify/wellnotify.js"></script>

<!-- wellnotify arquivo local -->
<script src="/static/js/wellnotify.js"></script>
```
* crie uma instância da classe WellNotify ou use a que já vem pré instanciada: `wellNotify`. Ex:
```js
const myWellNotify = new WellNotify({ 
    posicao: "fundo-direito", 
    duracao:3000
})
```
* a partir da instância use o método notificar. Ex: 
```js
// o método "notificar" retorna a referência da própria notificação
const notificacao = wellNotify.notificar('iiihull, o Wellington mandou bem!','success');

notificacao.addEventListener('click',()=>alert('Evento adicional'))
```
* ou use o atalho respectivo para cada tipo de notificação. Ex:
```js
// atalho para notificação do tipo success
wellNotify.success('Ihul, um atalho fácil!')

// atalho para notificação tipo info
wellNotify.info('Ihul, outro atalho fácil!')
```
* se for necessário limpar as notificações use:
```js
// lembre de referir a uma instância criada, ou a padrão ou a que você criar
myWellNotify.limpar()
```


## Tipos de notificação:
tipos de notificações e seus respectivos atalhos, dispensam explicação 
* `success` - `WellNotify.success`
* `warning` - `WellNotify.warning`
* `error` - `WellNotify.error`
* `info` - `WellNotify.info`
* `default` - `WellNotify.default`
* `loading` - `WellNotify.loading`


## Funções extras:
### `WellNofity.aguardar`

para obter um efeito legal ao executar uma função, é possível indicar que ela começou com a notificação tipo `loading` e a depender da execução da função exibir uma notificação de sucesso ou erro se houver um erro na execução da função. Isso pode ser feito automaticamente com o método `WellNotify.aguardar`. Ex:
```js
const carregarConteudoDaApi = async () => {
  // seu código asyncrono ou não aqui
  // caso seja feito um tratamento de erro dentro da função pode se lançar um 
  // erro hardcoded para que a notificação seja substituida por uma de erro
  const response = await axios.get('<sua url>')
  return response.data
  // supondo então que haveria um erro na requisição o mesmo pode ser usado nas configurações
  // neste caso seria um erro do Axios
}

const carregarConteudoDaApiWrapper = () => {
  myWellNotify.aguardar(
    // função a ser executada e aguardada
    carregarConteudoDaApi,
    {
      // obrigatório
      /// jeito 1
      loading:{
        conteudo: 'Execução pendente...',
      },
      /// jeito 2
      loading: 'Execução pendente...',
      // jeito 1:  opcional - configurações em caso de sucesso
      success:{
        conteudo: 'Contúdo carregado com sucesso!',            
        aoClicar(){
          alert('clique feito na notificação de sucesso da pendente')
        }
      },
      // jeito 2:  opcional - pode declarar uma função que irá receber o 
      //     valor retornado pela função aguardada e deve retornar o dicionário de opções
      success:(data)=>(
        {
          conteudo: `Requisição concluída, a api retornou ${data.results.length} resultados`,            
          aoClicar(){
            alert('clique feito na notificação de sucesso da pendente')
          }
        }
      ),
      // jeito 1:  opcional - configurações caso houver erro na execução
      error:{
        conteudo: 'Não foi possível carregar o conteúdo da api!',            
        duracao: 10000, // a notificação de erro irá durar 10 segundos
        aoClicar:()=>alert('clique feito na notificação de erro da pendente')
      },
      // jeito 2:  opcional - pode declarar uma função que irá receber o 
      //     erro retornado pela função aguardada e deve retornar o dicionário de opções
      error(erro){
        let conteudo = 'Não foi possível carregar o conteúdo da api!'
        if(erro.response?.data?.detail){
          msg += ` Detalhes: ${erro.response.data.detail}`
        }
        return {
          conteudo,            
          duracao: 10000, // a notificação de erro irá durar 10 segundos
          aoClicar:()=>alert('clique feito na notificação de erro da pendente')
        }
      }
    }
  )
}
```

### `WellNofity.aguardarDownload`

para você não ter que escrever seu código de download com a função `WellNotify.aguardar`, aqui vai uma função 
prontinha(já possui textos em português)e não se preocupe se o usuário clicar duas vezes, 
a função só vai rodar uma segunda vez após a primeira acabar.

exemplo direto no html:
```html

<span onclick="myWellNotify.aguardarDownload('<substitua pela sua url de download>')" >
  Exportar para excel
</span>

```
exemplo no seu código javascript
```js
myWellNotify.aguardarDownload(
  '<sua url>',
  {
    nomeDoArquivo:'excel.xlsx',
    msg_loading:'Fazendo download da planilha...',
    msg_error:'Não foi possível fazer o download da planilha!',
    msg_success:'Download da planilha concluído com sucesso!'
  }
)
```



## Opções:
as opções padrão podem ser definidas ao criar a instância ou no terceiro argumento do método `WellNotify.notificar`:

* `[posicao:string='topo-direito']` - (deve ser definido ao instanciar a classe) valores possíveis e auto explicativos:  `topo-direito` | `topo-esquerdo` | `fundo-direito` | `fundo-esquerdo`;
* `[duracao:number=3000]` - duração da notificação em milisegundos;
* `[autoFechar:boolean=true]` - se verdadeiro a notificação será fechada automaticamente após o tempo do argumento `duracao`;
* `[fecharAoClicar:boolean=true]` - se verdadeiro a notificação pode ser fechada ao clicar no corpo sem a necessidade de clicar no botão de fechar;
* `[aoClicar:function=undefined]` - (deve ser definido ao chamar o método `WellNotify.notificar`) caso for informado, um evento on click será adicionaro a notificação e será disparado ao clicar no corpo da mesma.
* `[id:string=undefined]` - se informado a notificação criada tera o id atribuido em vez de um id automático;
* `[atualizarNotificacao:boolean=false]` - se informado em conjunto com o atributo `id` será feita a substituição de uma notificação já existente e que esteja visível


## Estilos:
várias configurações podem ser feitas por variáveis css. Já constam algumas configurações para tema escuro:
```css
.wellnotify-ContainerPosicional {
  --wellnotify-container-padding: 15px;
  --wellnotify-max-width:350px;
  --wellnotify-success-color: #09B30E;
  --wellnotify-error-color: #E44334;
  --wellnotify-info-color: #2C8DD6;
  --wellnotify-warning-color: #EFBC10;
  --wellnotify-loading-color: #7942AC;
  --wellnotify-default-color: white;
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

[data-bs-theme='dark'] .wellnotify-ContainerPosicional,    
[data-theme='dark'] .wellnotify-ContainerPosicional {
  --wellnotify-text-color: white;
  --wellnotify-background-color: black;
  --wellnotify-botao-fechar-color:gray;
  --wellnotify-barra-wrapper-color: gray;
  --wellnotify-default-color: white;
}
```

#### Explicações das classes css
```css
.wellnotify_ContainerPosicional{} /* container princpal que irá comportar as notificações */
.wellnotify_ContainerWrapper{} /* wrapper individual */
.wellnotify_Container{} /* container individual */
.wellnotify_IconeWrapper{} /* container que comporta o ícone da notificação */
.wellnotify_Icone{} /* ícone de cada notificação */
.wellnotify_Mensagem{} /* container do conteúdo da mensagem */
.wellnotify_BotaoFecharWrapper{} /* container que comporta o botão fechar */
.wellnotify_BotaoFechar{} /* ícone do botão fechar */
```


#### Exemplos de customização de estilo:
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


## Plus:

### Uso no template django

como eu sou um grande fã do framework web [Django](https://github.com/django/django), segue um exemplo pronto para mensagens do django

```html
{% if messages %}
  <script>
    document.addEventListener('DOMContentLoaded',()=>{
      const myWellNotify = new WellNotify()
      {% for message in messages %}
        myWellNotify.notificar("{{ message|escapejs }}",'{{message.tags}}');               
      {% endfor %}
    })
  </script>
{% endif %}
```
                  
