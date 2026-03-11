import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding budget domains...');

  // 1. ÁREAS
  const areasData = [
    { name: 'Campo' },
    { name: 'Backoffice' },
    { name: 'Comercial' },
  ];

  const areaMap = {};
  for (const a of areasData) {
    areaMap[a.name] = await prisma.area.upsert({
      where: { name: a.name },
      update: {},
      create: { name: a.name },
    });
  }
  console.log('✅ Áreas criadas');

  // 2. CARGOS
  const rolesData = [
    { name: 'Promotor', areaName: 'Campo' },
    { name: 'Supervisor', areaName: 'Campo' },
    { name: 'Coordenador', areaName: 'Campo' },
    { name: 'Analista', areaName: 'Backoffice' },
    { name: 'Assistente', areaName: 'Backoffice' },
    { name: 'Gerente', areaName: 'Comercial' },
  ];

  for (const r of rolesData) {
    await prisma.roleType.upsert({
      where: { name: r.name },
      update: { area_id: areaMap[r.areaName].id },
      create: { name: r.name, area_id: areaMap[r.areaName].id },
    });
  }
  console.log('✅ Cargos criados');

  // 3. GRUPOS DE VERBAS
  const groupsData = [
    'SALÁRIOS',
    'BENEFÍCIOS',
    'FERRAMENTAS',
    'OVERHEAD',
    'IMPOSTOS E TAXAS'
  ];

  const groupMap = {};
  for (const g of groupsData) {
    groupMap[g] = await prisma.verbaGroup.upsert({
      where: { name: g },
      update: {},
      create: { name: g },
    });
  }
  console.log('✅ Grupos de Verbas criados');

  // 4. VERBAS (Vinculadas aos seus grupos)
  const verbasData = [
    // SALÁRIOS
    { name: 'SALARIO BASE', groupName: 'SALÁRIOS' },
    { name: 'SALARIO MENSAL', groupName: 'SALÁRIOS' },
    { name: 'ADICIONAL NOTURNO', groupName: 'SALÁRIOS' },
    { name: 'HORA EXTRA', groupName: 'SALÁRIOS' },
    { name: 'BONIFICAÇÃO', groupName: 'SALÁRIOS' },
    { name: 'ENCARGOS TRABALHISTAS', groupName: 'SALÁRIOS' },
    { name: 'SUB TOTAL SALÁRIOS', groupName: 'SALÁRIOS' },

    // BENEFÍCIOS
    { name: 'ASSISTÊNCIA MÉDICA', groupName: 'BENEFÍCIOS' },
    { name: 'ASSISTÊNCIA ODONTOLÓGICA', groupName: 'BENEFÍCIOS' },
    { name: 'PPR MERCHAN', groupName: 'BENEFÍCIOS' },
    { name: 'SEGURO DE VIDA', groupName: 'BENEFÍCIOS' },
    { name: 'VALE ALIMENTAÇÃO', groupName: 'BENEFÍCIOS' },
    { name: 'TOTAL VR', groupName: 'BENEFÍCIOS' },
    { name: 'TOTAL VT', groupName: 'BENEFÍCIOS' },
    { name: 'CARTÃO MOBILIDADE', groupName: 'BENEFÍCIOS' },
    { name: 'KM', groupName: 'BENEFÍCIOS' },
    { name: 'ALUGUEL VEÍCULO', groupName: 'BENEFÍCIOS' },
    { name: 'SUB TOTAL BENEFÍCIOS', groupName: 'BENEFÍCIOS' },

    // FERRAMENTAS
    { name: 'LMS + ANALYTICS', groupName: 'FERRAMENTAS' },
    { name: 'AJUDA CELULAR', groupName: 'FERRAMENTAS' },
    { name: 'LICENÇA MOB2CON', groupName: 'FERRAMENTAS' },
    { name: 'DADOS + VOZ + APARELHO', groupName: 'FERRAMENTAS' },
    { name: 'SISTEMA DE COLETA', groupName: 'FERRAMENTAS' },
    { name: 'LOGÍSTICA', groupName: 'FERRAMENTAS' },
    { name: 'VIAGENS', groupName: 'FERRAMENTAS' },
    { name: 'EPI\'s + UNIFORME + KIT MERCHAN', groupName: 'FERRAMENTAS' },
    { name: 'INTELIGÊNCIA BI', groupName: 'FERRAMENTAS' },
    { name: 'NOTEBOOKS SUPERVISORES', groupName: 'FERRAMENTAS' },
    { name: 'SUB TOTAL FERRAMENTAS', groupName: 'FERRAMENTAS' },

    // OVERHEAD
    { name: 'COLIGADAS', groupName: 'OVERHEAD' },
    { name: 'ADM', groupName: 'OVERHEAD' },
    { name: 'PCMSO', groupName: 'OVERHEAD' },
    { name: 'R&S', groupName: 'OVERHEAD' },
    { name: 'SUB TOTAL OVERHEAD', groupName: 'OVERHEAD' },

    // IMPOSTOS
    { name: 'SUBTOTAL GERAL', groupName: 'IMPOSTOS E TAXAS' },
    { name: 'TAXA', groupName: 'IMPOSTOS E TAXAS' },
    { name: 'SUB TOTAL', groupName: 'IMPOSTOS E TAXAS' },
    { name: 'IMPOSTOS', groupName: 'IMPOSTOS E TAXAS' },
    { name: 'VALOR', groupName: 'IMPOSTOS E TAXAS' },
  ];

  for (const v of verbasData) {
    if (!groupMap[v.groupName]) {
      console.warn(`Grupo não encontrado para a verba: ${v.name}`);
      continue;
    }
    
    await prisma.verbaType.upsert({
      where: { name: v.name },
      update: { group_id: groupMap[v.groupName].id },
      create: { name: v.name, group_id: groupMap[v.groupName].id },
    });
  }
  console.log('✅ Verbas criadas');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
