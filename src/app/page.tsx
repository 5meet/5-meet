import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>메인페이지</h1>
      <div>
        <Button variant="primary" size="md">
          테스트
        </Button>
        <Button variant="secondary" size="md">
          테스트
        </Button>
      </div>
    </div>
  );
}
