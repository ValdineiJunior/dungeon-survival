import type { StoryPart } from "@/app/types/story";

/**
 * Prólogo: A Recepção.
 * Cinco heróis são invocados; o Host explica o mundo dos sonhos, masmorra, contrato e cidade; os três heróis iniciais fecham os termos com o Host.
 * Cada diálogo usa speakerId para o avatar em StoryView.
 */
export const prologo: StoryPart = {
  id: "prologo",
  title: "A Recepção",
  sections: [
    {
      id: "invocacao",
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
          text: "Basicamente, Basicamente. Mas, diferente dos demais sonhos, esse aqui tem suas peculiaridades. Vocês podem passar o tempo que quiserem aqui antes de acordarem e retornarem para suas vidas. Interessante, Interessante não é?",
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
      content: [
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Minhas reais intenções, intenções? Bom eu diria que seria satisfazer as vontades dos seres superiores e para isso devo lhes apresentar a nossa masmorra. Essa masmorra contem varios andares e desafios para vocês enfrentarem perfeito pra quem gosta de um desafio. Mas vou logo lhes avisando que ela nao e nada facil, ela contem vario monstros enigmas suepresas, mas elas tambem contem varias recompensas que deve agradar alguns de voces. Lá dentro podem encontrar vários itens e moedas de ouro — úteis para a sobrevivência e para o dia a dia neste mundo.",
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
          text: "Aí seguem por conta própria, como já disse. A masmorra está aberta a todos.",
        },
      ],
    },
    {
      id: "contrato-limite",
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
          text: "Se não quiserem, podem ter uma vida normal neste lugar. Temos uma cidade com um pouco de tudo: campos, colheitas, tavernas ou bares. Uma pessoa foi trazida a este mundo e cuida dessa parte — se quiserem algo especial, falem com ela. Para manter as coisas interessantes, temos uma economia própria. Vocês, como novos aventureiros, podem ajudar a movimentá-la. Há uma loja de armas, um alquimista e várias outras coisas. Fiquem à vontade para fazer o que quiserem aqui.  O contrato é uma opção. Ah, e mais uma coisa: caso desejem retornar imediatamente para suas proprias realidades, basta desejar e dizer: \"Despertar imediato\" e vocês retornarão.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Para se estabelecerem ao chegar, cada um recebe uma quantia em ouro para gastos pessoais — até arranjarem um emprego na cidade ou passarem a ganhar com a masmorra, se for o caminho que escolherem.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Quando trouxemos vocês cinco para cá, já levamos muito em consideração o perfil de cada um. O nosso Hunter é o responsável pela seleção do que chamamos de heróis — vocês são mais um grupo entre os convocados a este mundo; ele segue em busca de outros para somar aos que já estão aqui.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "O que oferecemos é a chance de se aventurarem na masmorra sem morrer de verdade: ao serem derrotados, retornam ao portal como estão agora. Eu não sou herói; me considero um facilitador. Vim para facilitar as coisas, hehehe. Os guiarei da melhor forma para que alcancem suas ambições e se divirtam no processo. Mas façam como quiser.",
        },
        {
          type: "narrative",
          text: "Para entenderem melhor a situação no próprio ritmo, decidem rumar à cidade. A pistoleira vai na frente, o rosto fechado — ainda carregando a raiva do que acabou de viver.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Ei, pistoleira — se quiser afinar o manejo da arma e o tempo de reação, é só voltar a me procurar. Foi mais rápido que você naquele instante, não foi?",
        },
        {
          type: "narrative",
          text: "Ela não responde: vira o rosto, aperta o passo e segue em direção à cidade. Os outros quatro trocam olhares, ainda assimilando tudo, e também partem rumo ao povoado.",
        },
      ],
    },
    {
      id: "dias-cidade-contrato",
      content: [
        {
          type: "narrative",
          text: "Alguns dias passam. Na cidade, a arqueira, a guerreira e o mago se aproximam, fazem amizade e decidem enfrentar a masmorra juntos.",
        },
        {
          type: "narrative",
          text: "O Host acompanha o movimento à distância: de uma estalagem, observa quem se encaminha para desafiar a masmorra. Não intervém — limita-se a ver passar.",
        },
        {
          type: "narrative",
          text: "Em outro momento, vê o anão entrar na masmorra sozinho. Mais tarde, bem disfarçada, a pistoleira também entra por conta própria.",
        },
        {
          type: "narrative",
          text: "Depois de um tempo, os três heróis que estreitaram laços voltam a procurar o Host: decidiram firmar contrato com os seres superiores.",
        },
      ],
    },
    {
      id: "contrato-termos-iniciais",
      content: [
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Hora, hora — o que temos aqui? Um verdadeiro grupo de aventureiros.",
        },
        {
          type: "dialogue",
          speaker: "Guerreira",
          speakerId: "warrior",
          text: "Bom, viemos experimentar e decidimos os três fazer esse contrato.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Olha, olha! Muito bem. E por acaso já decidiram os termos dos contratos?",
        },
        {
          type: "dialogue",
          speaker: "Arqueira",
          speakerId: "archer",
          text: "Bem… sim. Ou parcialmente, sim. Eu gostaria de melhorar minhas habilidades com o arco, para poder retornar com um pouco mais de destreza ao meu próprio mundo. Olha, não sou muito reconhecida entre meus companheiros, então gostaria de melhorar e surpreendê-los. É isso: melhorar minhas habilidades com o arco.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Isso me parece interessante, mas ainda é vago. Posso fazer uma sugestão?",
        },
        {
          type: "dialogue",
          speaker: "Arqueira",
          speakerId: "archer",
          text: "Claro.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Que tal você se comprometer a derrotar cem inimigos usando seu arco de longo alcance?",
        },
        {
          type: "dialogue",
          speaker: "Arqueira",
          speakerId: "archer",
          text: "Cem inimigos? Isso é muita coisa.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Veja bem: junto ao contrato vêm alguns benefícios que ajudam a superar esse desafio — posso explicar depois. E se deseja se especializar de verdade no arco, esta é uma ótima oportunidade; no seu mundo real dificilmente teria treino assim contra tantos inimigos.",
        },
        {
          type: "dialogue",
          speaker: "Arqueira",
          speakerId: "archer",
          text: "Tudo bem — aceito o desafio.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Muito bem. E os outros dois, o que será?",
        },
        {
          type: "dialogue",
          speaker: "Guerreira",
          speakerId: "warrior",
          text: "Bem, fiquei mais interessada nas vantagens do contrato; não tenho nada em mente para os termos ainda. Só gostaria de ser uma guerreira melhor.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Nesse caso não quer treinar com uma arma em específico — quer melhorar como guerreira em geral. Podemos usar termos mais básicos, os que ofereço a vários heróis: que tal derrotar o primeiro chefe da masmorra dez vezes?",
        },
        {
          type: "dialogue",
          speaker: "Guerreira",
          speakerId: "warrior",
          text: "Hora, hora… não consegui derrotá-lo uma única vez ainda, mas estou doido para cortar a cabeça daquele desgraçado. Vamos embora — aceito o desafio.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Muito bem, muito bem — contrato fechado. Agora só falta o senhor estiloso.",
        },
        {
          type: "dialogue",
          speaker: "Mago",
          speakerId: "mage",
          text: "Engraçadinho! Vamos direto ao ponto: tenho uma proposta. Atualmente sou bom com feitiços individuais, mas preciso melhorar minhas habilidades com magias em área. Gostaria de estabelecer uma meta de derrotar inimigos usando magias em área — acredito que derrotar uns trinta inimigos seriam o suficiente para me acostumar e aprender o jeito delas.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Olha, olha — gosto de você, que pessoa decidida. Mas que tal aumentarmos para cinquenta inimigos? Não acha meio injusto? Sua colega aqui precisa derrotar cem com o arco, não é?",
        },
        {
          type: "dialogue",
          speaker: "Mago",
          speakerId: "mage",
          text: "E ainda se diz facilitador — parece mais um negociador. Bom, de qualquer modo me parece razuavel ver aceitar o contrato.",
        },
        {
          type: "dialogue",
          speaker: "Host",
          speakerId: "host",
          text: "Ótimo, ótimo. Contratos fechados — meus parabéns. Agora deixem que eu lhes explique as vantagens adquiridas em detalhes — venham comigo.",
        },
        {
          type: "narrative",
          text: "O Host conduz os três até uma mesa ao fundo e passa a detalhar, um a um, os benefícios ligados a cada contrato.",
        },
      ],
    },
  ],
};
