import { Usuario } from "@/entities/usuario";
import { api } from "./api";

export type LoginData = {
  ra: string;
  senha: string;
};

export interface LoginResponseData {
  user: Usuario;
  token: string;
}

export class LoginErrorData {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export async function getUserInformation() {
  const response = await api.get("/me");

  return response.data["data"];
}

export async function signInRequest(
  data: LoginData
): Promise<LoginResponseData> {
  try {
    const response = await api.post("/auth", data);

    if (response.status == 200) {
      let responseData = response.data["data"];

      return {
        user: responseData.user,
        token: responseData.token,
      } as LoginResponseData;
    } else {
      let responseData = await response.data;

      throw new LoginErrorData(responseData.message);
    }
  } catch (error) {
    throw new LoginErrorData("Não foi possível realizar login!");
  }
}
