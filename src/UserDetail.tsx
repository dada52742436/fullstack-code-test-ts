import React from 'react';
import { useParams } from 'react-router-dom';
import { User } from './App';  // get the user from app

interface UserDetailProps {
  users: User[];
}

const UserDetail: React.FC<UserDetailProps> = ({ users }) => {
  const { id } = useParams<{ id: string }>();  

  if (!id) {
    return <p>id is wrong</p>; // handle bad id
  }

  const user = users.find(user => user.id === parseInt(id));

  if (!user) {
    return <p>user wrong</p>; // handle bad user
  }

  //display userdetail
  return (
    <div className="user-detail">
      <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
      <h2>{`${user.first_name} ${user.last_name}`}</h2>
      <h2>{user.email}</h2>
    </div>
  );
};

export default UserDetail;