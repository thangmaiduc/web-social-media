

import { Search } from '@material-ui/icons';
import classNames from 'classnames/bind';
import api from '../../../api/API';
import SuggestedGroups from '../../../components/SuggestedGroups/';
import styles from './Sidebar.module.scss';
const cx = classNames.bind(styles);


const handleSearch = () => { }
function Sidebar() {

    return (<div className='sidebar'>
        <div className={cx("sidebarWrapper")}>
            <div className={cx('top')}> <h4 className={cx("title")}>Nhóm</h4>
                <form className={cx('searchbar')} type='submit' onSubmit={handleSearch}>
                    <Search className={cx('searchIcon')} />
                    <input
                        placeholder='Tìm kiếm nhóm'
                        className={cx('searchInput')}
                    // value={textSearch}
                    // type='submit'
                    // onChange={(e) => setTextSearch(e.target.value)}
                    />
                </form>
            </div>
            <SuggestedGroups key={0} title='Đề xuất nhóm' url={api.QUERY_GROUP} />
            <SuggestedGroups key={1} title='Nhóm bạn đã tham gia' url={api.SUGGEST_GROUP} />
        </div>
    </div>);
}

export default Sidebar;

