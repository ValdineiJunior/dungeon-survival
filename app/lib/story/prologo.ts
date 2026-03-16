import type { StoryPart } from "@/app/types/story";

/**
 * Prólogo: A Recepção.
 * Cinco heróis (guerreira, arqueira, mago, pistoleira, anão) são invocados.
 * O recepcionista explica o mundo dos sonhos, os seres superiores e o contrato.
 */
export const prologo: StoryPart = {
  id: "prologo",
  title: "A Recepção",
  sections: [
    {
      id: "invocacao",
      image: {
        src: "/images/story/prologo-invocacao.jpg",
        alt: "Os cinco heróis invocados na marcação no chão, recepcionista os recebe",
      },
      content: [
        {
          type: "narrative",
          text: "Cinco heróis são invocados em uma marcação no chão: uma guerreira, uma arqueira, um mago, uma pistoleira e um anão. O recepcionista os recebe.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Sejam bem-vindos, aventureiros. Parabéns, vocês foram escolhidos a participar desse maravilhoso mundo.",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "O que está acontecendo?",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "Que lugar é esse?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Bom, deixe-me explicar a situação. Esse é um mundo mágico criado através da imaginação, desejo e ambição de todos que vêm parar aqui. E vocês têm a determinação necessária para participar dele.",
        },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Mas como viemos parar aqui?",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "E se esse é um mundo mágico, e o meu próprio mundo — como fica nessa história?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Calma, aventureiros. Na realidade vocês não estão fisicamente aqui. O que ocorre é que, em seu mundo real, vocês estão apenas em um sono profundo. Todos vocês foram invocados aqui enquanto dormiam. Então tudo que viverem aqui não passará de um sonho para vocês no mundo real.",
        },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Então estou apenas sonhando?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Basicamente. Mas, diferente dos demais sonhos, aqui vocês podem passar o tempo que quiserem antes de retornarem para suas vidas. Interessante, não é? Ah, e mais uma coisa: caso queiram retornar imediatamente para os seus mundos, basta desejar isso de coração e solicitar. Não temos uma palavra ou frase específica para isso — basta apenas desejar e vocês retornarão.",
        },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Bom, mas parece muito suspeito você estar nos explicando tudo isso. Quais são suas reais intenções por trás disso?",
        },
      ],
    },
    {
      id: "mundodossonhos",
      image: {
        src: "/images/story/prologo-mundo-sonhos.jpg",
        alt: "O mundo dos sonhos: na vida real todos dormem em paz",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Minhas intenções? Apresentar a vocês um desafio e uma oportunidade. Vocês foram convidados a uma masmorra de vários andares — e podem, se quiserem, fazer um contrato com os seres superiores que chamamos de mestres. Antes disso, saibam: os danos, feridas e itens daqui não vão para o mundo real. Mas as experiências vividas… essas sim ficam com vocês.",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "Uma masmorra? Seres superiores? Explique melhor.",
        },
      ],
    },
    {
      id: "seres-superiores-masmorra",
      image: {
        src: "/images/story/prologo-masmorra.jpg",
        alt: "A masmorra de vários andares e os seres superiores",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Vocês foram convidados a participar de uma masmorra — uma masmorra com vários andares, para vocês desafiarem. Podem enfrentá-la por conta própria, se quiserem; muitos aventureiros escolhem esse caminho.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Mas também podem realizar um contrato com os que chamamos de seres superiores. Eles agiriam como seus mestres. Sob contrato, vocês devem obedecer às ordens deles dentro da masmorra. Em troca, ganham várias vantagens concedidas por eles.",
        },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Seres superiores? Mestres? Que tipo de vantagens?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "A primeira é um pagamento fixo, a partir da data em que se dispõem a participar da masmorra — como um salário. A segunda: vantagens durante a exploração. Por exemplo, a possibilidade de acumular experiência para a própria evolução — aprender técnicas novas e aprimorar as que já têm. Os seres superiores os guiam e, quando aceitam o contrato, fortalecem seu crescimento.",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "E se não quisermos obedecer a ninguém?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Aí seguem por conta própria, como já disse. A masmorra está aberta a todos. O contrato é uma opção.",
        },
      ],
    },
    {
      id: "contrato-limite",
      image: {
        src: "/images/story/prologo-contrato.jpg",
        alt: "O acordo do contrato e o limite pessoal",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Para que o contrato não tenha validade perpétua, cada herói deve estabelecer seu próprio limite pessoal — quantas incursões, quanto tempo, o que fizer sentido para vocês. Isso pode ser acordado comigo.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Uma vez acordado, o herói fica à disposição para eventuais incursões na masmorra, até atingir esse limite. Uma quebra de contrato, porém, resulta na expulsão do mundo dos sonhos, com a deleção de todas as memórias vividas nele. Portanto, só assinem se estiverem dispostos a cumprir.",
        },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Então, se quebrarmos o trato, perdemos tudo o que vivemos aqui da cabeça?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Exatamente. Por isso falo com clareza: o contrato é sério. Pensem bem.",
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
          text: "Neste mundo dos sonhos há outras peculiaridades. Vejam bem. — O recepcionista saca uma pistola antiga e atira no peito de um dos heróis.",
        },
        {
          type: "narrative",
          text: "O herói, sem tempo de reação, arregala os olhos e grita ao receber o tiro no peito, caindo para trás. Deitado no chão, coloca a mão no peito cheio de sangue e pergunta: — O que está acontecendo?",
        },
        { type: "narrative", text: "Os outros quatro heróis olham assustados." },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Eu não estou sentindo tanta dor. Dói, mas isso deveria me matar ou ao menos doer pra caralho.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Aqui a dor é atenuada — deixamos um pouquinho para que a experiência faça sentido. E neste mundo vocês não morrem. — O recepcionista se aproxima e dispara o restante do revolver. O herói, de olhos arregalados, desmaterializa-se em pequenas luzes e reaparece em um portal marcado no chão.",
        },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Eu estou vivo! O que aconteceu?",
        },
        { type: "dialogue", speaker: "Recepcionista", text: "Você reviveu. Como em todo sonho, o corpo aqui se refaz." },
        {
          type: "dialogue",
          speaker: "Herói",
          text: "Você é maluco. Tudo isso é loucura.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Leve o tempo que precisarem para assimilar. Enquanto isso, vou ficar na recepção. Quando estiverem prontos, venham falar comigo.",
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
          text: "— Depois de um tempo, os cinco heróis conversando entre si se encontram com o recepcionista.",
        },
        {
          type: "dialogue",
          speaker: "Heróis",
          text: "Ainda temos muitas dúvidas sobre tudo isso. Mas gostaríamos de te perguntar: e se nos recusarmos a essa coisa de masmorra?",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Se não quiserem, podem ter uma vida normal neste lugar. Temos uma cidade com um pouco de tudo: campos, colheitas, tavernas ou bares. Uma pessoa foi trazida a este mundo e cuida dessa parte — se quiserem algo especial, falem com ela. Para manter as coisas interessantes, temos uma economia própria. Vocês, como novos aventureiros, podem ajudar a movimentá-la. Há uma loja de armas, um alquimista e várias outras coisas. Fiquem à vontade para fazer o que quiserem aqui.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "Quando selecionamos vocês cinco, já levamos tudo em consideração. Sabemos da curiosidade e sede de aventuras de vocês. O nosso Hunter é o responsável pela seleção do que chamamos de heróis — vocês foram os primeiros cinco selecionados. Ele está em busca de mais para se juntar a vocês.",
        },
        {
          type: "dialogue",
          speaker: "Recepcionista",
          text: "O que oferecemos é a chance de se aventurarem na masmorra sem morrer de verdade: ao serem derrotados, retornam ao portal como estão agora. Eu não sou herói; me considero um facilitador. Vim para facilitar as coisas, hehehe. Os guiarei da melhor forma para que alcancem suas ambições e se divirtam no processo. Mas façam como quiser.",
        },
      ],
    },
  ],
};
