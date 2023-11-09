import axios, { AxiosResponse } from "axios";

const API_BASE_URL = process.env.REACT_APP_API;

export interface IUser {
  data: any;
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  picture: string;
}

// Login
export const loginService = async (
  email: string,
  password: string
): Promise<AxiosResponse<any> | undefined> => {
  try {
    const response = await axios.post<any>(`${API_BASE_URL}/admin-signin`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.data);
    return response;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

// Getuser from token
export const getUserProfile = async (): Promise<
  AxiosResponse<IUser> | undefined
> => {
  try {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      return undefined;
    }
    const response = await axios.get<IUser>(`${API_BASE_URL}/loggedadmin`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response;
  } catch (error) {
    return undefined;
  }
};

// Get Profile from Id
export const getProfileById = async (
  id: string | any
): Promise<AxiosResponse<IUser> | undefined> => {
  try {
    const response = await axios.get<IUser>(`${API_BASE_URL}/getAdmin/${id}`);
    return response;
  } catch (error) {
    return undefined;
  }
};

// Update Profile by ID
export const updateProfile = async (
  id: string | any,
  user: IUser | any
): Promise<AxiosResponse<any> | undefined> => {
  try {
    const formData = new FormData();
    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("email", user.email);
    formData.append("phone", user.phone);

    if (user?.picture instanceof File) {
      formData.append("picture", user.picture);
    }

    const response = await axios.put(
      `${API_BASE_URL}/updateAdmin/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Get All Users
