import { Usuario } from "@/entities/usuario";
import { HOST_API } from "@/utils/api-config";

export type LoginData = {
  ra: string;
  senha: string;
};

export type LoginResponseData = {
  user: Usuario;
  token: string;
};

export async function signInRequest(
  data: LoginData
): Promise<LoginResponseData> {
  const response = await fetch(HOST_API + "/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let responseData = (await response.json())["data"];

  return {
    user: responseData.user,
    token: responseData.token,
  } as LoginResponseData;
}
