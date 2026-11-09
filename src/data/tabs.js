// ── Navegación por pestañas del sitio ─────────────────────────────────────────
// Cada pestaña es un "panel" con sus secciones; los enlaces internos (#productos,
// #contacto, #ofertas…) siguen funcionando: se mapean a la pestaña que los contiene.

export const TABS = [
  { id: 'inicio',    label: 'Inicio' },
  { id: 'catalogo',  label: 'Catálogo' },
  { id: 'marcas',    label: 'Marcas' },
  { id: 'mayoreo',   label: 'Mayoreo' },
  { id: 'comunidad', label: 'Comunidad' },
  { id: 'guias',     label: 'Guías' },
  { id: 'contacto',  label: 'Contacto' },
]

// Pestaña → hash canónico que se guarda en la URL
export const TAB_HASH = {
  inicio:    '#inicio',
  catalogo:  '#productos',
  marcas:    '#marcas',
  mayoreo:   '#mayoreo',
  comunidad: '#comunidad',
  guias:     '#guias',
  contacto:  '#contacto',
}

// Ancla interna → pestaña que la contiene (#admin queda fuera a propósito)
export const ANCHOR_TAB = {
  // pestañas mismas
  inicio: 'inicio', catalogo: 'catalogo', marcas: 'marcas', mayoreo: 'mayoreo',
  comunidad: 'comunidad', guias: 'guias', contacto: 'contacto',
  // secciones dentro de cada pestaña
  '': 'inicio', nosotros: 'inicio',
  productos: 'catalogo', ofertas: 'catalogo', sabores: 'catalogo',
  promos: 'catalogo', presupuesto: 'catalogo',
  delivery: 'contacto',
}

export function tabFromHash(hash) {
  const id = String(hash || '').replace(/^#/, '')
  return ANCHOR_TAB[id] || 'inicio'
}
