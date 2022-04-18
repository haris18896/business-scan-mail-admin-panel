// ** React Imports
// ** Dropdowns Imports
import { Fragment } from 'react'

import UserDropdown from './UserDropdown'

// ** Using dispatch
import { useDispatch } from 'react-redux'

// ** Third Party Components
import { Sun, Moon, Menu } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'

const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props

  const dispatch = useDispatch()

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return (
        <Sun
          className='ficon'
          onClick={() => {
            setSkin('light')
            dispatch({ type: 'SET_SKIN', payload: 'light' })
          }}
        />
      )
    } else {
      return (
        <Moon
          className='ficon'
          onClick={() => {
            setSkin('dark')
            dispatch({ type: 'SET_SKIN', payload: 'dark' })
          }}
        />
      )
    }
  }

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div>
      <ul className='nav navbar-nav align-items-center ms-auto'>
        <UserDropdown />
      </ul>
    </Fragment>
  )
}
export default NavbarUser
