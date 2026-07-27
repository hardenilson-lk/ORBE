export const TIPOS_SALA_HOSPITAL = [
  { id: "recepcao", nome: "Recepção", descricao: "Primeiro contato e triagem.", min: [5, 4], max: 1, peso: 5, inicial: true, final: false, secreta: false, objetos: ["recepcao"], luz: "media" },
  { id: "corredor-principal", nome: "Corredor principal", descricao: "Área ampla de circulação.", min: [3, 5], max: 1, peso: 2, inicial: true, final: false, secreta: false, objetos: ["circulacao"], luz: "media" },
  { id: "consultorio", nome: "Consultório", descricao: "Sala clínica de atendimento.", min: [3, 3], max: 4, peso: 5, inicial: false, final: true, secreta: false, objetos: ["consultorio"], luz: "media" },
  { id: "enfermaria", nome: "Enfermaria", descricao: "Área coletiva de internação.", min: [5, 4], max: 3, peso: 5, inicial: false, final: true, secreta: false, objetos: ["enfermaria"], luz: "media" },
  { id: "centro-cirurgico", nome: "Centro cirúrgico", descricao: "Sala de procedimentos invasivos.", min: [5, 4], max: 2, peso: 4, inicial: false, final: true, secreta: false, objetos: ["cirurgia"], luz: "clara" },
  { id: "farmacia", nome: "Farmácia", descricao: "Estoque controlado de medicamentos.", min: [3, 3], max: 2, peso: 3, inicial: false, final: false, secreta: false, objetos: ["farmacia"], luz: "media" },
  { id: "laboratorio-clinico", nome: "Laboratório clínico", descricao: "Análises e equipamentos laboratoriais.", min: [4, 3], max: 2, peso: 3, inicial: false, final: true, secreta: false, objetos: ["laboratorio"], luz: "clara" },
  { id: "almoxarifado", nome: "Almoxarifado", descricao: "Depósito de materiais hospitalares.", min: [3, 3], max: 2, peso: 4, inicial: false, final: false, secreta: true, objetos: ["estoque"], luz: "baixa" },
  { id: "banheiro", nome: "Banheiro", descricao: "Instalação sanitária.", min: [3, 3], max: 3, peso: 3, inicial: false, final: false, secreta: false, objetos: ["banheiro"], luz: "media" },
  { id: "necroterio", nome: "Necrotério", descricao: "Câmara fria e identificação de corpos.", min: [4, 4], max: 1, peso: 3, inicial: false, final: true, secreta: true, objetos: ["necroterio"], luz: "baixa" },
  { id: "arquivo-medico", nome: "Arquivo médico", descricao: "Prontuários e registros antigos.", min: [3, 3], max: 2, peso: 4, inicial: false, final: true, secreta: true, objetos: ["arquivo"], luz: "baixa" },
  { id: "administracao", nome: "Administração", descricao: "Gestão e comunicação interna.", min: [4, 3], max: 2, peso: 3, inicial: true, final: false, secreta: false, objetos: ["administracao"], luz: "media" },
  { id: "sala-maquinas", nome: "Sala de máquinas", descricao: "Infraestrutura elétrica e mecânica.", min: [4, 3], max: 1, peso: 3, inicial: false, final: true, secreta: true, objetos: ["maquinas"], luz: "escura" },
  { id: "isolamento", nome: "Quarto de isolamento", descricao: "Quarto selado para contenção.", min: [3, 3], max: 2, peso: 2, inicial: false, final: true, secreta: true, objetos: ["isolamento"], luz: "baixa" },
  { id: "sala-comum", nome: "Sala comum", descricao: "Área hospitalar sem função preservada.", min: [3, 3], max: 99, peso: 7, inicial: true, final: true, secreta: false, objetos: ["comum"], luz: "media" },
  { id: "sala-ritual", nome: "Sala de ritual", descricao: "Espaço alterado por atividade ocultista.", min: [4, 4], max: 1, peso: 1, inicial: false, final: true, secreta: true, objetos: ["ritual"], luz: "ritual" },
  { id: "area-interditada", nome: "Área interditada", descricao: "Setor bloqueado e estruturalmente comprometido.", min: [3, 3], max: 2, peso: 2, inicial: false, final: true, secreta: true, objetos: ["interditada"], luz: "apagada" },
];

export const TIPOS_OBRIGATORIOS_HOSPITAL = [
  ["recepcao"],
  ["enfermaria"],
  ["centro-cirurgico", "consultorio"],
  ["almoxarifado", "arquivo-medico"],
];

export function obterTipoSalaHospital(tipoId) {
  return TIPOS_SALA_HOSPITAL.find(({ id }) => id === tipoId) || null;
}
