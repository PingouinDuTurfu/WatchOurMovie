import axios, { AxiosInstance, AxiosError } from "axios";
import { hashPassword } from "./HashUtils";

interface LoginRequestBody {
  username: string;
  hashPassword: string;
}

export default abstract class ApiUtils {
  private static AUTH_TOKEN: string | null = null;
  private static USER_ID: string | null = null;
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

  static async login(username: string, password: string): Promise<string | null> {
    const hashedPassword = hashPassword(password);

    const requestBody: LoginRequestBody = {
      username: username,
      hashPassword: hashedPassword,
    };

    try { 
      const response = await ApiUtils.API_INSTANCE_JSON.post("/login", requestBody);
      const token = response.data.token;

      ApiUtils.setAuthToken = token;
      return token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          throw new Error("Identifiant ou mot de passe incorrect.");
        }
      }
      return null;
    }
  }

  static logout() {
    ApiUtils.setAuthToken(null);
  }

  static getAuthToken(): string | null {
    return ApiUtils.AUTH_TOKEN;
  }

  static setAuthToken(token: string | null): void {
    ApiUtils.AUTH_TOKEN = token;
  }

  static getUserId(): string | null {
    return ApiUtils.USER_ID;
  }

  static setUserId(userId: string | null): void {
    ApiUtils.USER_ID = userId;
  }
}
