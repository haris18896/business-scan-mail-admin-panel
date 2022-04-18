import { Home, Mail, Settings } from 'react-feather'

export default [

  {
    id: 'mails',
    title: 'Email Audit Tool',
    icon: <Mail size={20} />,
    navLink: '/home'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <Settings size={20} />,
    navLink: '/settings'
  }
]
