
# Análise de estratégias de resgate de pessoas em naufrágios

## Link do artigo no Google drive:
https://docs.google.com/document/d/14rn3nJ8szdAuismSr4U_NcxJgr3GQIIdRGeLYETPCUA/edit

## Pré-Projeto
Descreva em uma parágrafo do que se trata seu projeto.

Busca e análise de métodos para resgate de pessoas naugrafadas em relação ao número de pessoas
salvas utilizando simulações com base em correnteza e tempo de sobrevivência das pessoas.


Quais áreas de conhecimento seu trabalho aborda? Alguma destas áreas está no CNPQ?
+ Modelos analíticos e de Simulação (simulação)
+ Análise de Algoritmos e Complexidade de Computação (Análise de Algoritmos)


Justifique a escolha do seu projeto.
+ O resgate de pessoas é uma situação crítica que requer muito cuidado, e o tempo é uma variável com
grande relevância para a sobrevivência das pessoas. Descrobrir o melhor método antes mesmo de se
deparar com essa situação pode gerar uma maior taxa de sucesso. O projeto busca achar o melhor
método que, com base nas possíveis variáveis, possa predizer a maior taxa de sobrevivência.


Definições do Experimento
+ Distribuir pessoas em locais próximos ao navio, simulando a fuga das pessoas. Após isso,
com base no tempo, as pessoas irão começar a se mover em uma direção condizente com correnteza.

Quais variáveis você pretende mensurar (pelo menos duas de entrada e de uma saída com variação no tempo) em seu projeto? Por que? Quais tipos de informação elas representarão?
+ Entradas:
  - Tempo de sobrevivência.
  - Desvio máximo do tempo de sobrevivência.
  - Quantidade de pessoas.
  - Perímetro do navio.
  - Unidades: Unidades de resgate e busca.
    para cada unidade:
      lotação (0..*)
      velocidade
      probabilidade de localizar pessoas (para cada pessoa)
      raio de visão
  - Tempo de deslocamento ao local.

+ Saídas:
  - Taxa de sobrevivência
  - Tempo final de resgate (em qual tempo as buscas pararam)
  - Número de sobreviventes encontrados
  - Número de sobreviventes resgatados  (resgate: somente pessoas vivas caracterizam resgate)

O que seu projeto analisará? Que hipóteses ele busca verificar?
+ Analisará a taxa de resgate/sobrevivência de pessoas em relação as variáveis e estratégias.
+ Algumas estratégias podem ser melhores em determinados cenários.

Qual o público-alvo que utilizará seu sistema?
+ Centrais de resgate de naufrágios.

Como você identificará seu modelo real? Será um modelo físico ou digital?
+ Um modelo digital que irá buscar o máximo de constantes reais em várias localizações críticas no mundo.

#### Resgate, Estratégias, Naufrágio



# Entrega M2 07/11/17

+ [x] Código ou link de onde está postado
+ [x] Apresentação Slides
+ [x] Referências para as informações teóricas, ilustras e/ou detalhadas;
+ [x] Identificação das variáveis utilizadas e equacionamentos
+ [x] Demosntração do modelo computacional, identificando também as variáveis de entrada e saída, tal como os agentes envolvidos e o objetivo do projeto
+ [x] Uma comparação indicando as semelhanças e diferenças com o mundo real/teórico/dados obtidos
