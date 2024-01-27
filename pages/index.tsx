import axios from 'axios';
import { useState, useCallback, useEffect } from 'react';

import { wrapRequestUrl } from '@/common/baseUrl';
import ErrorNotifier from '@/components/error';
import PencilIcon from '@/components/icon/pencil-icon';
import PersonIcon from '@/components/icon/person-icon';
import Post from '@/components/post';
import { GetPostResponseDto } from '@/dto/GetPostResponseDto';
import { ListPostResponseDto } from '@/dto/ListPostResponseDto';
import Link from 'next/link';
import LoginModal from '@/components/login-modal';
import { tokenStorage } from '@/common/token';
import WriteModal from '@/components/write-modal';

export default function Home() {
  const [postList, setPostList] = useState<ListPostResponseDto | null>(null);
  const [error, setError] = useState<any>(null);

  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [writeOpen, setWriteOpen] = useState<boolean>(false);

  const getPostList = useCallback(async () => {
    try {
      axios
        .get(wrapRequestUrl(`/posts`), { params: { offset: 0, limit: 10 } })
        .then((res) => {
          setPostList(res.data);
        });
    } catch (error) {
      setError(error);
    }
  }, []);

  const handleCloseWriteModal = () => {
    setWriteOpen(false);
    getPostList();
  };

  useEffect(() => {
    getPostList();
  }, [getPostList]);

  return (
    <>
      <div className="sticky top-0 top-menu-bar flex justify-between items-center p-2 w-96 h-12 mb-2">
        <button onClick={() => setLoginOpen(true)}>
          <PersonIcon />
        </button>
        <button onClick={() => setWriteOpen(true)}>
          <PencilIcon />
        </button>
      </div>
      <main className="space-y-4">
        {error && <ErrorNotifier error={error} />}
        {postList?.posts.map((post: GetPostResponseDto) => (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <Post
                id={post.id}
                title={post.title}
                content={post.content}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                createdAt={new Date(post.createdAt)}
              />
            </Link>
          </div>
        ))}
      </main>
      <LoginModal open={loginOpen} close={() => setLoginOpen(false)} />
      <WriteModal open={writeOpen} close={handleCloseWriteModal} />
    </>
  );
}
