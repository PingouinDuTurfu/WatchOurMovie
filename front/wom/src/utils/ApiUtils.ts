import axios, { AxiosInstance } from "axios";
import { hashPassword } from "./HashUtils";

export default abstract class ApiUtils {
  private static AUTH_TOKEN: string | null = null;
  private static readonly API_BASE_URL = "http://localhost:4269";
  private static readonly API_INSTANCE_JSON = axios.create({
    baseURL: ApiUtils.API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  private static readonly API_INSTANCE_FORM_DATA = axios.create({
    baseURL: ApiUtils.API_BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  static getApiInstanceJson(): AxiosInstance {
    return ApiUtils.API_INSTANCE_JSON;
  }

  static getApiInstanceFormData(): AxiosInstance {
    return ApiUtils.API_INSTANCE_FORM_DATA;
  }

  static async login(
    username: string,
    password: string
  ): Promise<string | null> {
    try {
      const hashedPassword = hashPassword(password);
  
      const response = await ApiUtils.API_INSTANCE_JSON.post("/login", {
        username,
        hashedPassword,
      });
      
      const token = response.data.token;
      ApiUtils.AUTH_TOKEN = token;
      return token;
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    return ApiUtils.API_INSTANCE_JSON.post("/logout", {
      token: ApiUtils.AUTH_TOKEN,
    })
      .then(() => {
        ApiUtils.AUTH_TOKEN = null;
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  }

  static getAuthToken(): string | null {
    return ApiUtils.AUTH_TOKEN;
  }

  static setAuthToken(token: string): void {
    ApiUtils.AUTH_TOKEN = token;
  }
}
