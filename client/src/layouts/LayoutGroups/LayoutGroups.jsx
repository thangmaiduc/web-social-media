import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../components/Sidebar';
import classNames from 'classnames/bind';
import styles from './LayoutGroup.module.scss';
import MenuItem from '../../components/menu/MenuItem';
const cx = classNames.bind(styles);

function LayoutGroup({ children }) {
    return (<div className={cx('wrapper')}>
        <Topbar />
        <div className={cx('container')}>
            <Sidebar />
            <div className={cx('content')}>

                {children}
            </div >
            {/* <Rightbar /> */}
        </div >
    </div >);
}

export default LayoutGroup;