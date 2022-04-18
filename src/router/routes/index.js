import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - VISAB - Admin Panel'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
    
  },

  {
    path: '/login',
    component: lazy(() => import('../../views/auth')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/profile/update',
    component: lazy(() => import('../../views/admin/update/UpdateProfile')),
    layout: 'BlankLayout'
  },
  {
    path: '/password/update',
    component: lazy(() => import('../../views/admin/update/UpdatePassword')),
    layout: 'BlankLayout'
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  },
  {
    path: '/settings',
    component: lazy(() => import('../../views/Settings'))
  }
]

export { DefaultRoute, TemplateTitle, Routes }
