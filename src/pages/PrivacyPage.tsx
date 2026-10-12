import { Link } from 'react-router-dom'
import { LegalPage, type LegalSection } from '../components/layout/LegalPage'
import { links } from '../lib/links'

/*
 * Keep this page true to the code. It states what DevDrop does today: no accounts, no
 * cookies, tools that run in the browser, one localStorage key for the theme (lib/theme.ts),
 * hosting on Vercel, anonymous Vercel Web Analytics with the search text removed
 * (components/layout/SiteAnalytics.tsx), and every asset (fonts, hero video) served by the
 * site itself. A backend, a form, custom analytics events or any new third party means
 * updating this page (and /cookies) in the same change.
 */

const external = { target: '_blank', rel: 'noreferrer' } as const

const sections: LegalSection[] = [
  {
    id: 'quem-somos',
    title: 'Quem é o responsável',
    content: (
      <p>
        O DevDrop é um projeto mantido por <strong>CAKeysama</strong>, que é o responsável (controlador) pelo
        tratamento de dados descrito aqui, nos termos da Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
      </p>
    ),
  },
  {
    id: 'o-que-nao-coletamos',
    title: 'O que não coletamos',
    content: (
      <>
        <p>O DevDrop não tem cadastro, login nem formulários. Por isso, não coletamos:</p>
        <ul>
          <li>nome, e-mail, telefone ou qualquer dado de cadastro;</li>
          <li>
            o conteúdo que você usa nas ferramentas: JSON, XML, SQL, textos, senhas, tokens JWT, CPF, CNPJ, cores ou
            qualquer outro valor;
          </li>
          <li>
            o que você digita na busca de ferramentas: o texto é removido do endereço antes de qualquer estatística;
          </li>
          <li>
            um histórico que identifique você: as estatísticas de visitas são anônimas (veja{' '}
            <a href="#estatisticas">Estatísticas de visitas</a>);
          </li>
          <li>dados para publicidade (não exibimos anúncios nem usamos rastreadores).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'processamento-local',
    title: 'As ferramentas rodam no seu navegador',
    content: (
      <>
        <p>
          Formatar, validar, codificar, gerar e calcular acontece inteiramente no seu dispositivo, com o JavaScript da
          própria página. O que você digita ou cola não é enviado a nenhum servidor, nem ao nosso, e não é armazenado:
          some quando você fecha ou recarrega a página.
        </p>
        <p>
          Os botões <strong>Colar</strong> e <strong>Copiar</strong> usam a área de transferência do seu sistema apenas
          quando você clica neles, e o navegador pode pedir sua permissão antes. Nada é lido da área de transferência sem
          esse clique.
        </p>
      </>
    ),
  },
  {
    id: 'armazenamento-local',
    title: 'O que fica guardado no seu navegador',
    content: (
      <p>
        Uma única informação: o tema que você escolheu (claro ou escuro), salvo no <code>localStorage</code> do seu
        navegador, e só se você usar o botão de tema. Ela nunca é enviada a nós. Os detalhes, e um botão para apagá-la,
        estão na <Link to={links.cookies}>Política de Cookies</Link>.
      </p>
    ),
  },
  {
    id: 'dados-tecnicos',
    title: 'Dados técnicos de acesso',
    content: (
      <>
        <p>
          Como em qualquer site, para entregar as páginas o seu navegador informa dados técnicos ao servidor: endereço IP,
          data e hora, a página pedida e o tipo de navegador e de sistema. O DevDrop é hospedado na{' '}
          <a href="https://vercel.com/legal/privacy-notice" {...external}>
            Vercel
          </a>
          , que pode registrar esses dados em logs de servidor para manter o site no ar e protegê-lo contra abusos. Os
          servidores da Vercel podem ficar fora do Brasil. Não usamos esses registros para identificar você, montar
          perfis ou fazer publicidade.
        </p>
        <p>
          Tudo o que a página carrega (fontes, imagens e o vídeo da página inicial) vem do próprio DevDrop: nenhum outro
          serviço, como Google Fonts ou redes de anúncios, fica sabendo da sua visita.
        </p>
        <p>
          A base legal para esses registros técnicos é o legítimo interesse em operar e proteger o site (art. 7º, IX, da
          LGPD).
        </p>
      </>
    ),
  },
  {
    id: 'estatisticas',
    title: 'Estatísticas de visitas',
    content: (
      <>
        <p>
          Para saber quais páginas e ferramentas são mais usadas, o DevDrop usa o{' '}
          <a href="https://vercel.com/docs/analytics/privacy-policy" {...external}>
            Vercel Web Analytics
          </a>
          . Ele conta visitas de forma anônima e agregada:
        </p>
        <ul>
          <li>
            <strong>não usa cookies</strong> nem guarda nada no seu navegador;
          </li>
          <li>
            para contar visitantes únicos, usa um código (hash) calculado a partir da requisição, que é descartado em 24
            horas, e não guarda seu IP junto com as visitas;
          </li>
          <li>
            registra a página visitada, de qual site você veio, país e cidade aproximados, sistema, navegador e tipo de
            dispositivo;
          </li>
          <li>não segue você em outros sites nem reconstrói o caminho que você fez.</li>
        </ul>
        <p>
          Antes de cada registro, o DevDrop remove do endereço o texto da busca de ferramentas, para que o que você digita
          nunca chegue às estatísticas. A base legal é o legítimo interesse em entender o uso do site e melhorá-lo (art.
          7º, IX, da LGPD).
        </p>
      </>
    ),
  },
  {
    id: 'links-externos',
    title: 'Links para outros sites',
    content: (
      <p>
        Alguns links levam ao GitHub (repositório, documentação, sugestões de ferramentas). Ao segui-los, você passa a
        estar sujeito às políticas de privacidade e de cookies do GitHub, não às do DevDrop.
      </p>
    ),
  },
  {
    id: 'compartilhamento',
    title: 'Compartilhamento',
    content: (
      <p>
        Não vendemos, alugamos nem compartilhamos dados pessoais. O único terceiro envolvido é a Vercel, que hospeda e
        entrega o site e calcula as estatísticas anônimas de visitas, apenas com os dados descritos acima.
      </p>
    ),
  },
  {
    id: 'seus-direitos',
    title: 'Seus direitos',
    content: (
      <>
        <p>Pela LGPD, você pode, a qualquer momento:</p>
        <ul>
          <li>confirmar se tratamos dados seus e ter acesso a eles;</li>
          <li>pedir a correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em excesso;</li>
          <li>pedir a portabilidade dos dados;</li>
          <li>saber com quem seus dados foram compartilhados;</li>
          <li>apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</li>
        </ul>
        <p>
          Como não temos cadastro nem guardamos o que você usa nas ferramentas, na prática quase não há dados seus conosco.
          Ainda assim, para qualquer pedido ou dúvida, fale com a gente{' '}
          <a href={links.privacyContact} {...external}>
            abrindo uma issue no GitHub
          </a>
          . Não inclua dados pessoais na mensagem, porque issues são públicas: diga o que precisa e combinamos um canal
          privado para responder.
        </p>
      </>
    ),
  },
  {
    id: 'alteracoes',
    title: 'Alterações nesta política',
    content: (
      <p>
        Se o DevDrop passar a tratar dados de outra forma (por exemplo, coletando algo além das estatísticas anônimas
        descritas acima), esta página será
        atualizada antes da mudança entrar no ar, com a nova data no topo. Quando a lei exigir, pediremos o seu
        consentimento antes.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      description="Como o DevDrop trata dados: sem cadastro, sem cookies, estatísticas anônimas e ferramentas que rodam no seu navegador."
      updated="12 de outubro de 2026"
      summary={
        <ul>
          <li>Não há cadastro, login nem anúncios.</li>
          <li>
            O que você usa nas ferramentas é processado <strong>no seu navegador</strong> e não é enviado nem guardado por
            nós.
          </li>
          <li>Não usamos cookies. Só guardamos, no seu navegador, o tema que você escolher.</li>
          <li>
            Contamos visitas de forma <strong>anônima e sem cookies</strong> (Vercel Web Analytics), sem o que você digita
            na busca.
          </li>
          <li>A hospedagem (Vercel) recebe dados técnicos de acesso, como o IP, como em qualquer site.</li>
        </ul>
      }
      sections={sections}
    />
  )
}
