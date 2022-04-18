// ** React Imports
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

// ** Icons Imports
import { Disc, X, Circle } from 'react-feather'

// ** Config
import themeConfig from '@configs/themeConfig'
import { useSelector } from 'react-redux'

const VerticalMenuHeader = props => {
  // ** Props
  const { menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover } = props

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  const { currentSkin } = useSelector(state => state.skin)

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour='toggle-icon'
          className='toggle-icon d-none d-xl-block'
          onClick={() => {
            setMenuCollapsed(true)
          }}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour='toggle-icon'
          className='toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className='navbar-header'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item me-auto'>
          <NavLink to='/' className='navbar-brand'>
            <span className='brand-logo'>
              <img src={themeConfig.app.appLogoImage01} alt='logo' />
            </span>
            {currentSkin === 'light' ? (
              <h2 className='mb-0 app-name text-primary'>{themeConfig.app.appName}</h2>
            ) : (
              <h2 className='mb-0 app-name'>{themeConfig.app.appName}</h2>
            )}
          </NavLink>
        </li>
        
        {currentSkin === 'light' ? (
        
          <li className='nav-item nav-toggle'>
            <div className='modern-nav-toggle cursor-pointer text-primary'>
              <Toggler />
              <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none' size={20} />
            </div>
          </li>) : (
            <li className='nav-item nav-toggle'>
            <div className='modern-nav-toggle cursor-pointer text-secondary'>
              <Toggler />
              <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none' size={20} />
            </div>
          </li>
          )}
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
