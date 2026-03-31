// Mock Data for KameshOrder-inspired Application

export const SEASONS = ['SS25', 'FW25', 'SS26', 'FW26'];
export const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories', 'Dresses'];
export const COLORS = ['Black', 'White', 'Navy', 'Camel', 'Olive', 'Burgundy', 'Slate', 'Cream'];
export const REGIONS  = ['Northeast', 'Southeast', 'Midwest', 'West Coast', 'Southwest', 'International'];
export const CLUSTERS = ['Flagship', 'Premium', 'Standard', 'Outlet'];
export const CHANNELS = ['Full Price', 'Off Price', 'E-commerce', 'Wholesale'];
export const CLIMATES = ['Temperate', 'Cold', 'Warm', 'Arid'];

export const PRODUCTS = [
  { id: 'p001', name: 'Alpine Puffer Jacket', sku: 'ALJ-001', category: 'Outerwear', season: 'FW25', color: 'Black', msrp: 348, wholesale: 174, emoji: '🧥' },
  { id: 'p002', name: 'Technical Shell Vest',  sku: 'TSV-002', category: 'Outerwear', season: 'FW25', color: 'Olive', msrp: 228, wholesale: 114, emoji: '🦺' },
  { id: 'p003', name: 'Merino Crew Sweater',   sku: 'MCS-003', category: 'Tops',      season: 'FW25', color: 'Navy', msrp: 168, wholesale: 84, emoji: '👕' },
  { id: 'p004', name: 'Wide-Leg Cargo Pant',   sku: 'WCP-004', category: 'Bottoms',   season: 'FW25', color: 'Camel', msrp: 198, wholesale: 99, emoji: '👖' },
  { id: 'p005', name: 'Cashmere Turtleneck',   sku: 'CTN-005', category: 'Tops',      season: 'FW25', color: 'Cream', msrp: 298, wholesale: 149, emoji: '🧣' },
  { id: 'p006', name: 'Leather Ankle Boot',    sku: 'LAB-006', category: 'Footwear',  season: 'FW25', color: 'Black', msrp: 428, wholesale: 214, emoji: '👢' },
  { id: 'p007', name: 'Oversized Blazer',      sku: 'OBZ-007', category: 'Outerwear', season: 'FW25', color: 'Slate', msrp: 368, wholesale: 184, emoji: '🥼' },
  { id: 'p008', name: 'Chunky Knit Cardigan',  sku: 'CKC-008', category: 'Tops',      season: 'FW25', color: 'Burgundy', msrp: 218, wholesale: 109, emoji: '🧶' },
  { id: 'p009', name: 'Slim Taper Chino',      sku: 'STC-009', category: 'Bottoms',   season: 'FW25', color: 'Navy', msrp: 148, wholesale: 74, emoji: '👖' },
  { id: 'p010', name: 'Suede Chelsea Boot',    sku: 'SCB-010', category: 'Footwear',  season: 'FW25', color: 'Camel', msrp: 378, wholesale: 189, emoji: '👞' },
  { id: 'p011', name: 'Quilted Shoulder Bag',  sku: 'QSB-011', category: 'Accessories', season: 'FW25', color: 'Black', msrp: 248, wholesale: 124, emoji: '👜' },
  { id: 'p012', name: 'Wrap Midi Dress',       sku: 'WMD-012', category: 'Dresses',   season: 'SS25', color: 'Burgundy', msrp: 228, wholesale: 114, emoji: '👗' },
  { id: 'p013', name: 'Ribbed Tank Top',       sku: 'RTT-013', category: 'Tops',      season: 'SS25', color: 'White', msrp: 68, wholesale: 34, emoji: '👕' },
  { id: 'p014', name: 'Linen Wide Trousers',   sku: 'LWT-014', category: 'Bottoms',   season: 'SS25', color: 'Cream', msrp: 178, wholesale: 89, emoji: '👖' },
  { id: 'p015', name: 'Raffia Tote',           sku: 'RFT-015', category: 'Accessories', season: 'SS25', color: 'Camel', msrp: 168, wholesale: 84, emoji: '👜' },
  { id: 'p016', name: 'Slip-On Espadrille',    sku: 'SOE-016', category: 'Footwear',  season: 'SS25', color: 'Navy', msrp: 138, wholesale: 69, emoji: '👟' },
];

