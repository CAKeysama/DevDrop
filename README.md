# 🛠️ DevDrop

Um hub centralizado de ferramentas e utilitários projetado para facilitar a vida de desenvolvedores e usuários comuns. De geradores de senhas seguras a formatadores de JSON, tudo em uma interface limpa, rápida e sem distrações.

## 🚀 Funcionalidades

Tudo roda no navegador: o que você cola não é enviado a nenhum servidor.

### ✅ Disponível
*   **Formatadores e validadores:** JSON, XML e SQL (vários dialetos), atualizados enquanto você digita.
*   **Codificação/decodificação:** Base64 (com UTF-8), URL Encode/Decode e decodificador de JWT.

### 🕒 Em breve
*   **Geradores de dados:** UUID, Lorem Ipsum, hashes (MD5, SHA-256), CPF e CNPJ para testes.
*   **CSS:** gerador de sombras, gradientes e bordas.
*   **Segurança:** gerador de senhas fortes e verificador de força de senha.
*   **Texto:** contador de caracteres e de palavras, conversor de maiúsculas/minúsculas.
*   **Calculadoras:** porcentagem e regra de três.

A lista completa, com o status de cada ferramenta, fica em `src/data/tools.ts`.

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
