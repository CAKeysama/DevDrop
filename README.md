# 🛠️ DevDrop

Um hub centralizado de ferramentas e utilitários projetado para facilitar a vida de desenvolvedores e usuários comuns. De geradores de senhas seguras a formatadores de JSON, tudo em uma interface limpa, rápida e sem distrações.

**🌐 No ar:** [devdrop-tools.vercel.app](https://devdrop-tools.vercel.app)

## 🚀 Funcionalidades

Tudo roda no navegador: o que você cola não é enviado a nenhum servidor.

*   **Formatadores e validadores:** JSON, XML e SQL (vários dialetos), atualizados enquanto você digita.
*   **Codificação/decodificação:** Base64 (com UTF-8), URL Encode/Decode e decodificador de JWT.
*   **Geradores de dados:** UUID, Lorem Ipsum, hashes (MD5, SHA-256), CPF e CNPJ para testes.
*   **CSS:** gerador de sombras, gradientes e bordas.
*   **Segurança:** gerador de senhas fortes e verificador de força de senha.
*   **Texto:** contador de caracteres e de palavras, conversor de maiúsculas/minúsculas.
*   **Calculadoras:** porcentagem e regra de três.

A lista completa, com o status de cada ferramenta, fica em `src/data/tools.ts`.

## 🧱 Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Motion · lucide-react

## ▶️ Rodando o projeto

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # checagem de tipos + build de produção
npm run lint     # ESLint
npm test         # Vitest (lógica das ferramentas e páginas)
```

## 🧰 Ferramentas e rotas

Todas as ferramentas funcionam no navegador, sem enviar dados a servidores.

| Categoria | Ferramentas (rota `/tools/<id>`) |
|---|---|
| Desenvolvimento | `json-formatter`, `xml-formatter`, `sql-formatter`, `base64`, `url-encoder`, `jwt-decoder` |
| Segurança | `password-generator`, `password-strength` |
| Texto | `character-counter`, `word-counter`, `case-converter`, `text-reverser`, `remove-accents` |
| Calculadoras | `percentage`, `rule-of-three` |
| Geradores de dados | `uuid`, `lorem-ipsum`, `hash-generator`, `cpf`, `cnpj` |
| CSS | `css-shadow`, `css-gradient`, `css-border` |

## 🗂️ Estrutura

```
src/
  data/tools.ts                 Catálogo: categorias, ferramentas, rotas e busca (fonte única)
  lib/<grupo>/                  Lógica pura de cada ferramenta, com testes ao lado
    formatters/ codecs/ security/ text/ calculators/ generators/ css/
  lib/result.ts, lib/random.ts  Formato de resultado e sorteio seguro (Web Crypto)
  components/tools/shared/      ToolShell e peças comuns (entrada, resultado, copiar, limpar…)
  pages/tools/                  Uma página por ferramenta, carregada sob demanda
  App.tsx                       Rotas
```

### Como adicionar uma ferramenta

1. Escreva a lógica em `src/lib/<grupo>/` com testes.
2. Crie a página em `src/pages/tools/` usando `ToolShell` e os componentes de `components/tools/shared`.
3. Registre a rota em `src/App.tsx` (com `lazy`).
4. Adicione a ferramenta em `src/data/tools.ts` com `status: 'available'` e o `path`, e um ícone em `components/tools/ToolIcon.tsx`.

Os testes de `data/tools.test.ts` falham se uma ferramenta não tiver rota.

O sitemap é gerado no build a partir de `src/data/tools.ts`, então uma ferramenta nova já entra nele.

## 🚀 Deploy

O site é hospedado na Vercel ([devdrop-tools.vercel.app](https://devdrop-tools.vercel.app)), ligada a este repositório:

- **Push no `main`** publica em produção; **pull requests** ganham uma URL de preview.
- O build da Vercel roda `npm run lint && npm test && npm run build` (veja `vercel.json`): se algo falhar, o deploy
  falha e a versão anterior continua no ar.
- O GitHub Actions (`.github/workflows/ci.yml`) roda as mesmas verificações em cada push e PR.
- `vercel.json` também define o fallback de rotas da SPA, os cabeçalhos de segurança (CSP) e o cache dos arquivos.
  O CSP libera o script inline do `index.html` pelo hash: se você alterar esse script, atualize o hash
  (o teste `src/deploy.test.ts` avisa).
- `npm run preview` serve o build com os mesmos cabeçalhos de produção.
- O endereço oficial vem da variável `SITE_URL` do projeto na Vercel (sitemap, robots.txt e imagem de prévia);
  `devdrop-ten.vercel.app`, criado automaticamente, redireciona para ele.

## 💡 Sugestões e privacidade

Ideias de ferramentas chegam como issues pelo formulário
[Sugerir uma ferramenta](https://github.com/CAKeysama/DevDrop/issues/new?template=sugestao-de-ferramenta.yml),
com a etiqueta `sugestão de ferramenta`. Pedidos sobre dados usam o formulário de privacidade.
O site não usa cookies. As visitas são contadas pelo Vercel Web Analytics, que é anônimo e sem cookies, só no deploy
de produção e sem o texto digitado na busca (`src/components/layout/SiteAnalytics.tsx`). Detalhes em `/privacidade` e
`/cookies`.

## 📄 Licença

Código-fonte visível, mas **proprietário**: todos os direitos reservados. Veja [LICENSE.md](LICENSE.md).
