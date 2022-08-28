import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import SearchFeed from '../../components/searchFeed/SearchFeed';
import Rightbar from '../../components/rightbar/Rightbar';
import './search.css';
import { useParams } from 'react-router-dom';


export default function Search() {
  const { searchText} = useParams();
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <SearchFeed searchText={searchText}/>
        <Rightbar />
      </div>
    </>
  );
}
