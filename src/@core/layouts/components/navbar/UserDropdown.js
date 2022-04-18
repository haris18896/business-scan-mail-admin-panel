// ** React Imports
import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
// import { isUserLoggedIn } from '@utils'

// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { handleLogout } from '../../../../redux/actions/auth'
import { handleFetchProfile } from '../../../../redux/actions/admin/profile'

const UserDropdown = () => {
  const [userData] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()

  const { admin } = useSelector(state => state.auth)
  const { profile } = useSelector(state => state.profileUpdate)

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar

  useEffect(() => {
    dispatch(handleFetchProfile())
  }, [admin])

  const logoutHandler = () => {
    dispatch(handleLogout())
    history.push('/login')
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{(profile && profile['name']) || 'Your name'}</span>
          <span className='user-status'>{admin && admin['role'] === 'spradmin' ? 'Super Admin' : 'Admin'}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem to='/profile/update' tag={Link}>
          <User size={14} className='me-75' />
          <span className='align-middle'>Edit Profile</span>
        </DropdownItem>
        <DropdownItem to='/password/update' tag={Link}>
          <CheckSquare size={14} className='me-75' />
          <span className='align-middle'>Edit Password</span>
        </DropdownItem>
        <DropdownItem tag={Link} to='#' onClick={logoutHandler}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
