import axiosInstance from './axiosInstance';

export const getUser = async (token) => {
  const response = await axiosInstance.get('/core/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);
  return response;
};
