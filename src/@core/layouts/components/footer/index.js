// ** Icons Import
import { Heart } from 'react-feather'
import { useSelector } from 'react-redux'

const Footer = () => {
  const { currentSkin } = useSelector(state => state.skin)

  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a
          href='/home'
          className={currentSkin === 'light' ? 'text-primary' : 'text-secondary'}
          // target='_blank' rel='noopener noreferrer'
        >
          VISAB MAIL - ADMIN PANEL
        </a>
        <span className='d-none d-sm-inline-block'>, All rights Reserved</span>
      </span>
    </p>
  )
}

export default Footer
