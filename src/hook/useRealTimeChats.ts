import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";
import { db } from "../firebase/db";
import { UserWithRef } from "../context/UserContext";

export function useRealTimeChats(currentUserId: string | undefined) {
  const [otherUsers, setOtherUsers] = useState<UserWithRef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      setOtherUsers([]);
      return;
    }

    setLoading(true);

    const chatRef = collection(db, "chat");
    const q = query(
      chatRef,
      where("member", "array-contains", currentUserId),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          setOtherUsers([]);
          setLoading(false);
          return;
        }

        const otherMemberIds: string[] = [];
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const members: string[] = data.member;
          const otherId = members.find((id) => id !== currentUserId);
          if (otherId && !otherMemberIds.includes(otherId)) {
            otherMemberIds.push(otherId);
          }
        });

        if (otherMemberIds.length === 0) {
          setOtherUsers([]);
          setLoading(false);
          return;
        }

        const batchSize = 10;
        const fetchedUsers: UserWithRef[] = [];

        for (let i = 0; i < otherMemberIds.length; i += batchSize) {
          const batchIds = otherMemberIds.slice(i, i + batchSize);
          const usersQuery = query(
            collection(db, "users"),
            where("uid", "in", batchIds)
          );
          const userSnapshot = await getDocs(usersQuery);

          userSnapshot.forEach((userDoc) => {
            fetchedUsers.push({
              ...userDoc.data(),
              uid: userDoc.id,
            } as UserWithRef);
          });
        }

        const userMap = new Map(fetchedUsers.map((u) => [u.uid, u]));

        const combined = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            const members: string[] = data.member;
            const otherId = members.find((id) => id !== currentUserId);
            if (!otherId) return null;

            const user = userMap.get(otherId);
            if (!user) return null;

            return {
              ...user,
              ref: docSnap.ref as DocumentReference,
              lastMessage: data.lastMessage || "",
              lastMessageTime: data.lastMessageTime as Timestamp,
              lastRead: data.lastRead?.[currentUserId] || null,
            };
          })
          .filter(Boolean) as UserWithRef[];

        setOtherUsers(combined);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching chat data:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUserId]);

  return { otherUsers, loading };
}
