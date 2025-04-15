'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Users {
  id: number
  name: string
  email: string
}

export default function Home() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Se não houver token, redireciona para a página de registro
    if (!token) {
      router.push('/register');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // Token inválido ou expirado
          router.push('/register');
          return;
        }

        if (!res.ok) {
          throw new Error('Erro na resposta da rede');
        }

        return res.json();
      })
      .then((data) => {
        if (data) {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar usuários:', err);
        setLoading(false);
      });
  }, [router]);

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
