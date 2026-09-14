interface MeetingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MeetingDetailPage({
  params,
}: MeetingDetailPageProps) {
  const { id } = await params;

  return <main>모임 상세 페이지 - ID: {id}</main>;
}
