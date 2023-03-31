import classNames from 'classnames/bind';


import styles from './menu.module.scss';
const cx = classNames.bind(styles);

function Menu({ children }) {
    return (<div className={cx('wrapper')}>
        {children}
    </div>);
}

export default Menu;