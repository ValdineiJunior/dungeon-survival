import type { StoryPart } from "@/app/types/story";

/**
 * Prólogo: A Recepção.
 * Os heróis são invocados e o recepcionista explica o mundo e as regras.
 * Dividido em seções para permitir imagens entre os diálogos.
 */
export const prologo: StoryPart = {
  id: "prologo",
  title: "A Recepção",
  sections: [
    {
      id: "invocacao",
      image: {
        src: "/images/story/prologo-invocacao.jpg",
        alt: "Heróis invocados na marcação no chão, recepcionista os recebe",
      },
      content: [
        {
          type: "narrative",
          text: "Os heróis são invocados em uma marcação no chão. O recepcionista os recebe.",
        },
        { type: "dialogue", speaker: "Recepcionista", text: "Parabéns, vocês foram os escolhidos a participar desse nosso mundo. Sejam bem-vindos." },
        { type: "dialogue", speaker: "Um dos heróis", text: "Mas que mundo é esse? E por que nós?" },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Bom, esse é um mundo mágico. Digamos que ele se originou de um sonho, e vocês têm a determinação necessária para participar dele. Nós fizemos muitas buscas e demoramos muito tempo para encontrá-los. Vocês são aventureiros em busca de novos desafios e muitas ambições — não estou certo?",
        },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Nisso você acertou em cheio. Mas como viemos parar aqui? E o meu próprio mundo… isso é muito confuso e frustrante ao mesmo tempo.",
        },
      ],
    },
    {
      id: "mundodossonhos",
      image: {
        src: "/images/story/prologo-mundo-sonhos.jpg",
        alt: "O mundo dos sonhos e a explicação sobre as cópias",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Bom, deixe-me tentar explicar. Vocês não foram movidos nem teleportados para esse mundo. Como esse é o mundo dos sonhos, vamos dizer que vocês são somente uma cópia do seu eu original.",
        },
        { type: "dialogue", speaker: "Herói", text: "Mas o quê? Você nos clonou?" },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Eu não diria que vocês são um clone ou algo assim. Como esse é o mundo dos sonhos, onde tudo é possível, vamos dizer que, depois de estudar, coletamos todo o seu conhecimento e suas experiências e os recriamos aqui. Não temos como levar vocês ao mundo anterior. Vocês existem somente nesse mundo.",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "Caramba, isso é muito confuso. Mas se nos trouxeram aqui, qual o propósito com isso?",
        },
      ],
    },
    {
      id: "entretenimento-masmorra",
      image: {
        src: "/images/story/prologo-masmorra.jpg",
        alt: "A masmorra e os observadores",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Simples: vocês estão aqui para o entretenimento de seres de fora. Vamos dizer que temos pessoas acima de nós que podem nos observar. Os heróis olham para cima, ainda bem confusos.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "E para entreter tanto eles quanto vocês, vocês receberão a ajuda deles. Eles os guiarão através do que chamamos de masmorra. Vocês devem emprestar a sua força e habilidades para se aventurar e desafiar essa masmorra. O objetivo é simples: chegar ao topo dela e derrotar o boss final. Simples, não é?",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "E por que deveríamos fazer isso? Arriscar nossas próprias vidas para o entretenimento? Vocês são loucos.",
        },
      ],
    },
    {
      id: "tiro-reviver",
      image: {
        src: "/images/story/prologo-demonstracao.jpg",
        alt: "O recepcionista demonstra: o herói leva um tiro e revive no portal",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Calme, meu jovem. Além de portar todas as suas habilidades e experiências, esse mundo adiciona algumas peculiaridades em todos aqui. Vejam bem. — O recepcionista saca uma pistola antiga e atira no peito de um dos heróis.",
        },
        {
          type: "narrative",
          text: "Ele, sem tempo de reação, arregala os olhos e grita ao receber o tiro no peito, caindo para trás. Deitado no chão, coloca a mão no peito cheio de sangue e pergunta: — O que está acontecendo?",
        },
        { type: "narrative", text: "Os outros dois heróis olham assustados." },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Eu não estou sentindo tanta dor. Dói, mas isso deveria me matar ou ao menos doer pra caralho.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Bem, nesse mundo vocês não sentem dor — ao menos não dores extremas. Reduzimos bastante os danos recebidos por vocês. Vocês ainda sentem dor, mas bem menos que antes; deixamos um pouquinho para a diversão. E outra coisa: aqui vocês não morrem. — E o recepcionista, que se aproximou lentamente, enche o corpo do herói de balas, gastando o restante do revolver antigo.",
        },
        {
          type: "narrative",
          text: "Nesse momento o herói, de olhos arregalados, vai se desmaterializando em pequenas luzes e reaparece em um local que parece ser um portal marcado no chão. — Eu estou vivo! O que aconteceu?",
        },
        { type: "dialogue", speaker: "Recepcionista", text: "Bom, você reviveu." },
        { type: "dialogue", speaker: "Herói", text: "Você é maluco. Tudo isso é loucura." },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Leve o seu tempo para assimilar tudo isso. Enquanto isso, vou ficar na recepção. Quando estiverem prontos, venham falar comigo.",
        },
      ],
    },
    {
      id: "cidade-e-facilitador",
      image: {
        src: "/images/story/prologo-cidade.jpg",
        alt: "A cidade e a oferta de vida normal ou aventura",
      },
      content: [
        {
          type: "narrative",
          text: "— Depois de um tempo, os três heróis conversando entre si se encontram com o recepcionista.",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "Seu maluco, ainda temos muitas dúvidas sobre tudo isso. Mas gostaríamos de te perguntar uma coisa: e se nos recusarmos a essa coisa de masmorra?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Se não quiserem, vocês podem ter uma vida normal nesse lugar. Aqui temos uma cidade com um pouco de tudo que tem nos seus mundos originais: campos, colheitas. Na cidade temos tavernas ou bares, se preferirem. Temos uma pessoa responsável que foi trazida a esse mundo e cuida dessa parte — se quiserem algo especial, falem com ela. Mas saibam que isso não vai ser de graça: para manter as coisas interessantes, nesse mundo temos uma economia própria. E é claro, vocês, como primeiros aventureiros, vão nos ajudar a melhorá-la. Por enquanto temos uma loja de armas, um alquimista e várias outras coisas. Então fiquem à vontade para fazer o que quiserem aqui.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Mas claro, quando selecionamos vocês três já levamos tudo em consideração. Então a chance de vocês não se aventurarem na masmorra é muito baixa. Sabemos da curiosidade e sede de aventuras de vocês, sabemos dos seus interesses também. Quem sabe é o nosso Hunter — ele é o responsável pela seleção do que chamamos de heróis, e vocês foram os primeiros três selecionados. Ele está em busca de mais heróis para se juntar a vocês.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "O que estamos oferecendo aqui é uma oportunidade de vocês se aventurarem nessa masmorra, arriscando suas vidas, mas sem a possibilidade de morrerem. Assim que chegarem a esse ponto, retornarão àquele portal novinhos em folha. Então aproveitem. Vejam bem: eu não sou um herói, me considero um facilitador. Vim parar aqui para facilitar as coisas, hehehe. Eu os guiarei e instruirei da melhor forma possível para que vocês alcancem suas ambições e se divirtam no processo. Mas façam como quiser.",
        },
      ],
    },
  ],
};
