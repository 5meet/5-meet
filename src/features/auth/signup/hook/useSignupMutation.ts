import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

import { signup } from "../api/signup";

export const useSignupMutation = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: signup,
    onSuccess:() => {
      router.replace("/login")
    }
  });
};
