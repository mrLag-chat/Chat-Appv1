import "./sidenav.css";
import { useState } from "react";
import Search from "../search/search";
import UserList from "../userList/userList";

function Sidenav({ socket }) {
  let [search, setSearch] = useState("");
  return (
    <div className="sidenav">
      {/* Main sidenav container */}
      <div className="sidenav-header">
        {/* Search section */}
        <div className="search-section">
          <Search search={search} setSearch={setSearch} />
        </div>
        {/* User list section */}
        <div className="user-list-section">
          <UserList searchKey={search} socket={socket}></UserList>
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
