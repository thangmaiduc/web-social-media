import Feed from '../../components/feed/Feed';
import LayoutGroup from '../../layouts/LayoutGroups/LayoutGroups';
import classNames from 'classnames/bind';
import styles from './GroupDetail.module.scss';
import { useParams } from 'react-router-dom';
import groupApi from '../../api/groupApi';
import GroupInformation from '../../components/GroupInformation';
import Rightbar from '../../components/rightbar/Rightbar';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

export default function GroupDetailLayout() {
  const { groupId } = useParams();
  const [group, setGroup] = useState({});

  useEffect(() => {
    groupApi.getOne(groupId).then((group) => {
      setGroup(group);
    })
  }, [groupId])




  return (
    <LayoutGroup >
      <GroupInformation group={group} />
      <div className={cx('content')}>
        <Feed isShare={true} groupId={groupId} />
        <Rightbar />
      </div>
    </LayoutGroup >

  );
}
