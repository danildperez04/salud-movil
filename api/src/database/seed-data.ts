export interface RoleSeed {
  name: string;
  code: string;
}

export const ROLES: RoleSeed[] = [
  { name: 'Paciente', code: 'patient' },
  { name: 'Cuidador', code: 'caregiver' },
  { name: 'Personal de Salud', code: 'health_staff' },
  { name: 'Administrador', code: 'admin' },
];

export const GENRES = ['Masculino', 'Femenino'];

export const MAJORS = [
  'Medicina General',
  'Enfermería',
  'Psicología',
  'Nutrición',
  'Fisioterapia',
];

export const HEALTH_CENTER_TYPES = [
  'Hospital',
  'Centro de Salud',
  'Puesto de Salud',
];

export interface DepartmentSeed {
  name: string;
  municipalities: string[];
}

export const DEPARTMENTS: DepartmentSeed[] = [
  {
    name: 'Boaco',
    municipalities: [
      'Boaco',
      'Camoapa',
      'San José de los Remates',
      'San Lorenzo',
      'Santa Lucía',
      'Teustepe',
    ],
  },
  {
    name: 'Carazo',
    municipalities: [
      'Diriamba',
      'Dolores',
      'El Rosario',
      'Jinotepe',
      'La Conquista',
      'La Paz de Carazo',
      'San Marcos',
      'Santa Teresa',
    ],
  },
  {
    name: 'Chinandega',
    municipalities: [
      'Chichigalpa',
      'Chinandega',
      'Cinco Pinos',
      'Corinto',
      'El Realejo',
      'El Viejo',
      'Posoltega',
      'Puerto Morazán',
      'San Francisco del Norte',
      'San Pedro del Norte',
      'Santo Tomás del Norte',
      'Somotillo',
      'Villanueva',
    ],
  },
  {
    name: 'Chontales',
    municipalities: [
      'Acoyapa',
      'Comalapa',
      'El Coral',
      'Juigalpa',
      'La Libertad',
      'San Francisco de Cuapa',
      'San Pedro de Lóvago',
      'Santo Domingo',
      'Santo Tomás',
    ],
  },
  {
    name: 'Estelí',
    municipalities: [
      'Condega',
      'Estelí',
      'La Trinidad',
      'Pueblo Nuevo',
      'San Juan de Limay',
      'San Nicolás',
    ],
  },
  {
    name: 'Granada',
    municipalities: ['Diriá', 'Diriomo', 'Granada', 'Nandaime'],
  },
  {
    name: 'Jinotega',
    municipalities: [
      'El Cuá',
      'Jinotega',
      'La Concordia',
      'San José de Bocay',
      'San Rafael del Norte',
      'San Sebastián de Yalí',
      'Santa María de Pantasma',
      'Wiwilí de Jinotega',
    ],
  },
  {
    name: 'León',
    municipalities: [
      'Achuapa',
      'El Jicaral',
      'El Sauce',
      'La Paz Centro',
      'Larreynaga (Malpaisillo)',
      'León',
      'Nagarote',
      'Quezalguaque',
      'Santa Rosa del Peñón',
      'Telica',
    ],
  },
  {
    name: 'Madriz',
    municipalities: [
      'Las Sabanas',
      'Palacagüina',
      'San José de Cusmapa',
      'San Juan de Río Coco',
      'San Lucas',
      'Somoto',
      'Telpaneca',
      'Totogalpa',
      'Yalagüina',
    ],
  },
  {
    name: 'Managua',
    municipalities: [
      'Ciudad Sandino',
      'El Crucero',
      'Managua',
      'Mateare',
      'San Francisco Libre',
      'San Rafael del Sur',
      'Ticuantepe',
      'Tipitapa',
      'Villa El Carmen',
    ],
  },
  {
    name: 'Masaya',
    municipalities: [
      'Catarina',
      'La Concepción',
      'Masatepe',
      'Masaya',
      'Nandasmo',
      'Nindirí',
      'Niquinohomo',
      'San Juan de Oriente',
      'Tisma',
    ],
  },
  {
    name: 'Matagalpa',
    municipalities: [
      'Ciudad Darío',
      'Esquipulas',
      'Matagalpa',
      'Matiguás',
      'Muy Muy',
      'Rancho Grande',
      'Río Blanco',
      'San Dionisio',
      'San Isidro',
      'San Ramón',
      'Sébaco',
      'Terrabona',
      'Tuma-La Dalia',
    ],
  },
  {
    name: 'Nueva Segovia',
    municipalities: [
      'Ciudad Antigua',
      'Dipilto',
      'El Jícaro',
      'Jalapa',
      'Macuelizo',
      'Mozonte',
      'Murra',
      'Ocotal',
      'Quilalí',
      'San Fernando',
      'Santa María',
      'Wiwilí de Nueva Segovia',
    ],
  },
  {
    name: 'Rivas',
    municipalities: [
      'Altagracia',
      'Belén',
      'Buenos Aires',
      'Cárdenas',
      'Moyogalpa',
      'Potosí',
      'Rivas',
      'San Jorge',
      'San Juan del Sur',
      'Tola',
    ],
  },
  {
    name: 'Río San Juan',
    municipalities: ['El Almendro', 'El Castillo', 'Morrito', 'San Carlos'],
  },
  {
    name: 'Costa Caribe Norte',
    municipalities: [
      'Bonanza',
      'Mulukukú',
      'Prinzapolka',
      'Puerto Cabezas',
      'Rosita',
      'Siuna',
      'Waslala',
      'Waspán',
    ],
  },
  {
    name: 'Costa Caribe Sur',
    municipalities: [
      'Bluefields',
      'Corn Island',
      'Desembocadura de la Cruz de Río Grande',
      'El Ayote',
      'El Rama',
      'El Tortuguero',
      'Kukra Hill',
      'La Cruz de Río Grande',
      'Laguna de Perlas',
      'Muelle de los Bueyes',
      'Nueva Guinea',
      'Paiwas',
    ],
  },
];
