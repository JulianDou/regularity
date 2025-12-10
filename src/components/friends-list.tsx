"use client";

import { fetchFriendsList } from "@/app/lib/actions";
import { useEffect, useState } from "react";

export default function FriendsList(){
  const [friends, setFriends] = useState<Array<{username: string, mutual: boolean}>>([]);
  
  const loadFriends = async () => {
    try {
      const data = await fetchFriendsList();
      if (data && data.length > 0) {
        setFriends(data as Array<{username: string, mutual: boolean}>);
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  };

  useEffect(() => {    
    loadFriends();
  }, []);

  return (
    <div className="text-foreground flex flex-col w-full h-full gap-2">
      <p className="font-pixelify-sans">
        Amis
      </p>
      <ul className="flex flex-col w-full gap-2 border-2 border-foreground font-pixelify-sans">
        {
          friends.length === 0 ? (
            <li className="text-intermediate p-4">Aucun ami pour le moment</li>
          ) : (
            friends.map((friend, index) => (
              <li 
                key={friend.username} 
                className={`
                    flex justify-between items-center p-4 
                    ${index === friends.length - 1 ? "" : "border-b border-border"} 
                    hover:bg-foreground hover:text-background
                `}
              >
                {friend.username}
                {
                  !friend.mutual &&
                  <p className="text-intermediate">
                    En attente
                  </p>
                }
              </li>
            ))
          )
        }
      </ul>
    </div>
  );
}
