import type { StoryPart } from "@/app/types/story";

/**
 * Prólogo: A Recepção.
 * Cinco heróis são invocados; o Host explica o mundo dos sonhos, masmorra, seres superiores, contrato e cidade.
 * Cada diálogo usa speakerId para o avatar em StoryView.
 */
export const prologo: StoryPart = {
  id: "prologo",
  title: "A Recepção",
  sections: [
    {
      id: "invocacao",
      image: {
        src: "/images/story/prologo-invocacao.png",
        alt: "Os cinco heróis invocados na marcação no chão, o Host os recebe",
      },
      content: [
        {
          type: "narrative",
          text: "Cinco heróis são invocados em uma marcação no chão: uma guerreira, uma arqueira, um mago, uma pistoleira e um anão. O Host os recebe.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Sejam bem-vindos, aventureiros. Parabéns, vocês foram escolhidos a participar desse maravilhoso mundo.",
        },
        {
          type: "dialogue",
          speaker: "Guerreira",
          speakerId: "warrior",
          text: "O que está acontecendo?",
        },
        {
          type: "dialogue",
          speaker: "Arqueira",
          speakerId: "archer",
          text: "Que lugar é esse?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Bom, deixe-me explicar a situação. Esse é um mundo mágico criado através da imaginação, desejo e ambição de um grande ser superior. E vocês têm a determinação necessária para participar dele.",
        },
        {
          type: "dialogue",
          speaker: "Mago",
          speakerId: "mage",
          text: "Como assim, um mundo mágico? Mas como viemos parar aqui?",
        },
        {
          type: "dialogue",
          speaker: "Pistoleira",
          speakerId: "gunner",
          text: "Mundo mágico... mas e o meu próprio mundo — como fica nessa história?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Calma, Calma aventureiros. Na realidade vocês não estão fisicamente aqui. O que ocorre é que seu mundo real, e seu eu real continuam no mesmo lugar, vocês estão apenas em um sono profundo em sua propria realidade. Todos vocês foram invocados aqui enquanto dormiam. Então tudo que viverem aqui não passará de apenas um sonho em suas proprias realidades.",
        },
        {
          type: "dialogue",
          speaker: "Anão",
          speakerId: "dwarf",
          text: "Então estou apenas sonhando?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Basicamente, Basicamente. Mas, diferente dos demais sonhos, esse aqui tem suas peculiaridades. Vocês podem passar o tempo que quiserem aqui antes de acordarem e retornarem para suas vidas. Interessante, Interessante não é? Ah, e mais uma coisa: caso desejem retornar imediatamente para suas proprias realidades, basta desejar e dizer: \"Despertar imediato\" e vocês retornarão.",
        },
        {
          type: "dialogue",
          speaker: "Guerreira",
          speakerId: "warrior",
          text: "Bom, toda essa historia de mundo dos sonhos esta me parecendo muito estranho, me parece tudo muito suspeito. Por que nos trouxe aqui e quais são suas reais intenções?",
        },
      ],
    },
    {
      id: "intencoes-masmorra",
      image: {
        src: "/images/story/prologo-mundo-sonhos.png",
        alt: "O mundo dos sonhos: na vida real todos dormem em paz",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Minhas reais intenções, intenções? Bom eu diria que seria satisfazer as vontades dos seres superiores e para isso devo lhes apresentar a nossa masmorra. Essa masmorra contem varios andares e desafios para vocês enfrentarem perfeito pra quem gosta de um desafio. Mas vou logo lhes avisando que ela nao e nada facil, ela contem vario monstros enigmas suepresas, mas elas tambem contem varias recompensas que deve agradar alguns de voces.",
        },
        {
          type: "dialogue",
          speaker: "Arqueira",
          speakerId: "archer",
          text: "Uma masmorra? Seres superiores? Explique melhor.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Bom, voces foram escolhidos a dedo para estarem aqui e participar desse mundo pois tem o poder e determinação necessaria para enfrentar essa aventura. Quem os convidou foi um dos seres superiores, sao seres que vivem entre esse mundo e outros mundos. Eles sao conhecidos como Mestres.",
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
          speaker: "Anão",
          speakerId: "dwarf",
          text: "Mas por que fariamos isso? quem esses seres superiores acham que sao para nos dar ordens?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Calma, calma — vocês não são obrigados a fazer nada. Mas se quiserem se desafiarem e serem recompensados por isso, eu diria que é uma boa opção: os danos, feridas e itens daqui não vão para o mundo real. As experiências vividas… essas sim ficam com vocês.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Podem enfrentá-la por conta própria; muitos aventureiros escolhem esse caminho. Se quiserem ir longe com mais apoio, podem fazer um contrato com os seres superiores — eles agiriam como mestres: sob contrato, vocês obedecem às ordens deles dentro da masmorra e, em troca, ganham várias vantagens concedidas por eles.",
        },
        {
          type: "dialogue",
          speaker: "Mago",
          speakerId: "mage",
          text: "Seres superiores? Mestres? Que tipo de vantagens?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "A primeira é um pagamento fixo, a partir da data em que se dispõem a participar da masmorra — como um salário. A segunda: vantagens durante a exploração. Por exemplo, a possibilidade de acumular experiência para a própria evolução — aprender técnicas novas e aprimorar as que já têm. Os seres superiores os guiam e, quando aceitam o contrato, fortalecem seu crescimento.",
        },
        {
          type: "dialogue",
          speaker: "Pistoleira",
          speakerId: "gunner",
          text: "E se não quisermos obedecer a ninguém?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
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
          speaker: "Host",
          speakerId: "host",
          text: "Para que o contrato não tenha validade perpétua, cada herói deve estabelecer seu próprio limite pessoal — quantas incursões, quanto tempo, o que fizer sentido para vocês. Isso pode ser acordado comigo.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Uma vez acordado, o herói fica à disposição para eventuais incursões na masmorra, até atingir esse limite. Uma quebra de contrato, porém, resulta na expulsão do mundo dos sonhos, com a deleção de todas as memórias vividas nele. Portanto, só assinem se estiverem dispostos a cumprir.",
        },
        {
          type: "dialogue",
          speaker: "Anão",
          speakerId: "dwarf",
          text: "Então, se quebrarmos o trato, perdemos tudo o que vivemos aqui da cabeça?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Exatamente. Por isso falo com clareza: o contrato é sério. Pensem bem.",
        },
      ],
    },
    {
      id: "tiro-reviver",
      image: {
        src: "/images/story/prologo-demonstracao.jpg",
        alt: "O Host demonstra: a pistoleira leva um tiro e revive no portal",
      },
      content: [
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Neste mundo dos sonhos há outras peculiaridades. Vejam bem. — O Host saca uma pistola antiga e atira no peito da pistoleira.",
        },
        {
          type: "narrative",
          text: "A pistoleira, sem tempo de reação, arregala os olhos e grita ao receber o tiro no peito, caindo para trás. Deitada no chão, coloca a mão no peito cheio de sangue e pergunta: — O que está acontecendo?",
        },
        { type: "narrative", text: "Os outros quatro heróis olham assustados." },
        {
          type: "dialogue",
          speaker: "Pistoleira",
          speakerId: "gunner",
          text: "Eu não estou sentindo tanta dor. Dói, mas isso deveria me matar ou ao menos doer pra caralho.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Aqui a dor é atenuada — deixamos um pouquinho para que a experiência faça sentido. E neste mundo vocês não morrem. — O Host se aproxima e dispara o restante do revolver. A pistoleira, de olhos arregalados, desmaterializa-se em pequenas luzes e reaparece em um portal marcado no chão.",
        },
        {
          type: "dialogue",
          speaker: "Pistoleira",
          speakerId: "gunner",
          text: "Eu estou viva! O que aconteceu?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Você reviveu. Como em todo sonho, o corpo aqui se refaz.",
        },
        {
          type: "dialogue",
          speaker: "Pistoleira",
          speakerId: "gunner",
          text: "Você é louco. Tudo isso é loucura.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Leve o tempo que precisarem para assimilar. Enquanto isso, fico por aqui. Quando estiverem prontos, venham falar comigo.",
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
          text: "— Depois de um tempo, os cinco heróis conversando entre si se encontram com o Host.",
        },
        {
          type: "dialogue",
          speaker: "Mago",
          speakerId: "mage",
          text: "Ainda temos muitas dúvidas sobre tudo isso. Mas gostaríamos de te perguntar: e se nos recusarmos a essa coisa de masmorra?",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Se não quiserem, podem ter uma vida normal neste lugar. Temos uma cidade com um pouco de tudo: campos, colheitas, tavernas ou bares. Uma pessoa foi trazida a este mundo e cuida dessa parte — se quiserem algo especial, falem com ela. Para manter as coisas interessantes, temos uma economia própria. Vocês, como novos aventureiros, podem ajudar a movimentá-la. Há uma loja de armas, um alquimista e várias outras coisas. Fiquem à vontade para fazer o que quiserem aqui.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Quando selecionamos vocês cinco, já levamos tudo em consideração. Sabemos da curiosidade e sede de aventuras de vocês. O nosso Hunter é o responsável pela seleção do que chamamos de heróis — vocês foram os primeiros cinco selecionados. Ele está em busca de mais para se juntar a vocês.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "O que oferecemos é a chance de se aventurarem na masmorra sem morrer de verdade: ao serem derrotados, retornam ao portal como estão agora. Eu não sou herói; me considero um facilitador. Vim para facilitar as coisas, hehehe. Os guiarei da melhor forma para que alcancem suas ambições e se divirtam no processo. Mas façam como quiser.",
        },
      ],
    },
  ],
};
