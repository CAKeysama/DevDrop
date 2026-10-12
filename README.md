# 🛠️ DevDrop

Um hub centralizado de ferramentas e utilitários projetado para facilitar a vida de desenvolvedores e usuários comuns. De geradores de senhas seguras a formatadores de JSON, tudo em uma interface limpa, rápida e sem distrações.

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

Todas as 21 ferramentas funcionam no navegador, sem enviar dados a servidores.

| Categoria | Ferramentas (rota `/tools/<id>`) |
|---|---|
| Desenvolvimento | `json-formatter`, `xml-formatter`, `sql-formatter`, `base64`, `url-encoder`, `jwt-decoder` |
| Segurança | `password-generator`, `password-strength` |
| Texto | `character-counter`, `word-counter`, `case-converter` |
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
