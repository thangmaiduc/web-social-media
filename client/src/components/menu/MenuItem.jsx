import classNames from 'classnames/bind';
import { NavLink, useLocation, useParams } from 'react-router-dom';


import styles from './menu.module.scss';
const cx = classNames.bind(styles);

function MenuItem({ icon, solidIcon, to, title = '' }) {
    const location = useLocation();
    let pattern = new RegExp(`^${to}`);
    // let res = pattern.test(location.pathname) || (location.pathname === '/' && to === '/home')
    let res = to === location.pathname;
    console.log(res);
    return (
        <NavLink to={to} className={(nav) => cx('menuItem', { active: res })}>
            {!res ? icon : solidIcon}
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}

export default MenuItem;