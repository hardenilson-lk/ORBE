import { Circle, Group, Rect, Text, Image as KonvaImage } from "react-konva";
import { calcularPorcentagem, obterIniciais } from "./mapaKonvaUtils.js";
import useImagemKonva from "./useImagemKonva.js";

export default function TokenKonvaTeste({ token, tamanhoCelula, selecionado, aoSelecionar, aoMover }) {
  const foto = useImagemKonva(token.foto);
  const tamanho = tamanhoCelula * (token.tamanho || 1);
  const centro = tamanho / 2;
  const raio = Math.max(16, tamanho * 0.35);
  const larguraBarra = tamanho * 0.82;
  const alturaBarra = Math.max(3, tamanho * 0.055);
  const inicioBarra = (tamanho - larguraBarra) / 2;
  const barras = [
    ["#a83232", calcularPorcentagem(token.pvAtual, token.pvMaximo)],
    ["#3271ba", calcularPorcentagem(token.peAtual, token.peMaximo)],
    ["#d3a82f", calcularPorcentagem(token.sanAtual, token.sanMaximo)],
  ];

  return (
    <Group
      x={token.x}
      y={token.y}
      draggable
      onPointerDown={(evento) => { evento.cancelBubble = true; aoSelecionar(token.id); }}
      onDragStart={(evento) => { evento.cancelBubble = true; aoSelecionar(token.id); }}
      onDragEnd={(evento) => {
        evento.cancelBubble = true;
        aoMover(token, { x: evento.target.x(), y: evento.target.y() });
      }}
    >
      <Rect width={tamanho} height={tamanho} fill={selecionado ? "rgba(229,184,92,.18)" : "rgba(0,0,0,.06)"} stroke={selecionado ? "#f1c85f" : "transparent"} strokeWidth={3} cornerRadius={8} />
      <Circle x={centro} y={centro - tamanho * 0.1} radius={raio + 4} fill="#1d120c" stroke={selecionado ? "#f1c85f" : "#8f652a"} strokeWidth={3} shadowColor="#000" shadowBlur={8} />
      {foto ? (
        <KonvaImage image={foto} x={centro - raio} y={centro - tamanho * 0.1 - raio} width={raio * 2} height={raio * 2} cornerRadius={raio} />
      ) : (
        <Text x={centro - raio} y={centro - tamanho * 0.1 - 9} width={raio * 2} align="center" text={obterIniciais(token.nome)} fill="#f3cf79" fontSize={Math.max(12, raio * 0.65)} fontStyle="bold" />
      )}
      <Text x={2} y={tamanho * 0.67} width={tamanho - 4} align="center" text={token.nome} fill="#f4dfb0" fontSize={Math.max(9, tamanho * 0.115)} fontStyle="bold" ellipsis wrap="none" />
      {barras.map(([cor, porcentagem], indice) => (
        <Group key={cor} y={tamanho * 0.79 + indice * (alturaBarra + 2)}>
          <Rect x={inicioBarra} width={larguraBarra} height={alturaBarra} fill="#1a1512" opacity={0.9} />
          <Rect x={inicioBarra} width={larguraBarra * porcentagem} height={alturaBarra} fill={cor} />
        </Group>
      ))}
    </Group>
  );
}
