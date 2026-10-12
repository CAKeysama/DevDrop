# 🛠️ DevDrop

Um hub centralizado de ferramentas e utilitários projetado para facilitar a vida de desenvolvedores e usuários comuns. De geradores de senhas seguras a formatadores de JSON, tudo em uma interface limpa, rápida e sem distrações.

## 🚀 Funcionalidades

O projeto é dividido em categorias para facilitar a navegação:

### 💻 Para Desenvolvedores
*   **Formatadores e Validadores:** JSON, XML, SQL.
*   **Codificação/Decodificação:** Base64, URL Encode/Decode, JWT Decoder.
*   **Geradores de Dados Mock:** UUID, Lorem Ipsum, hashes (MD5, SHA-256).
*   **CSS Tools:** Gerador de sombras, gradientes e bordas.

### 🌐 Para Usuários do Dia a Dia
*   **Segurança:** Gerador de senhas fortes e verificador de força de senha.
*   **Documentos (Dev/Teste):** Gerador e validador de CPF/CNPJ.
*   **Texto:** Contador de caracteres, palavras e conversor de maiúsculas/minúsculas.
*   **Matemática/Finanças:** Calculadora de porcentagem e regras de três.

## 🧱 Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · lucide-react · React Router

## ▶️ Rodando o projeto

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # checagem de tipos + build de produção
npm run lint     # ESLint
npm test         # Vitest
```

## 🗂️ Estrutura

```
src/
  styles/index.css        Design System: tokens (cores, fontes, raios, sombras) e marquee
  components/ui/          Primitivos (ButtonLink, SearchField, LogoMark, estilos compartilhados)
  components/layout/      Header, footer e controle de scroll
  components/landing/     Hero, navbar flutuante, marquee, Bento Grid
  components/tools/       Peças do catálogo (ícones e filtros de categoria)
  data/tools.ts           Registro de categorias e ferramentas (fonte única de verdade)
  pages/                  Landing (/), catálogo (/tools) e 404
```

Para publicar uma ferramenta: crie a rota dela, e em `src/data/tools.ts` troque `status` para
`'available'` e informe o `path`. O catálogo e a landing passam a apontar para ela automaticamente.

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
