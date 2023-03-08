import { SidebarItem } from "../types/sidebar-item";

export const navigation: SidebarItem[] = [
  {
    title: 'Vacantes y Requisiciones',
    type: 'group',
    icon: 'vacantes.png',
    children: [
      {
        title: 'Gestión de vacantes',
        type: 'item',
        url: 'vacancies/',
        profiles: [1, 2, 3],

      },
      {
        title: 'Requisiciones',
        type: 'item',
        url: 'requisitions/',
        profiles: [1, 2, 3],
      },
    ]
  },
  {
    title: 'Datos globales',
    type: 'group', icon: 'datosGlobales.png',
    children: [
      {
        title: 'Competencias y/o Habilidades', type: 'item', url: 'skills/list',
        profiles: [1]
      },
      {
        title: 'Sectores', type: 'item', url: 'sectors',
        profiles: [1]
      },
      {
        title: 'Conductas', type: 'item', url: 'behaviours',
        profiles: [1]
      },
      {
        title: 'Planes de formación', type: 'item', url: 'trainingPlans',
        profiles: [1]
      },
      {
        title: 'Factores e items', type: 'item', url: 'FPO/list',
        profiles: [1]
      },
      {
        title: 'Empresas grupo logis', type: 'item', url: 'groupBusinesses/list',
        profiles: [1]
      },
    ]
  },
  {
    title: 'Blog',
    type: 'item', icon: 'blog.png',
    url: 'blogs/posts-list',
    profiles: [1]
  },
  {
    title: 'Pruebas', type: 'group', icon: 'pruebas.png',
    children: [
      {
        title: 'Pruebas psicotécnicas', type: 'item', url: 'tests',
        profiles: [1, 2]
      },
      {
        title: 'Pruebas de personalidad', type: 'item', url: 'personalityTests',
        profiles: [1, 2]
      }
    ]
  },
  {
    title: 'Entrevistas',
    type: 'group',
    icon: 'entrevistas.png',
    children: [
      {
        title: 'Entrevistas', type: 'item', url: 'calendar',
        profiles: [1, 2]
      },
      {
        title: 'Pre-Entrevistas', type: 'item', url: 'preinterviews-users',
        profiles: [1, 2]
      }
    ]
  },
  {
    title: 'Usuarios',
    icon: 'usuarios.png',
    type:'group',
    children:[
      {
        title: 'Todos los usuarios', type: 'item', url: 'users',
        profiles: [1,3]
      },
      {
        title: 'Empresas', type: 'item', url: 'business/list',
        profiles: [1]
      }
    ]
  },
  {
    title: 'Ordenes de ingreso',
    type: 'item', icon: 'ordenes.png', url: 'entryOrders/list',
    profiles: [1, 3]
  },
  {
    title: 'Mi Empresa',
    type: 'item', icon: 'empresas.png', url: 'business/profile/me',
    profiles: [3]
  },
  {
    title: 'Planes contratados',
    type: 'item', icon: 'empresas.png', url: 'business/plans',
    profiles: [3]
  },
  {
    title: 'Movimientos',
    type: 'item', icon: 'empresas.png', url: 'business/purchases',
    profiles: [3]
  },
  {
    title: 'Membresias',
    type: 'item', icon: 'Membresias.png', url: 'memberships/list',
    profiles: [1, 2]
  },
  {
    title: 'Estadísticas',
    type: 'item', icon: 'estadisticas.png',
    url: 'statistics/main',
    profiles: [1]
  },
  {

    title: 'Chats',
    type: 'item', icon: 'chats.png', url: 'chat',
    profiles: [1, 2]
  },
  {
    title: 'Configuraciones',
    type: 'group',
    icon: 'configuraciones.png',
    children: [
      {
        title: 'Configurar Pre-Entrevista', type: 'item', url: 'preinterviews',
        profiles: [1, 2]
      },
      {
        title: 'Configurar Notificaciones', type: 'item', url: 'settings/notifications',
        profiles: [1]
      },
      {
        title: 'Empresas Aliadas', type: 'item', url: 'settings/partners',
        profiles: [1]
      },
      {
        title: 'Casos de Éxito', type: 'item', url: 'success-cases/cases-list',
        profiles: [1]
      },
      {
        title: 'Tipos de servicio', type: 'item', url: 'settings/serviceType/1',
        profiles: [1]
      },
      {
        title: 'Configurar Redes Sociales', type: 'item', url: 'social-networks',
        profiles: [1, 2]
      },
    ]
  },
  {
    title: 'Candidatos',
    type: 'item', icon: 'candidatos.png',
    url: 'users',
    profiles: [2]
  },
]