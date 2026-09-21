import { useMutation } from "@tanstack/react-query";

import { signup } from "../api/signup";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signup,
  });
};
