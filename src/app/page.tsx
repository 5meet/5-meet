'use client'

import { Button } from "@/components/ui/Button/Button";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { LikeButton } from '@/components/ui/IconButton/LikeButton';
import { EditIcon, Hand, PenSquare, UserPlus } from "lucide-react";
import Image from "next/image";
import { useState } from 'react';

export default function Home() {
  const [isLiked, setIsLiked] = useState(false)
  const clickButton = () => {
    setIsLiked(!isLiked)
  }
  return (
    <div>
      <h1>메인페이지</h1>
      <div>
        <Button variant="primary" size="md" isLoading={true}>
          테스트
        </Button>
        <Button variant="secondary" size="md">
          테스트
        </Button>
      </div>
      <div>
        {/* <FloatingActionButton icon={UserPlus} label='모임 만들기' /> */}
        <FloatingActionButton icon={PenSquare} label="글쓰기" />
      </div>
      <div>
        <IconButton aria-label="수정하기" size="lg">
          <EditIcon />
        </IconButton>

        <LikeButton isLiked={isLiked} onToggle={clickButton} size='sm' />
        <LikeButton isLiked={isLiked} onToggle={clickButton} size='md' />
        <LikeButton isLiked={isLiked} onToggle={clickButton} size='lg' />
      </div>
    </div>
  );
}