export const DOORS = [
  { id: 'd001', name: 'NYC Flagship',       code: 'NYC-FL', region: 'Northeast', cluster: 'Flagship', channel: 'Full Price', climate: 'Temperate', notes: 'Top-volume store. Priority allocation for new launches.', units: 1240, revenue: 184200 },
  { id: 'd002', name: 'LA Melrose',         code: 'LAX-ML', region: 'West Coast', cluster: 'Premium', channel: 'Full Price', climate: 'Warm', notes: 'Trend-forward clientele. Strong in outerwear and footwear.', units: 980, revenue: 142100 },
  { id: 'd003', name: 'Chicago Mag Mile',   code: 'CHI-MM', region: 'Midwest', cluster: 'Flagship', channel: 'Full Price', climate: 'Cold', notes: 'Cold-climate door. Over-index on outerwear.', units: 860, revenue: 118400 },
  { id: 'd004', name: 'Miami Design Dist.', code: 'MIA-DD', region: 'Southeast', cluster: 'Premium', channel: 'Full Price', climate: 'Warm', notes: 'Year-round warm. Limited outerwear buying.', units: 720, revenue: 96800 },
  { id: 'd005', name: 'Dallas Galleria',    code: 'DAL-GA', region: 'Southwest', cluster: 'Standard', channel: 'Full Price', climate: 'Arid', notes: 'Growing market. Standard assortment.', units: 540, revenue: 72100 },
  { id: 'd006', name: 'Seattle Pike Pl.',   code: 'SEA-PP', region: 'West Coast', cluster: 'Premium', channel: 'Full Price', climate: 'Temperate', notes: 'Outdoorsy lifestyle. High performance goods demand.', units: 670, revenue: 91200 },
  { id: 'd007', name: 'Boston Newbury',     code: 'BOS-NB', region: 'Northeast', cluster: 'Premium', channel: 'Full Price', climate: 'Cold', notes: 'Academic clientele. Prep and smart-casual styles.', units: 590, revenue: 83400 },
  { id: 'd008', name: 'Atlanta Lenox',      code: 'ATL-LN', region: 'Southeast', cluster: 'Standard', channel: 'Full Price', climate: 'Warm', notes: 'Growing Southeast hub.', units: 480, revenue: 62800 },
  { id: 'd009', name: 'SF Union Square',    code: 'SFO-US', region: 'West Coast', cluster: 'Flagship', channel: 'Full Price', climate: 'Temperate', notes: 'High traffic tourist store. Core basics perform well.', units: 1100, revenue: 162400 },
  { id: 'd010', name: 'Portland Pearl',     code: 'PDX-PR', region: 'West Coast', cluster: 'Standard', channel: 'Full Price', climate: 'Temperate', notes: 'Sustainability-focused clientele.', units: 420, revenue: 54200 },
  { id: 'd011', name: 'Denver 16th St.',    code: 'DEN-ST', region: 'Southwest', cluster: 'Standard', channel: 'Full Price', climate: 'Cold', notes: 'Outdoor lifestyle. Functional fashion.', units: 460, revenue: 67300 },
  { id: 'd012', name: 'Austin Domain',      code: 'AUS-DO', region: 'Southwest', cluster: 'Premium', channel: 'Full Price', climate: 'Arid', notes: 'Tech-crowd affluent buyers. Trendy.', units: 610, revenue: 88100 },
];

export const DELIVERIES = [
  { id: 'del1', name: 'Delivery 1 – Early Season', start: 'Aug 1', end: 'Sep 15, 2025' },
  { id: 'del2', name: 'Delivery 2 – Main Floor',   start: 'Sep 16', end: 'Nov 1, 2025' },
  { id: 'del3', name: 'Delivery 3 – Holiday',      start: 'Nov 2', end: 'Dec 15, 2025' },
  { id: 'del4', name: 'Delivery 4 – Year End',     start: 'Dec 16', end: 'Jan 31, 2026' },
];

export const BUYING_STAGES = ['Preline', 'Buying', 'Pre-Approved', 'Approved', 'Ordered'];

export const INITIAL_ASSORTMENTS = [
  {
    id: 'a001',
    name: 'FW25 Core Collection',
    season: 'FW25',
    stage: 'Buying',
    delivery: 'del2',
    doors: ['d001','d002','d003','d009'],
    products: ['p001','p002','p003','p004','p005','p006','p007'],
    createdAt: '2025-04-10',
    updatedAt: '2025-05-02',
    owner: 'Alex Kim',
    shared: true,
    icon: 'teal',
  },
  {
    id: 'a002',
    name: 'FW25 Premium Doors',
    season: 'FW25',
    stage: 'Pre-Approved',
    delivery: 'del1',
    doors: ['d001','d002','d006','d007','d009','d012'],
    products: ['p001','p005','p007','p010','p011'],
    createdAt: '2025-03-28',
    updatedAt: '2025-04-20',
    owner: 'Jordan Lee',
    shared: false,
    icon: 'violet',
  },
  {
    id: 'a003',
    name: 'SS25 Warm Markets',
    season: 'SS25',
    stage: 'Approved',
    delivery: 'del4',
    doors: ['d002','d004','d008','d010'],
    products: ['p012','p013','p014','p015','p016'],
    createdAt: '2025-02-14',
    updatedAt: '2025-03-11',
    owner: 'Alex Kim',
    shared: true,
    icon: 'amber',
  },
  {
    id: 'a004',
    name: 'FW25 Holiday Drop',
    season: 'FW25',
    stage: 'Preline',
    delivery: 'del3',
    doors: ['d001','d002','d003','d006','d009'],
    products: ['p001','p008','p011'],
    createdAt: '2025-05-05',
    updatedAt: '2025-05-05',
    owner: 'Sam Rivera',
    shared: false,
    icon: 'blue',
  },
];
