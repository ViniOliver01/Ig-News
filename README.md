# 🚀 Ig News

Este é um projeto de blog com o intuito de apresentar seus posts completos apenas 
a usuarios com uma assinatura ativa, mostrando apenas um preview para os usuarios sem assinatura ativa ou sem login.

o projeto conta com uma integração com a API de pagamentos do **Stripe** e com o serviço de banco de dados não
relacional do **Fauna**, tendo como fonte de posts o **Prismic**, que é um CMS para adiministrar os posts criados e adicionar novos
como uma interface amigavel ao editor.

A aplicação conta com o sistema de autenticação pelo **NextAuth** provendo um sistema simples de login através do serviço oAuth do
próprio **Github**. E tudo isso com o deploy da aplicação feito pelo **Vercel**, serviço o qual escolhi pela facil 
implementação, custo zero e suporte ao **SSR (Server Side Rendering)**

E após a finalização do projeto foi feito os testes com o **Jest** afim de verificar cada componente e página, para ter
certeza que está tudo rodando conforme planejado


## 📒 Aprendizados

- Utilização de testes unitários em **[Jest](https://jestjs.io/)**
- Aplicanto o **NextAuth** com o serviço de oAuth do **GitHub**
- Configuração do Webhook do **Stripe**
- Consumo de API's
- Manejo de variáveis ambiente para produção
- Utilização de novos recursos do Next.JS
- Aplicações de SSG e SSR
## 🔨 Ferramentas
- Next.Js
- Typescript
- Stripe (api de pagamentos)
- Fauna (serviço de banco de dados)
- Prismic (CMS - Sistema de gerenciamento de conteúdo)
- NextAuth (sistema de autenticação via github)
- Git e GitHub
- Vercel (deploy)
## Demonstração

[Clique aqui](https://ig-news-vinioliver01.vercel.app/) para vizualizar a página em execução com deploy no [Vercel](https://vercel.com/)

### Página inicial
![Página Inicial](https://imgur.com/rqyy4vZ.png)
### Página com lista dos posts
![Página com lista dos posts](https://imgur.com/OTcF1W1.png)
### Página de Post sem assinatura ativa
![Página Post sem assinatura ativa](https://imgur.com/fbP014X.png)
### Página de Post com assinatura ativa
![Página Post com assinatura ativa](https://imgur.com/M1eHYlP.png)

