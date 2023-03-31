import classNames from 'classnames/bind';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';

import styles from './SuggestedGroups.module.scss';

const cx = classNames.bind(styles);
function SuggestedGroups({ title, url }) {
    const [page, setPage] = useState(0)

    const { data, loading, hasMore } = useQuery(url, page, {})
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                {title}
            </div>
            <div className={cx('wrapperItems')}>
                {
                    data.map(item => (
                        <Link to={`/groups/${item.id}`} className={cx('item')}>
                            <img src={item.img} className={cx('image')} alt='' />
                            <div className={cx('detail')}>
                                <p className={cx('name')}>{item.title}</p>
                                <span className={cx('time')}>hoat dong 4 gio truoc</span>
                            </div>
                        </Link>
                    ))
                }


            </div>
            <span className={cx('seeMore')}>Xem thêm</span>
        </div>);
}

export default SuggestedGroups;
