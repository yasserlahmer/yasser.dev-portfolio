import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useContent() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "content", "general"),
            (docSnap) => {
                if (docSnap.exists()) {
                    setContent(docSnap.data());
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching content:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { content, loading };
}
