import MeetingsFindContent from '@/features/meetings/components/meeting/MeetingsFindContent';


interface MeetingsListPageProps {
  searchParams: Promise<{
    keyword?: string;
  }>;
}

export default async function MeetingsListPage({
  searchParams,
}: MeetingsListPageProps) {
  const { keyword } = await searchParams;

  return <MeetingsFindContent keyword={keyword} />;
}