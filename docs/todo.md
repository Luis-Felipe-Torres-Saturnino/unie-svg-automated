# Objetivos rápidos Unie Movimentado

1. Salvar posicoes original Unie para:
	- Calculo distancia entre Cabeça-cursor para seguir;
	- Circulos referencia distância cabeça (thresholds etc.)

2. Usar ComputedStyle para corrigir posicao bones devido translate;
3. Não usar diretamente os membros corporais do unie com js (usar wrapper ou testar template);
4. Inserir cabeça unie como ultimo elemento (sobrepoe outros elementos);
5. corrigir translacao e escala do SVG para calculos de distancia funcionar
	- levar em conta:
      - translacao inline
      - X, Y, scale X, scale Y SVG
6. Fazer comportamento cabeça ir pra frente e voltar com cursor 


///Correcoes
1. Mover unie nao atualiza adequadamente:
	a) distancia cabeça-mouse adequadamente
	b) posicao bones original