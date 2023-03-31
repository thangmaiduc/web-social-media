import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import './group.css';
import LayoutGroup from '../../layouts/LayoutGroups/LayoutGroups';


export default function Group() {

  return (
    <LayoutGroup >
      <div className="homeContainer">
        <Sidebar />
        <Feed />
      </div>
    </LayoutGroup>
  );
}
