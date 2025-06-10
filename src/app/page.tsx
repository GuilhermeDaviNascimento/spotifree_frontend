'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Importando a configuração do Firebase

interface Users {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
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

  // Função para editar os dados do usuário
  const handleEdit = (user: Users) => {
    setEditingUser(user);
    setNewName(user.name);
    setNewEmail(user.email);
  };

  // Função para atualizar o usuário no Firestore
  const handleUpdate = async () => {
    if (!editingUser) return;

    const userDocRef = doc(db, 'users', editingUser.id);

    try {
      await updateDoc(userDocRef, {
        name: newName,
        email: newEmail,
      });

      // Atualizar a lista de usuários no estado
      setUsers(users.map((user) =>
        user.id === editingUser.id ? { ...user, name: newName, email: newEmail } : user
      ));
      
      setEditingUser(null); // Limpar estado de edição
      alert('Usuário atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      alert('Erro ao atualizar usuário.');
    }
  };

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
              <button
                onClick={() => handleEdit(user)}
                className="mt-2 p-2 text-white rounded hover:cursor-pointer"
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      )}

      {editingUser && (
        <div className="mt-6 p-4 border border-gray-200 rounded shadow-sm">
          <h2 className="text-lg font-semibold">Editar Usuário</h2>
          <div className="mt-4">
            <label className="block text-sm">Nome</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpdate}
              className="p-2 bg-green-500 text-white rounded"
            >
              Atualizar
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="ml-2 p-2 bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
