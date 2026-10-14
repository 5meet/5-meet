interface TalkDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TalkDetailPage({ params }: TalkDetailPageProps) {
  const { id } = await params;

  return <main>달램 토크 상세 페이지 - ID: {id}</main>;
}
