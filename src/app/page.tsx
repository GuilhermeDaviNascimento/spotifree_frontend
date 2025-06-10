'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Importando a configuração do Firebase

interface Users {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    // Verifica se o usuário está autenticado com o Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Se não estiver autenticado, redireciona para o registro
        router.push('/register');
        return;
      }

      try {
        // Buscar usuários do Firestore
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList as unknown as Users[]);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setLoading(false);
      }
    });

    // Cleanup quando o componente for desmontado
    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return <div className="p-4">Carregando usuários...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Usuários</h1>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="p-4 border border-gray-200 rounded shadow-sm">
              <p>
                <strong>Nome:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
