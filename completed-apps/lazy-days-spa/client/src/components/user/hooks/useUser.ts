import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { generateUserKey } from "@/react-query/key-factories";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const queryClient = useQueryClient();

  // get details on the userId
  const { userId, userToken } = useLoginData();

  // call useQuery to update user data from server
  const { data: user } = useQuery({
    // 사용자가 로그인 안했을 때, userId는 null. 이땐 쿼리함수 실행 안하게 enabled 설정
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    );
  }

  // meant to be called from useAuth
  function clearUser() {
    // remove user profile data
    queryClient.removeQueries({ queryKey: [queryKeys.user] });

    // remove user appointments data
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user],
    });
  }

  return { user, updateUser, clearUser };
}
