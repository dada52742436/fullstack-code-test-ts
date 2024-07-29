import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Loading from './Loading';
import './App.css';
import { Users } from './api'; // Fetched users from api
import UserDetail from './UserDetail';

// Export the User interface
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); /* Create empty array for user */
  const [page, setPage] = useState(1); /* Page number init with 1 */
  const [loading, setLoading] = useState(true); /* Init loading bool true */
  const [MoreToShow, setMoreToShow] = useState(true); /* Init more to shown true */
  const [firstLoading, setfirstLoading] = useState(true); /* Initial loading for 3 seconds */

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await Users(page);
      console.log('Fetched users:', result.data);
      setUsers(CurUsers => {
        // Remove duplicates by ensuring that the new users do not already exist in the current users array
        const newUsers = result.data.filter((newUser: User) => !CurUsers.some(user => user.id === newUser.id));
        return [...CurUsers, ...newUsers];
      });
      setMoreToShow(result.page < result.total_pages);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms dealy to show users
    }
  }, [page]);

  useEffect(() => {
    setTimeout(() => {
      setfirstLoading(false); //set to false after 3 seconds
      loadUsers(); 
    }, 3000); // 3000 ms delay for first entry website
  }, [loadUsers]);

  useEffect(() => {
    const handleScroll = () => {
      console.log('Scroll event triggered');
      console.log('window.innerHeight:', window.innerHeight);
      console.log('document.documentElement.scrollTop:', document.documentElement.scrollTop);
      console.log('document.documentElement.offsetHeight:', document.documentElement.offsetHeight);
      console.log('loading:', loading);
      console.log('MoreToShow:', MoreToShow);
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
        !loading &&
        MoreToShow
      ) {
        console.log('Loading more users');
        setLoading(true); // Set loading to true immediately
        setTimeout(() => {
          setPage(curPage => {
            console.log('Incrementing page:', curPage + 1);
            return curPage + 1;
          });
        }, 1000); // 1-second delay before incrementing the page
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, MoreToShow]);

  useEffect(() => {
    if (!loading && MoreToShow && document.documentElement.scrollHeight <= window.innerHeight) {
      setPage(curPage => curPage + 1);
    }
  }, [loading, MoreToShow]);

  if (firstLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              loading && users.length === 0 ? (
                <Loading />
              ) : (
                <div className="user-list">
                  <h1>Users</h1>
                  {users.map((user, index) => (
                    <Link to={`/user/${user.id}`} key={`${user.id}-${index}`} className="user-card">
                      <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                      <div>
                        <p>{`${user.first_name} ${user.last_name}`}</p>
                      </div>
                    </Link>
                  ))}
                  {loading && <p>Loading more users...</p>}
                  {!loading && !MoreToShow && <p>No more users to load.</p>}
                </div>
              )
            }
          />
          <Route path="/user/:id" element={<UserDetail users={users} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
