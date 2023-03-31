import classNames from 'classnames/bind';
import GENERAL_CONSTANTS from '../../GeneralConstants';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import styles from './GroupInformation.module.scss';
const cx = classNames.bind(styles);
function GroupInformation({ group }) {
    const renderAction = () => {
        let action = null;
        switch (group.state) {
            case GENERAL_CONSTANTS.STATE_MEMBER.APPROVED:
                action = (<button className={cx('btnJoin')}> Mời bạn bè</button>)
                break;
            case GENERAL_CONSTANTS.STATE_MEMBER.BANNED:
                action = (<button className={cx('btnJoin')} disabled>Bạn đã bị ban</button>)
                break;
            default:
                action = (<button className={cx('btnJoin')}> Tham gia nhóm</button>)
                break;
        }
        return action;

    }

    return (<div className={cx('wrapper')}>
        <div className={cx('top')}>
            <img className={cx('img')} src={group.img} alt='' />
        </div>
        <div className={cx('center')}>
            <span className={cx('title')}>{group.title}
            </span>
            <div className={cx('action')}>
                {renderAction()}
            </div>

        </div>
        <div className={cx('bottom')}>
            <Menu>
                <MenuItem title='Bài viết' to={`/groups/${group.id}`} />
                <MenuItem title='Quản lý thành viên' to={`/groups/${group.id}/members`} />
                <MenuItem title='Cài đặt nhóm' to={`/groups/${group.id}/setting`} />
            </Menu>
        </div>
    </div >);
}
export default GroupInformation;